import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { supabase, supabaseConfigured, type ExerciseItem } from '../utils/supabase'
import { getFeedbackFromAI, type FeedbackResult } from '../utils/feedbackAI'
import { getTheory, type ContentTheory } from '../utils/theoryData'

const DAILY_TOTAL  = 14
const GRAMMAR_HALF = 7

export default function Exercise() {
  const { contentId, block } = useParams<{ contentId: string; block: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { settings } = useSettings()
  const blockNum = parseInt(block || '1')

  const [exercises, setExercises] = useState<ExerciseItem[]>([])
  const [current, setCurrent] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => { loadExercises() }, [contentId, block])

  // ---------- Load 14 exercises: 7 grammar + 7 TOEFL production ----------
  const loadExercises = async () => {
    setPageLoading(true)
    setCurrent(0); setScore(0); setUserAnswer(''); setFeedback(null); setSubmitted(false)

    if (!supabaseConfigured) {
      setExercises(getDemoExercises(contentId || '', blockNum))
      setPageLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('exercises')
        .select('*')
        .eq('content_id', contentId)
        .order('exercise_number')

      const all = data && data.length > 0 ? data : getDemoExercises(contentId || '', blockNum)
      const grammar    = all.filter(e => e.type === 'gap_fill' || e.type === 'multiple_choice')
      const production = all.filter(e => e.type === 'production')

      const pick = (arr: ExerciseItem[], n: number) =>
        [...arr].sort(() => Math.random() - 0.5).slice(0, n)

      const g = pick(grammar,    Math.min(GRAMMAR_HALF, grammar.length))
      const t = pick(production, Math.min(GRAMMAR_HALF, production.length))
      const remaining = DAILY_TOTAL - g.length - t.length
      const extra = remaining > 0
        ? pick(grammar.filter(e => !g.includes(e)), remaining)
        : []

      setExercises([...g, ...t, ...extra])
    } catch {
      setExercises(getDemoExercises(contentId || '', blockNum))
    } finally {
      setPageLoading(false)
    }
  }

  // ---------- Submit ----------
  const handleSubmit = useCallback(async () => {
    if (!userAnswer.trim()) return
    setLoading(true)
    const ex = exercises[current]
    try {
      const result = await getFeedbackFromAI({
        question: ex.question,
        userAnswer,
        correctAnswer: ex.answer,
        type: ex.type,
        explanation: ex.explanation,
      })
      setFeedback(result)
      setSubmitted(true)
      if (result.correct) setScore(s => s + 1)

      if (supabaseConfigured && user) {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          content_id: contentId,
          block_number: blockNum,
          exercise_number: current + 1,
          exercise_id: ex.id,
          user_answer: userAnswer,
          correct_answer: ex.answer,
          is_correct: result.correct,
          feedback_received: JSON.stringify(result),
        })

        if (!result.correct) {
          const isRealExercise = ex.id && !ex.id.startsWith('d-')
          await supabase.from('mistake_journal').insert({
            user_id:      user.id,
            content_id:   contentId,
            exercise_id:  isRealExercise ? ex.id : null,
            question_text: ex.question,
            question:     ex.question,
            user_answer:  userAnswer,
            correct_answer: ex.answer,
            ai_correction: result.explanation,
            is_resolved:  false,
          })
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [userAnswer, exercises, current, user, contentId, blockNum])

  // ---------- Next ----------
  const handleNext = () => {
    if (current < exercises.length - 1) {
      setCurrent(c => c + 1)
      setUserAnswer('')
      setFeedback(null)
      setSubmitted(false)
    } else {
      navigate('/')
    }
  }

  if (pageLoading) return <div className="loading">Carregando exercícios...</div>

  const ex = exercises[current]
  const pct = Math.round(((current + (submitted ? 1 : 0)) / exercises.length) * 100)
  const theory = getTheory(contentId || '')
  const isProduction = ex?.type === 'production'
  const isTOEFLHalf = current >= GRAMMAR_HALF

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {theory && <ExerciseTheoryCard theory={theory} />}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h2 style={{ margin: 0, textTransform: 'capitalize', fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
            {String(contentId).replace(/-/g, ' ')}
          </h2>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
            background: isTOEFLHalf ? 'rgba(79,70,229,0.1)' : 'rgba(245,158,11,0.1)',
            color: isTOEFLHalf ? '#4F46E5' : '#92400E',
          }}>
            {isTOEFLHalf ? 'TOEFL' : 'Gramática'}
          </span>
        </div>
        <p style={{ margin: '0 0 10px', color: '#94A3B8', fontSize: 13 }}>
          Questão {current + 1} de {exercises.length} · Corretas: {score}
        </p>
        <div style={{ height: 5, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#4F46E5', width: `${pct}%`, transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Card */}
      <div style={cardStyle}>
        <p style={{ color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px', fontWeight: 600 }}>
          {ex?.type?.replace(/_/g, ' ')}
        </p>
        <h3 style={{ fontSize: 20, lineHeight: 1.55, margin: '0 0 24px', color: '#0F172A', fontWeight: 500 }}>
          {ex?.question}
        </h3>

        {!submitted ? (
          <>
            {ex?.type === 'multiple_choice' && ex.options ? (
              <div className="options-list">
                {ex.options.map((opt, idx) => (
                  <button key={idx}
                    className={`option-btn ${userAnswer === opt ? 'selected' : ''}`}
                    onClick={() => setUserAnswer(opt)}>
                    <span style={{ fontWeight: 700, marginRight: 10, color: '#4F46E5' }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : isProduction ? (
              <>
                {isTOEFLHalf && <SpeakingTimer duration={settings.timers.speaking} onExpire={handleSubmit} />}
                <textarea
                  className="exercise-textarea"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  onPaste={e => e.preventDefault()}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder="Write your answer in English..."
                  rows={5}
                />
              </>
            ) : (
              <input
                className="exercise-input"
                type="text"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onPaste={e => e.preventDefault()}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                placeholder="Digite sua resposta..."
                onKeyDown={e => { if (e.key === 'Enter' && userAnswer.trim()) handleSubmit() }}
              />
            )}

            <button className="btn-primary" onClick={handleSubmit}
              disabled={!userAnswer.trim() || loading}>
              {loading ? 'Avaliando...' : 'Confirmar Resposta'}
            </button>
          </>
        ) : (
          <>
            <div className={`feedback-panel ${feedback?.correct ? 'correct' : 'incorrect'}`}>
              <h4>{feedback?.correct ? 'Correto!' : 'Não exatamente'}</h4>
              <p>{feedback?.message}</p>
              <div className="feedback-content">
                <p><strong>Explicação:</strong> {feedback?.explanation}</p>
                {feedback?.rule    && <p><strong>Regra:</strong> {feedback.rule}</p>}
                {feedback?.example && <p><strong>Exemplo:</strong> {feedback.example}</p>}
              </div>
            </div>
            <button className="btn-primary" onClick={handleNext}>
              {current < exercises.length - 1 ? 'Próxima Questão →' : 'Concluir Treino do Dia ✓'}
            </button>
          </>
        )}
      </div>

      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
        Acurácia: {Math.round((score / Math.max(1, current + (submitted ? 1 : 0))) * 100)}%
      </div>
    </div>
  )
}

// ---------- Speaking / TOEFL timer (45s) ----------
function SpeakingTimer({ duration, onExpire }: { duration: number; onExpire: () => void }) {
  const [seconds, setSeconds] = useState(duration)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const expiredRef = useRef(false)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1 && !expiredRef.current) {
          expiredRef.current = true
          clearInterval(timerRef.current!)
          setTimeout(onExpire, 0)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [])

  const pct = (seconds / duration) * 100
  const color = seconds <= 10 ? '#EF4444' : seconds <= Math.round(duration * 0.4) ? '#F59E0B' : '#22C55E'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
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
        <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Tempo TOEFL Speaking</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>{duration}s · Sem colar texto · Responda em inglês</div>
      </div>
    </div>
  )
}

// ---------- Theory card ----------
function ExerciseTheoryCard({ theory }: { theory: ContentTheory }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid #BFDBFE', borderRadius: 10, overflow: 'hidden', marginBottom: 20, background: 'white' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', background: open ? '#EFF6FF' : '#F8FAFF',
        border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
      }}>
        <span>📚</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#1D4ED8' }}>{theory.title}</span>
          <span style={{ fontSize: 12, color: '#3B82F6', marginLeft: 8 }}>{theory.tagline}</span>
        </div>
        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
          {open ? 'ocultar ▲' : 'ver resumo ▼'}
        </span>
      </button>
      {open && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #DBEAFE' }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 14 }}>{theory.summary}</p>
          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 7, padding: '10px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#0369A1', textTransform: 'uppercase', letterSpacing: 0.8 }}>Estrutura</span>
            <p style={{ margin: '5px 0 0', fontWeight: 600, color: '#0C4A6E', fontSize: 13, fontFamily: 'monospace' }}>{theory.structure}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {theory.examples.map((ex, i) => (
              <div key={i} style={{ borderLeft: '3px solid #2563EB', paddingLeft: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{ex.en}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{ex.pt}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#FEFCE8', border: '1px solid #FDE047', borderRadius: 7, padding: '10px 14px', display: 'flex', gap: 8 }}>
            <span>⚡</span>
            <p style={{ margin: 0, fontSize: 13, color: '#713F12', lineHeight: 1.6 }}>{theory.tip}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 14,
  padding: '28px 32px',
  border: '1px solid #E2E8F0',
  marginBottom: 16,
  boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
}

function getDemoExercises(contentId: string, block: number): ExerciseItem[] {
  const grammar: ExerciseItem[] = [
    { id: `d-g1-${block}`, content_id: contentId, block_number: block, exercise_number: 1, difficulty: 'easy', question: 'She ___ happy.', answer: 'is', type: 'gap_fill', explanation: 'She (3ª pessoa singular) = IS' },
    { id: `d-g2-${block}`, content_id: contentId, block_number: block, exercise_number: 2, difficulty: 'easy', question: 'I ___ a teacher.', answer: 'am', type: 'gap_fill', explanation: 'I sempre = AM' },
    { id: `d-g3-${block}`, content_id: contentId, block_number: block, exercise_number: 3, difficulty: 'easy', question: 'They ___ from Brazil.', answer: 'are', type: 'gap_fill', explanation: 'They (plural) = ARE' },
    { id: `d-g4-${block}`, content_id: contentId, block_number: block, exercise_number: 4, difficulty: 'easy', question: 'He ___ ready.', answer: 'is', type: 'gap_fill', explanation: 'He (3ª singular) = IS' },
    { id: `d-g5-${block}`, content_id: contentId, block_number: block, exercise_number: 5, difficulty: 'medium', question: 'Qual sentença está correta?', answer: 'She is a doctor', type: 'multiple_choice', explanation: 'She + IS', options: ['She are a doctor', 'She is a doctor', 'She am a doctor'] },
    { id: `d-g6-${block}`, content_id: contentId, block_number: block, exercise_number: 6, difficulty: 'medium', question: 'We ___ students.', answer: 'are', type: 'gap_fill', explanation: 'We (plural) = ARE' },
    { id: `d-g7-${block}`, content_id: contentId, block_number: block, exercise_number: 7, difficulty: 'medium', question: 'It ___ cold today.', answer: 'is', type: 'gap_fill', explanation: 'It (3ª singular neutra) = IS' },
  ]
  const toefl: ExerciseItem[] = [
    { id: `d-t1-${block}`, content_id: contentId, block_number: block, exercise_number: 8,  difficulty: 'medium', question: '[TOEFL Speaking] Describe a place that is important to you and explain why. Speak for 45 seconds.', answer: '', type: 'production', explanation: 'Use connectors: because, therefore, however.' },
    { id: `d-t2-${block}`, content_id: contentId, block_number: block, exercise_number: 9,  difficulty: 'medium', question: '[TOEFL Writing] Write 2-3 sentences using the verb TO BE in an academic context.', answer: '', type: 'production', explanation: 'Use academic vocabulary and formal tone.' },
    { id: `d-t3-${block}`, content_id: contentId, block_number: block, exercise_number: 10, difficulty: 'hard',   question: '[TOEFL] Complete: The results of the experiment ___ conclusive.', answer: 'are', type: 'gap_fill', explanation: '"Results" is plural → ARE' },
    { id: `d-t4-${block}`, content_id: contentId, block_number: block, exercise_number: 11, difficulty: 'hard',   question: '[TOEFL] In academic writing, "is" is used with which subject?', answer: 'The research', type: 'multiple_choice', explanation: 'Singular noun + IS', options: ['The researchers', 'The studies', 'The research', 'The findings'] },
    { id: `d-t5-${block}`, content_id: contentId, block_number: block, exercise_number: 12, difficulty: 'hard',   question: '[TOEFL Production] Write one academic sentence using "are" to describe a research finding.', answer: '', type: 'production', explanation: 'Example: "The data are consistent with the hypothesis."' },
    { id: `d-t6-${block}`, content_id: contentId, block_number: block, exercise_number: 13, difficulty: 'hard',   question: '[TOEFL] The phenomenon ___ not yet fully understood by scientists.', answer: 'is', type: 'gap_fill', explanation: '"phenomenon" is singular → IS' },
    { id: `d-t7-${block}`, content_id: contentId, block_number: block, exercise_number: 14, difficulty: 'hard',   question: '[TOEFL Speaking] Do you think technology makes people more or less connected? Explain with two examples.', answer: '', type: 'production', explanation: 'Structure: Claim → Example 1 → Example 2 → Conclusion' },
  ]
  return [...grammar, ...toefl]
}
