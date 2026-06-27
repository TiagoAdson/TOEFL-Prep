import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../utils/supabase'
import { useAuth } from '../contexts/AuthContext'
import { evaluateSpeakingAudio, HAS_GEMINI } from '../utils/geminiAI'
import {
  getTOEFLReadingFeedback,
  getTOEFLListeningFeedback,
  getTOEFLSpeakingFeedback,
  getTOEFLWritingFeedback,
  TOEFLSectionFeedback,
} from '../utils/feedbackAI'
import { TOEFL_SECTIONS, type TOEFLSectionInfo } from '../utils/theoryData'

// ============================================================
// TYPES
// ============================================================

type Section = 'reading' | 'listening' | 'speaking' | 'writing'
type Step = 'intro' | Section | 'results'
type Phase = 'answering' | 'evaluating' | 'feedback'

interface SectionResult {
  score: number
  feedback: TOEFLSectionFeedback | null
}

type AllResults = Record<Section, SectionResult>

interface MCQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

// ============================================================
// CONTENT
// ============================================================

const READING_PASSAGE = `The Industrial Revolution, which began in Britain during the late 18th century,
fundamentally transformed society by shifting the locus of production from the home to the factory.
This transition was driven by key technological innovations — the steam engine, the spinning jenny,
and the power loom — which dramatically increased productive capacity. However, these same inventions
displaced traditional artisan workers. As urbanization accelerated, workers migrated to cities in
search of factory employment, altering social structures and family dynamics in profound ways.`

const READING_QUESTIONS: MCQuestion[] = [
  {
    id: 'r1',
    question: 'According to the passage, what was the primary effect of the Industrial Revolution?',
    options: ['It decreased agricultural output', 'It shifted production from home to factory', 'It eliminated urban migration', 'It reduced technological innovation'],
    correctAnswer: 'It shifted production from home to factory',
  },
  {
    id: 'r2',
    question: 'Which of the following is NOT listed as a technological innovation in the passage?',
    options: ['The steam engine', 'The spinning jenny', 'The printing press', 'The power loom'],
    correctAnswer: 'The printing press',
  },
  {
    id: 'r3',
    question: 'The word "displaced" in the passage is closest in meaning to:',
    options: ['Employed', 'Trained', 'Replaced', 'Organized'],
    correctAnswer: 'Replaced',
  },
  {
    id: 'r4',
    question: 'Why did workers migrate to cities according to the passage?',
    options: ['To escape rural taxes', 'To seek factory employment', 'To pursue university education', 'To join the military'],
    correctAnswer: 'To seek factory employment',
  },
  {
    id: 'r5',
    question: 'What is the main purpose of this passage?',
    options: ['To argue against industrialization', 'To describe causes and effects of the Industrial Revolution', 'To compare economic systems', 'To celebrate technological progress'],
    correctAnswer: 'To describe causes and effects of the Industrial Revolution',
  },
]

const LISTENING_QUESTIONS: MCQuestion[] = [
  {
    id: 'l1',
    question: '[Academic Lecture] The professor states that the primary driver of rising global temperatures is:',
    options: ['Natural volcanic activity', 'Solar radiation increases', 'Human industrial and transportation emissions', 'Ocean current shifts'],
    correctAnswer: 'Human industrial and transportation emissions',
  },
  {
    id: 'l2',
    question: '[Academic Lecture] Which renewable energy source has seen the greatest cost reduction recently?',
    options: ['Hydroelectric power', 'Nuclear energy', 'Solar and wind energy', 'Geothermal energy'],
    correctAnswer: 'Solar and wind energy',
  },
  {
    id: 'l3',
    question: '[Student Conversation] The female student prefers group study because:',
    options: ['The library is too quiet', 'She learns better through discussion', 'She forgot her textbook', 'The professor requires it'],
    correctAnswer: 'She learns better through discussion',
  },
  {
    id: 'l4',
    question: '[Academic Lecture] The professor implies that addressing climate change requires:',
    options: ['Individual lifestyle changes only', 'Government regulation only', 'Both individual and systemic changes', 'Waiting for new technology'],
    correctAnswer: 'Both individual and systemic changes',
  },
  {
    id: 'l5',
    question: '[Office Hours] What does the professor advise the student to do about the missed deadline?',
    options: ['Retake the course', 'Submit work late with a penalty', 'Write a formal appeal letter', 'Speak with the department chair'],
    correctAnswer: 'Submit work late with a penalty',
  },
]

const SPEAKING_TASK = `Independent Speaking Task: Some people prefer living in a large city, while others prefer a small town or rural area. Which do you prefer and why? Include at least two specific reasons and examples to support your answer. (Typical TOEFL response: 45 seconds)`

const WRITING_TASK = `Independent Writing Task: Do you agree or disagree with the following statement? "Modern technology has made people less socially connected despite making communication easier." Use specific reasons and examples to support your position. Write a minimum of 150 words.`

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Simulado() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('intro')
  const [results, setResults] = useState<AllResults>({
    reading:   { score: 0, feedback: null },
    listening: { score: 0, feedback: null },
    speaking:  { score: 0, feedback: null },
    writing:   { score: 0, feedback: null },
  })
  const [saving, setSaving] = useState(false)

  const sections: Section[] = ['reading', 'listening', 'speaking', 'writing']

  const handleSectionFinish = async (section: Section, result: SectionResult) => {
    const updated: AllResults = { ...results, [section]: result }
    setResults(updated)
    const nextIdx = sections.indexOf(section) + 1
    if (nextIdx < sections.length) {
      setStep(sections[nextIdx])
    } else {
      await saveAndShowResults(updated)
    }
  }

  const saveAndShowResults = async (finalResults: AllResults) => {
    setSaving(true)
    const payload = {
      reading_score:  finalResults.reading.score,
      listening_score: finalResults.listening.score,
      speaking_score: finalResults.speaking.score,
      writing_score:  finalResults.writing.score,
    }
    const total = Object.values(payload).reduce((a, b) => a + b, 0)
    if (supabaseConfigured) {
      try {
        await supabase.from('simulado_history').insert({
          user_id: user?.id,
          date: new Date().toISOString().split('T')[0],
          ...payload,
          total_score: total,
          toefl_equivalent: total,
        })
      } catch (err) {
        console.error('Erro ao salvar simulado:', err)
      }
    }
    setSaving(false)
    setStep('results')
  }

  if (step === 'intro')     return <SimuladoIntro onStart={() => setStep('reading')} onBack={() => navigate('/')} />
  if (step === 'reading')   return <SectionReading onFinish={(r) => handleSectionFinish('reading', r)} />
  if (step === 'listening') return <SectionListening onFinish={(r) => handleSectionFinish('listening', r)} />
  if (step === 'speaking')  return <SectionSpeaking onFinish={(r) => handleSectionFinish('speaking', r)} />
  if (step === 'writing')   return <SectionWriting onFinish={(r) => handleSectionFinish('writing', r)} />
  if (step === 'results')   return <SimuladoResults results={results} saving={saving} onBack={() => navigate('/')} />
  return null
}

// ============================================================
// INTRO
// ============================================================

function SimuladoIntro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const items = [
    { icon: '📖', name: 'Reading',   pts: '30', desc: 'Texto academico + 5 questoes de multipla escolha — avaliado por IA' },
    { icon: '🎧', name: 'Listening', pts: '30', desc: 'Simulacao de audio + 5 questoes de compreensao — avaliado por IA' },
    { icon: '🎤', name: 'Speaking',  pts: '30', desc: 'Escreva como falaria em voz alta — IA avalia com rubrica TOEFL' },
    { icon: '✍️', name: 'Writing',   pts: '30', desc: 'Redacao academica (min. 150 palavras) — IA avalia com rubrica oficial' },
  ]

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Simulado TOEFL IBT</h2>
        <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 15 }}>
          4 secoes com avaliacao por IA (Claude). Score maximo: 120 pontos.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 28, background: 'white' }}>
        {items.map((item, i) => (
          <div key={item.name} style={{
            display: 'flex', gap: 16, padding: '16px 20px', alignItems: 'flex-start',
            borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
          }}>
            <span style={{ fontSize: 20, marginTop: 2, width: 28, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: '#111827' }}>{item.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>{item.pts} pts</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" onClick={onBack}>Voltar</button>
        <button className="btn-primary" onClick={onStart} style={{ flex: 1, fontSize: 15 }}>
          Iniciar Simulado →
        </button>
      </div>
    </div>
  )
}

// ============================================================
// READING SECTION
// ============================================================

function SectionReading({ onFinish }: { onFinish: (r: SectionResult) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>('answering')
  const [aiFeedback, setAiFeedback] = useState<TOEFLSectionFeedback | null>(null)
  const done = Object.keys(answers).length

  const handleSubmit = async () => {
    setPhase('evaluating')
    const questions = READING_QUESTIONS.map(q => ({
      id: q.id, question: q.question, options: q.options,
      correctAnswer: q.correctAnswer, userAnswer: answers[q.id] ?? '',
    }))
    const fb = await getTOEFLReadingFeedback(READING_PASSAGE, questions)
    setAiFeedback(fb)
    setPhase('feedback')
  }

  if (phase === 'evaluating') return <EvaluatingScreen section="Reading" />
  if (phase === 'feedback' && aiFeedback) {
    return <AIFeedbackPanel icon="📖" section="Reading" feedback={aiFeedback}
      onContinue={() => onFinish({ score: aiFeedback.score, feedback: aiFeedback })} />
  }

  return (
    <SectionWrapper icon="📖" title="Reading" sectionNum={1}
      current={done} total={READING_QUESTIONS.length}
      onSubmit={handleSubmit} canSubmit={done === READING_QUESTIONS.length}>

      <TOEFLInfoCard info={TOEFL_SECTIONS.reading} />

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Passage</p>
        <p style={{ lineHeight: 1.85, color: '#111827', fontSize: 15, whiteSpace: 'pre-line' }}>{READING_PASSAGE}</p>
      </div>

      {READING_QUESTIONS.map((q, i) => (
        <QuestionCard key={q.id} num={i + 1} question={q.question} options={q.options}
          selected={answers[q.id]} onSelect={(v) => setAnswers(p => ({ ...p, [q.id]: v }))} />
      ))}
    </SectionWrapper>
  )
}

// ============================================================
// LISTENING SECTION
// ============================================================

function SectionListening({ onFinish }: { onFinish: (r: SectionResult) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>('answering')
  const [aiFeedback, setAiFeedback] = useState<TOEFLSectionFeedback | null>(null)
  const done = Object.keys(answers).length

  const handleSubmit = async () => {
    setPhase('evaluating')
    const questions = LISTENING_QUESTIONS.map(q => ({
      id: q.id, question: q.question, options: q.options,
      correctAnswer: q.correctAnswer, userAnswer: answers[q.id] ?? '',
    }))
    const fb = await getTOEFLListeningFeedback(questions)
    setAiFeedback(fb)
    setPhase('feedback')
  }

  if (phase === 'evaluating') return <EvaluatingScreen section="Listening" />
  if (phase === 'feedback' && aiFeedback) {
    return <AIFeedbackPanel icon="🎧" section="Listening" feedback={aiFeedback}
      onContinue={() => onFinish({ score: aiFeedback.score, feedback: aiFeedback })} />
  }

  return (
    <SectionWrapper icon="🎧" title="Listening" sectionNum={2}
      current={done} total={LISTENING_QUESTIONS.length}
      onSubmit={handleSubmit} canSubmit={done === LISTENING_QUESTIONS.length}>

      <TOEFLInfoCard info={TOEFL_SECTIONS.listening} />

      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
        padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center'
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>🎧</span>
        <div>
          <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 14, marginBottom: 2 }}>Simulacao de Audio TOEFL</div>
          <div style={{ fontSize: 13, color: '#3b82f6', lineHeight: 1.5 }}>
            Responda as questoes como se tivesse ouvido lectures e conversacoes academicas reais.
          </div>
        </div>
      </div>

      {LISTENING_QUESTIONS.map((q, i) => (
        <QuestionCard key={q.id} num={i + 1} question={q.question} options={q.options}
          selected={answers[q.id]} onSelect={(v) => setAnswers(p => ({ ...p, [q.id]: v }))} />
      ))}
    </SectionWrapper>
  )
}

// ============================================================
// SPEAKING SECTION
// ============================================================

function SpeakingCountdown({ seconds, total }: { seconds: number; total: number }) {
  const pct = (seconds / total) * 100
  const color = seconds <= 10 ? '#EF4444' : seconds <= 20 ? '#F59E0B' : '#22C55E'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 12 }}>
      <div style={{ width: 40, height: 40, position: 'relative', flexShrink: 0 }}>
        <svg viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="20" cy="20" r="16" fill="none" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 16 * pct / 100} ${2 * Math.PI * 16}`}
            style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }} />
        </svg>
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color }}>
          {seconds}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Tempo Speaking TOEFL</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>45 segundos · sem colar texto · escreva como falaria</div>
      </div>
    </div>
  )
}

function WritingCountdown({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isUrgent = seconds <= 120
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: isUrgent ? '#FEE2E2' : '#F0FDF4', marginBottom: 10 }}>
      <span style={{ fontSize: 13 }}>⏱</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: isUrgent ? '#991B1B' : '#166534', fontVariantNumeric: 'tabular-nums' }}>
        {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
      </span>
      <span style={{ fontSize: 11, color: isUrgent ? '#B91C1C' : '#15803D' }}>restantes</span>
    </div>
  )
}

function SectionSpeaking({ onFinish }: { onFinish: (r: SectionResult) => void }) {
  const [response, setResponse] = useState('')
  const [phase, setPhase] = useState<Phase>('answering')
  const [aiFeedback, setAiFeedback] = useState<TOEFLSectionFeedback | null>(null)
  const [timeLeft, setTimeLeft] = useState(45)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Audio recording state
  const [useAudio, setUseAudio] = useState(HAS_GEMINI)
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length
  const canSubmit = useAudio ? !!audioBlob : wordCount >= 10

  useEffect(() => {
    if (phase !== 'answering') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          if (recording) stopRecording()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase, recording])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
    } catch {
      alert('Permissão de microfone negada. Use o modo texto como alternativa.')
      setUseAudio(false)
    }
  }

  function stopRecording() {
    mediaRef.current?.stop()
    setRecording(false)
  }

  const handleSubmit = async () => {
    clearInterval(timerRef.current!)
    setPhase('evaluating')

    let fb: TOEFLSectionFeedback
    if (useAudio && audioBlob) {
      const gemResult = await evaluateSpeakingAudio(audioBlob, SPEAKING_TASK)
      // Convert 1-4 ETS score to /30 for consistency
      fb = {
        score: Math.round(gemResult.score * 7.5),
        level: gemResult.score >= 4 ? 'Excelente' : gemResult.score >= 3 ? 'Avancado' : gemResult.score >= 2 ? 'Intermediario' : 'Basico',
        strengths: gemResult.strengths,
        improvements: gemResult.improvements,
        tips: gemResult.feedback,
        detail: `Score ETS: ${gemResult.score}/4`,
      }
    } else {
      fb = await getTOEFLSpeakingFeedback(SPEAKING_TASK, response)
    }

    setAiFeedback(fb)
    setPhase('feedback')
  }

  if (phase === 'evaluating') return <EvaluatingScreen section="Speaking" />
  if (phase === 'feedback' && aiFeedback) {
    return <AIFeedbackPanel icon="🎤" section="Speaking" feedback={aiFeedback}
      onContinue={() => onFinish({ score: aiFeedback.score, feedback: aiFeedback })} />
  }

  return (
    <SectionWrapper icon="🎤" title="Speaking" sectionNum={3}
      current={canSubmit ? 1 : 0} total={1}
      onSubmit={handleSubmit} canSubmit={canSubmit}>

      <TOEFLInfoCard info={TOEFL_SECTIONS.speaking} />

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px', marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Tarefa Speaking</p>
        <p style={{ lineHeight: 1.75, color: '#111827', fontSize: 15 }}>{SPEAKING_TASK}</p>
      </div>

      <SpeakingCountdown seconds={timeLeft} total={45} />

      {/* Toggle: áudio vs texto */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button
          onClick={() => setUseAudio(true)}
          style={{ ...tabBtn, ...(useAudio ? tabActive : {}) }}
          disabled={!HAS_GEMINI}
          title={!HAS_GEMINI ? 'Adicione VITE_GEMINI_API_KEY ao .env' : ''}
        >
          🎙 Gravar Áudio {!HAS_GEMINI && '(key ausente)'}
        </button>
        <button onClick={() => setUseAudio(false)} style={{ ...tabBtn, ...(!useAudio ? tabActive : {}) }}>
          ✍️ Resposta Escrita
        </button>
      </div>

      {useAudio ? (
        <div style={{ textAlign: 'center', padding: '20px', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
          {!audioBlob ? (
            <>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{recording ? '🔴' : '🎙'}</div>
              <button
                onClick={recording ? stopRecording : startRecording}
                style={{
                  padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
                  background: recording ? '#EF4444' : '#4F46E5', color: 'white',
                }}
              >
                {recording ? '⏹ Parar Gravação' : '▶ Iniciar Gravação'}
              </button>
              {recording && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>Gravando... fale agora</p>}
            </>
          ) : (
            <>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <p style={{ fontSize: 14, color: '#166534', fontWeight: 600 }}>Áudio gravado com sucesso!</p>
              <button onClick={() => setAudioBlob(null)} style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6 }}>
                Regravar
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Escreva em inglês como você falaria em voz alta:
          </label>
          <textarea
            className="exercise-textarea"
            placeholder="I prefer living in a large city because..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onPaste={e => e.preventDefault()}
            spellCheck={false}
            autoCorrect="off"
            rows={7}
            style={{ marginBottom: 8 }}
          />
          <div style={{ textAlign: 'right', fontSize: 13, color: canSubmit ? '#16a34a' : '#6b7280' }}>
            {wordCount} palavras {!canSubmit && '(mínimo 10)'}
          </div>
        </>
      )}
    </SectionWrapper>
  )
}

const tabBtn: React.CSSProperties = {
  padding: '7px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb',
  background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: '#6b7280',
}
const tabActive: React.CSSProperties = {
  background: '#EEF2FF', borderColor: '#4F46E5', color: '#4F46E5', fontWeight: 600,
}

// ============================================================
// WRITING SECTION
// ============================================================

function SectionWriting({ onFinish }: { onFinish: (r: SectionResult) => void }) {
  const [essay, setEssay] = useState('')
  const [phase, setPhase] = useState<Phase>('answering')
  const [aiFeedback, setAiFeedback] = useState<TOEFLSectionFeedback | null>(null)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length
  const canSubmit = wordCount >= 150

  useEffect(() => {
    if (phase !== 'answering') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  const handleSubmit = async () => {
    clearInterval(timerRef.current!)
    setPhase('evaluating')
    const fb = await getTOEFLWritingFeedback(WRITING_TASK, essay)
    setAiFeedback(fb)
    setPhase('feedback')
  }

  if (phase === 'evaluating') return <EvaluatingScreen section="Writing" />
  if (phase === 'feedback' && aiFeedback) {
    return <AIFeedbackPanel icon="✍️" section="Writing" feedback={aiFeedback} isLast
      onContinue={() => onFinish({ score: aiFeedback.score, feedback: aiFeedback })} />
  }

  return (
    <SectionWrapper icon="✍️" title="Writing" sectionNum={4}
      current={canSubmit ? 1 : 0} total={1}
      onSubmit={handleSubmit} canSubmit={canSubmit}>

      <TOEFLInfoCard info={TOEFL_SECTIONS.writing} />

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px', marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Tarefa Writing</p>
        <p style={{ lineHeight: 1.75, color: '#111827', fontSize: 15 }}>{WRITING_TASK}</p>
      </div>

      <WritingCountdown seconds={timeLeft} />
      <textarea
        className="exercise-textarea"
        placeholder="Technology has dramatically changed the way people communicate..."
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        onPaste={e => e.preventDefault()}
        spellCheck={false}
        autoCorrect="off"
        rows={11}
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: canSubmit ? '#16a34a' : '#d97706' }}>
          {canSubmit ? 'Pronto para enviar!' : `Minimo 150 palavras — escreva mais ${150 - wordCount} palavras para enviar`}
        </span>
        <span style={{ color: '#6b7280' }}>{wordCount} / 150+</span>
      </div>
    </SectionWrapper>
  )
}

// ============================================================
// RESULTS
// ============================================================

function SimuladoResults({ results, saving, onBack }: {
  results: AllResults; saving: boolean; onBack: () => void
}) {
  const sections = [
    { key: 'reading'   as Section, icon: '📖', name: 'Reading' },
    { key: 'listening' as Section, icon: '🎧', name: 'Listening' },
    { key: 'speaking'  as Section, icon: '🎤', name: 'Speaking' },
    { key: 'writing'   as Section, icon: '✍️', name: 'Writing' },
  ]
  const total = sections.reduce((sum, s) => sum + results[s.key].score, 0)
  const gap = 110 - total

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Hero score */}
      <div style={{ textAlign: 'center', padding: '32px 0 28px', borderBottom: '1px solid #e5e7eb', marginBottom: 28 }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{total}</div>
        <div style={{ color: '#6b7280', fontSize: 16, marginTop: 6, marginBottom: 16 }}>de 120 pontos</div>
        <span style={{
          display: 'inline-block', padding: '6px 20px', borderRadius: 20, fontSize: 14, fontWeight: 600,
          background: total >= 80 ? '#dcfce7' : total >= 50 ? '#fef3c7' : '#fee2e2',
          color: total >= 80 ? '#166534' : total >= 50 ? '#92400e' : '#991b1b',
        }}>
          {gap > 0 ? `${gap} pontos abaixo da meta de 110` : 'Meta TOEFL 110+ atingida!'}
        </span>
      </div>

      {/* Section scores grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {sections.map(s => {
          const r = results[s.key]
          return (
            <div key={s.key} style={{
              background: 'white', border: '1px solid #e5e7eb', borderRadius: 12,
              padding: '20px 16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{r.score}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{s.name} / 30</div>
              {r.feedback && (
                <div style={{
                  marginTop: 8, fontSize: 11, fontWeight: 700, color: '#2563eb',
                  background: '#eff6ff', borderRadius: 8, padding: '3px 10px', display: 'inline-block'
                }}>
                  {r.feedback.level}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Per-section feedback */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {sections.map(s => {
          const fb = results[s.key].feedback
          if (!fb) return null
          return (
            <div key={s.key} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '13px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{s.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{s.name}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 800, color: '#2563eb', fontSize: 15 }}>{results[s.key].score}/30</span>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.55, margin: 0 }}>
                  <strong>Positivo:</strong> {fb.strengths}
                </p>
                <p style={{ fontSize: 14, color: '#92400e', lineHeight: 1.55, margin: 0 }}>
                  <strong>Melhorar:</strong> {fb.improvements}
                </p>
                {fb.tips && (
                  <p style={{ fontSize: 14, color: '#1d4ed8', lineHeight: 1.55, margin: 0 }}>
                    <strong>Dica:</strong> {fb.tips}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {saving && <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 16, fontSize: 14 }}>Salvando resultado...</p>}

      <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }} onClick={onBack}>
        Voltar ao Dashboard
      </button>
    </div>
  )
}

// ============================================================
// TOEFL INFO CARD
// ============================================================

function TOEFLInfoCard({ info }: { info: TOEFLSectionInfo }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid #d1fae5', borderRadius: 10, overflow: 'hidden', marginBottom: 20, background: 'white' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 18px', background: open ? '#f0fdf4' : '#f9fafb',
          border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 16 }}>🎓</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#166534', flex: 1 }}>
          O que é esta seção? Como se preparar?
        </span>
        <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
          {open ? 'ocultar ▲' : 'ver dicas ▼'}
        </span>
      </button>

      {open && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #d1fae5' }}>
          {/* What it is */}
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 14 }}>{info.what}</p>

          {/* Format */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 7, padding: '10px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: 0.8 }}>Formato</span>
            <p style={{ margin: '5px 0 0', fontSize: 13, color: '#14532d', lineHeight: 1.6 }}>{info.format}</p>
          </div>

          {/* Strategies */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
              Estratégias para Pontuar Mais
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {info.strategies.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                  <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time */}
          <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: 7, padding: '9px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>⏱</span>
            <p style={{ margin: 0, fontSize: 13, color: '#713f12', lineHeight: 1.6 }}>{info.timeInfo}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function SectionWrapper({ icon, title, sectionNum, current, total, onSubmit, canSubmit, children }: {
  icon: string; title: string; sectionNum: number
  current: number; total: number
  onSubmit: () => void; canSubmit: boolean
  children: ReactNode
}) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, marginBottom: 4 }}>
          Secao {sectionNum} de 4
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>{title}</h2>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#6b7280' }}>{current}/{total}</span>
        </div>
        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#2563eb', width: `${pct}%`, transition: 'width 0.4s' }} />
        </div>
      </div>

      {children}

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{ width: '100%', padding: '14px', fontSize: 15 }}
        >
          {canSubmit ? 'Enviar para Avaliacao IA →' : `Complete todas as questoes (${current}/${total})`}
        </button>
      </div>
    </div>
  )
}

function QuestionCard({ num, question, options, selected, onSelect }: {
  num: number; question: string; options: string[]; selected?: string; onSelect: (v: string) => void
}) {
  return (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px', marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px' }}>
        Questao {num}
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.65, margin: '0 0 16px', color: '#111827', fontWeight: 500 }}>{question}</p>
      <div className="options-list">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-btn ${selected === opt ? 'selected' : ''}`}
            onClick={() => onSelect(opt)}
          >
            <span style={{ fontWeight: 700, marginRight: 10, color: selected === opt ? '#2563eb' : '#9ca3af' }}>
              {String.fromCharCode(65 + idx)}.
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function EvaluatingScreen({ section }: { section: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid #e5e7eb',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 28px',
      }} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
        Avaliando {section}...
      </h2>
      <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6 }}>
        A IA esta analisando suas respostas com a rubrica oficial TOEFL
      </p>
    </div>
  )
}

function AIFeedbackPanel({ icon, section, feedback, onContinue, isLast = false }: {
  icon: string; section: string
  feedback: TOEFLSectionFeedback
  onContinue: () => void
  isLast?: boolean
}) {
  const levelMap: Record<string, { bg: string; color: string }> = {
    'Excelente':          { bg: '#dcfce7', color: '#166534' },
    'Avancado':           { bg: '#d1fae5', color: '#065f46' },
    'Intermediario':      { bg: '#fef3c7', color: '#92400e' },
    'Basico':             { bg: '#ffedd5', color: '#9a3412' },
    'Abaixo do basico':   { bg: '#fee2e2', color: '#991b1b' },
  }
  const lc = levelMap[feedback.level] ?? { bg: '#eff6ff', color: '#1d4ed8' }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Score header */}
      <div style={{ textAlign: 'center', padding: '28px 0', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Resultado {section}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{feedback.score}</span>
          <span style={{ fontSize: 22, color: '#9ca3af' }}>/30</span>
        </div>
        <span style={{
          display: 'inline-block', padding: '5px 18px', borderRadius: 20,
          fontSize: 13, fontWeight: 700, background: lc.bg, color: lc.color,
        }}>
          {feedback.level}
        </span>
      </div>

      {/* Feedback rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <FeedbackRow emoji="✅" label="Pontos Positivos" text={feedback.strengths} accent="#16a34a" />
        <FeedbackRow emoji="🎯" label="O que Melhorar"  text={feedback.improvements} accent="#d97706" />
        <FeedbackRow emoji="💡" label="Dicas TOEFL"     text={feedback.tips} accent="#2563eb" />
        {feedback.detail && <FeedbackRow emoji="📝" label="Analise"  text={feedback.detail} accent="#6b7280" />}
      </div>

      <button className="btn-primary" onClick={onContinue} style={{ width: '100%', padding: '14px', fontSize: 15 }}>
        {isLast ? 'Ver Resultados Finais →' : 'Continuar para proxima secao →'}
      </button>
    </div>
  )
}

function FeedbackRow({ emoji, label, text, accent }: {
  emoji: string; label: string; text: string; accent: string
}) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderLeft: `4px solid ${accent}`,
      borderRadius: '0 10px 10px 0',
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: 14 }}>{emoji}</span>
        <span style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: accent }}>
          {label}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: '#374151' }}>{text}</p>
    </div>
  )
}
