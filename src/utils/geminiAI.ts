// Gemini 1.5 Flash — TOEFL Speaking audio evaluator + speaking history/memory

import { supabase, supabaseConfigured } from './supabase'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
export const HAS_GEMINI = !!GEMINI_KEY && !GEMINI_KEY.includes('seu-key')

export interface GeminiSpeakingResult {
  score:      number   // 1-4 (ETS rubric)
  transcript: string   // what the student actually said, transcribed by Gemini
  feedback:   string
  strengths:  string
  improvements: string
}

export interface SpeakingHistoryEntry {
  id: string
  task: string
  transcript: string | null
  score: number | null
  improvements: string | null
  created_at: string
  audio_path: string | null
  audio_size_bytes: number | null
}

// ---- Fetch the last N attempts for this task/module, so Gemini can "remember" past mistakes ----
export async function getSpeakingHistory(userId: string, contentId: string, limit = 5): Promise<SpeakingHistoryEntry[]> {
  if (!supabaseConfigured) return []
  const { data } = await supabase
    .from('speaking_history')
    .select('id, task, transcript, score, improvements, created_at, audio_path, audio_size_bytes')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as SpeakingHistoryEntry[]) || []
}

export async function evaluateSpeakingAudio(
  audioBlob: Blob,
  task: string,
  history: SpeakingHistoryEntry[] = []
): Promise<GeminiSpeakingResult> {
  if (!HAS_GEMINI) return fallbackScore()

  const base64 = await blobToBase64(audioBlob)
  const mimeType = audioBlob.type || 'audio/webm'

  const historyBlock = history.length > 0
    ? `\n\nPast attempts by this student on this task/module (most recent first) — use these to note improvement or repeated mistakes:\n` +
      history.map((h, i) => `${i + 1}. (${new Date(h.created_at).toLocaleDateString()}) said: "${h.transcript || '(no transcript)'}" — score ${h.score}/30 — needed to improve: ${h.improvements || 'n/a'}`).join('\n')
    : ''

  const systemPrompt = `You are an official ETS evaluator for the TOEFL iBT Speaking section.
RULES:
- Ignore foreign accents completely — accent does NOT affect the score.
- Penalize ONLY: long hesitations (3+ seconds), unnatural pauses, loss of fluency, unintelligibility.
- Score using the official ETS rubric: 1 (poor) to 4 (excellent).
- Task: "${task}"
- Transcribe exactly what the student said (in English, as spoken, including errors — do not correct grammar in the transcript).
${historyBlock ? '- Compare this attempt with the past attempts listed below: explicitly say if the student improved, fixed a repeated mistake, or made the same mistake again.' : ''}
${historyBlock}

Evaluate the audio and respond ONLY in valid JSON:
{
  "score": <1|2|3|4>,
  "transcript": "Exact transcription of what the student said",
  "feedback": "Overall evaluation in English (2-3 sentences), mentioning progress vs past attempts if any were provided",
  "strengths": "What the speaker did well",
  "improvements": "Specific areas to improve for TOEFL"
}`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{
            parts: [
              { text: `Evaluate this TOEFL Speaking response for the task: "${task}"` },
              { inline_data: { mime_type: mimeType, data: base64 } },
            ],
          }],
          generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 500 },
        }),
      }
    )
    if (!res.ok) return fallbackScore()
    const data = await res.json()
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as GeminiSpeakingResult
    return fallbackScore()
  } catch {
    return fallbackScore()
  }
}

// ---- Upload the audio + save transcript/score/apontamentos to speaking_history ----
export async function saveSpeakingAttempt(params: {
  userId: string
  contentId: string
  exerciseId?: string | null
  task: string
  result: GeminiSpeakingResult
  audioBlob?: Blob | null
}): Promise<void> {
  const { userId, contentId, exerciseId, task, result, audioBlob } = params
  if (!supabaseConfigured) return

  let audioPath: string | null = null
  let audioSize: number | null = null

  if (audioBlob) {
    const path = `${userId}/${Date.now()}.webm`
    const { error } = await supabase.storage.from('speaking-audio').upload(path, audioBlob, {
      contentType: audioBlob.type || 'audio/webm',
    })
    if (!error) {
      audioPath = path
      audioSize = audioBlob.size
    }
  }

  await supabase.from('speaking_history').insert({
    user_id: userId,
    content_id: contentId,
    exercise_id: exerciseId || null,
    task,
    transcript: result.transcript,
    score: Math.round(result.score * 7.5), // normalize 1-4 ETS -> /30
    feedback: result.feedback,
    strengths: result.strengths,
    improvements: result.improvements,
    audio_path: audioPath,
    audio_size_bytes: audioSize,
  })
}

function fallbackScore(): GeminiSpeakingResult {
  return {
    score: 0,
    transcript: '',
    feedback: 'Configure VITE_GEMINI_API_KEY no .env para ativar avaliação de áudio.',
    strengths: '',
    improvements: '',
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
