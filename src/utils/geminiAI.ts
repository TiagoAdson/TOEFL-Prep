// Gemini 1.5 Flash — TOEFL Speaking audio evaluator

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
export const HAS_GEMINI = !!GEMINI_KEY && !GEMINI_KEY.includes('seu-key')

export interface GeminiSpeakingResult {
  score:    number   // 1-4 (ETS rubric)
  feedback: string
  strengths: string
  improvements: string
}

export async function evaluateSpeakingAudio(
  audioBlob: Blob,
  task: string
): Promise<GeminiSpeakingResult> {
  if (!HAS_GEMINI) return fallbackScore()

  const base64 = await blobToBase64(audioBlob)
  const mimeType = audioBlob.type || 'audio/webm'

  const systemPrompt = `You are an official ETS evaluator for the TOEFL iBT Speaking section.
RULES:
- Ignore foreign accents completely — accent does NOT affect the score.
- Penalize ONLY: long hesitations (3+ seconds), unnatural pauses, loss of fluency, unintelligibility.
- Score using the official ETS rubric: 1 (poor) to 4 (excellent).
- Task: "${task}"

Evaluate the audio and respond ONLY in valid JSON:
{
  "score": <1|2|3|4>,
  "feedback": "Overall evaluation in English (2-3 sentences)",
  "strengths": "What the speaker did well",
  "improvements": "Specific areas to improve for TOEFL"
}`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
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
          generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 400 },
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

function fallbackScore(): GeminiSpeakingResult {
  return {
    score: 0,
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
