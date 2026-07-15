import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { supabase, supabaseConfigured, type ExerciseItem } from '../utils/supabase'
import { getFeedbackFromAI, getTOEFLSpeakingFeedback, getTOEFLWritingFeedback, type FeedbackResult, type TOEFLSectionFeedback } from '../utils/feedbackAI'
import { evaluateSpeakingAudio, saveSpeakingAttempt, getSpeakingHistory, HAS_GEMINI } from '../utils/geminiAI'
import { useAudioRecorder } from '../utils/useAudioRecorder'
import { getTheory, type ContentTheory } from '../utils/theoryData'
import { TextToSpeech } from '@capacitor-community/text-to-speech'

type Skill = 'reading' | 'listening' | 'speaking' | 'writing'
const SKILLS: Skill[] = ['reading', 'listening', 'speaking', 'writing']
const SKILL_LABELS: Record<Skill, string> = { reading: 'Reading', listening: 'Listening', speaking: 'Speaking', writing: 'Writing' }

// ---------- Persist which skill-exercises the user already saw (per module) ----------
function seenKey(contentId: string, skill: Skill) { return `meu-ingles-seen-${contentId}-${skill}` }

function loadSeen(contentId: string, skill: Skill): Set<string> {
  try {
    const raw = localStorage.getItem(seenKey(contentId, skill))
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveSeen(contentId: string, skill: Skill, ids: Set<string>) {
  try {
    localStorage.setItem(seenKey(contentId, skill), JSON.stringify([...ids]))
  } catch {
    // localStorage indisponível (modo privado, quota cheia) — não é crítico, apenas ignora
  }
}

function pick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

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
  const [skillFeedback, setSkillFeedback] = useState<TOEFLSectionFeedback | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)

  const audio = useAudioRecorder()
  const allExercisesRef = useRef<ExerciseItem[]>([])
  const seenRef = useRef<Record<Skill, Set<string>>>({ reading: new Set(), listening: new Set(), speaking: new Set(), writing: new Set() })

  // ---------- Save one answered exercise to user_progress / mistake_journal ----------
  const saveProgress = useCallback(async (ex: ExerciseItem, isCorrect: boolean, userAns: string, correctAns: string, feedbackJson: string, correction?: string) => {
    if (!user) return
    await supabase.from('user_progress').insert({
      user_id: user.id,
      content_id: contentId,
      block_number: blockNum,
      exercise_number: current + 1,
      exercise_id: ex.id,
      user_answer: userAns,
      correct_answer: correctAns,
      is_correct: isCorrect,
      feedback_received: feedbackJson,
    })

    const isRealExercise = ex.id && !ex.id.startsWith('d-')
    if (isCorrect) {
      if (isRealExercise) {
        const nextReview = new Date(); nextReview.setDate(nextReview.getDate() + 3)
        await supabase.from('mistake_journal')
          .update({ is_resolved: true, spaced_review_date: nextReview.toISOString() })
          .eq('user_id', user.id).eq('exercise_id', ex.id).eq('is_resolved', false)
      }
    } else {
      const nextReview = new Date(); nextReview.setDate(nextReview.getDate() + 1)
      await supabase.from('mistake_journal').insert({
        user_id: user.id,
        content_id: contentId,
        exercise_id: isRealExercise ? ex.id : null,
        question_text: ex.question,
        question: ex.question,
        user_answer: userAns,
        correct_answer: correctAns,
        ai_correction: correction,
        is_resolved: false,
        spaced_review_date: nextReview.toISOString(),
      })
    }
  }, [user, contentId, blockNum, current])

  // ---------- Pull skillsBatchSize more (or fewer, if the module's pool is smaller) of a skill ----------
  const extendSkill = useCallback((skill: Skill): ExerciseItem[] => {
    const cid = contentId || ''
    const pool = allExercisesRef.current.filter(e => e.toefl_skill === skill)
    if (pool.length === 0) return []

    let unseen = pool.filter(e => !seenRef.current[skill].has(e.id))
    if (unseen.length === 0) {
      // Exhausted every item of this skill in this module — recycle so practice never dead-ends.
      seenRef.current[skill] = new Set()
      unseen = pool
    }

    const batch = pick(unseen, Math.min(settings.skillsBatchSize, unseen.length))
    batch.forEach(e => seenRef.current[skill].add(e.id))
    saveSeen(cid, skill, seenRef.current[skill])
    return batch
  }, [contentId, settings.skillsBatchSize])

  // ---------- Load session: objective exercises + 4 skill batches ----------
  const loadExercises = useCallback(async () => {
    setPageLoading(true)
    setCurrent(0); setScore(0); setUserAnswer(''); setFeedback(null); setSkillFeedback(null); setSubmitted(false)
    audio.reset()

    if (!supabaseConfigured) {
      setExercises(getDemoExercises(contentId || '', blockNum))
      setPageLoading(false)
      return
    }
    try {
      const cid = contentId || ''
      const [exercisesResult, mistakesResult] = await Promise.all([
        supabase.from('exercises').select('*').eq('content_id', cid).order('exercise_number'),
        user ? supabase
          .from('mistake_journal')
          .select('exercise_id, question_text')
          .eq('user_id', user.id)
          .eq('content_id', cid)
          .eq('is_resolved', false)
          .lte('spaced_review_date', new Date().toISOString())
          .limit(4) : Promise.resolve({ data: null }),
      ])

      const all = exercisesResult.data && exercisesResult.data.length > 0
        ? exercisesResult.data as ExerciseItem[]
        : getDemoExercises(cid, blockNum)

      allExercisesRef.current = all
      SKILLS.forEach(s => { seenRef.current[s] = loadSeen(cid, s) })

      // ---- Objective pool (toefl_skill IS NULL) with spaced-repetition review ----
      const mistakeIds = new Set((mistakesResult.data || []).map(m => m.exercise_id).filter(Boolean))
      const objectivePool = all.filter(e => !e.toefl_skill)
      const reviewExercises = objectivePool.filter(e => mistakeIds.has(e.id))
      const remaining = objectivePool.filter(e => !mistakeIds.has(e.id))

      const reviews = pick(reviewExercises, Math.min(4, reviewExercises.length))
      const newSlots = Math.max(0, settings.dailyObjectiveCount - reviews.length)
      const objectives = [...reviews, ...pick(remaining, Math.min(newSlots, remaining.length))]

      // ---- 4 skill batches ----
      const skillBatches = SKILLS.map(s => extendSkill(s))

      setExercises([...objectives, ...skillBatches.flat()])
    } catch {
      setExercises(getDemoExercises(contentId || '', blockNum))
    } finally {
      setPageLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only audio.reset (stable via useCallback) is needed, not the whole audio object
  }, [contentId, blockNum, user, settings.dailyObjectiveCount, extendSkill, audio.reset])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount/param change, not a render-time state sync
  useEffect(() => { loadExercises() }, [loadExercises])

  function resetAnswerState() {
    setUserAnswer(''); setFeedback(null); setSkillFeedback(null); setSubmitted(false)
    audio.reset()
  }

  // ---------- Submit: objective (exact match) ----------
  const submitObjective = useCallback(async (ex: ExerciseItem) => {
    const result = await getFeedbackFromAI({
      question: ex.question,
      userAnswer,
      correctAnswer: ex.answer,
      type: ex.type,
      explanation: ex.explanation,
    })
    setFeedback(result)
    if (result.correct) setScore(s => s + 1)

    if (supabaseConfigured && user) {
      await saveProgress(ex, result.correct, userAnswer, ex.answer, JSON.stringify(result), result.explanation)
    }
  }, [userAnswer, user, saveProgress])

  // ---------- Submit: speaking (audio) or writing (text) — TOEFL-style scoring ----------
  const submitSkillProduction = useCallback(async (ex: ExerciseItem) => {
    let sf: TOEFLSectionFeedback
    let answerForLog = userAnswer

    if (ex.toefl_skill === 'speaking') {
      if (audio.audioBlob && HAS_GEMINI) {
        const history = user ? await getSpeakingHistory(user.id, contentId || '') : []
        const gem = await evaluateSpeakingAudio(audio.audioBlob, ex.question, history)
        sf = {
          score: Math.round(gem.score * 7.5),
          level: gem.score >= 4 ? 'Excelente' : gem.score >= 3 ? 'Avancado' : gem.score >= 2 ? 'Intermediario' : 'Basico',
          strengths: gem.strengths,
          improvements: gem.improvements,
          tips: gem.feedback,
        }
        answerForLog = gem.transcript || '[áudio gravado]'

        if (user) {
          await saveSpeakingAttempt({
            userId: user.id,
            contentId: contentId || '',
            exerciseId: ex.id && !ex.id.startsWith('d-') ? ex.id : null,
            task: ex.question,
            result: gem,
            audioBlob: audio.audioBlob,
          })
        }
      } else {
        sf = await getTOEFLSpeakingFeedback(ex.question, userAnswer || '(sem resposta)')
      }
    } else {
      sf = await getTOEFLWritingFeedback(ex.question, userAnswer)
    }

    setSkillFeedback(sf)
    const isGood = sf.score >= 18
    if (isGood) setScore(s => s + 1)

    if (supabaseConfigured && user) {
      await saveProgress(ex, isGood, answerForLog, '', JSON.stringify(sf), sf.improvements)
    }
  }, [userAnswer, audio.audioBlob, user, contentId, saveProgress])

  const handleSubmit = useCallback(async () => {
    const ex = exercises[current]
    const isSkillProduction = ex?.type === 'production' && (ex.toefl_skill === 'speaking' || ex.toefl_skill === 'writing')
    const canSubmitSkill = isSkillProduction && ex.toefl_skill === 'speaking' ? !!audio.audioBlob || userAnswer.trim().length > 0 : userAnswer.trim().length > 0

    if (!isSkillProduction && !userAnswer.trim()) return
    if (isSkillProduction && !canSubmitSkill) return

    setLoading(true)
    try {
      if (isSkillProduction) await submitSkillProduction(ex)
      else await submitObjective(ex)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [exercises, current, userAnswer, audio.audioBlob, submitObjective, submitSkillProduction])

  // ---------- Next — auto-extends the skill batch the user just finished ----------
  const handleNext = () => {
    const ex = exercises[current]
    const isLastOfArray = current === exercises.length - 1
    const nextIsDifferentSkill = !isLastOfArray && exercises[current + 1]?.toefl_skill !== ex?.toefl_skill

    if (ex?.toefl_skill && (isLastOfArray || nextIsDifferentSkill)) {
      const more = extendSkill(ex.toefl_skill)
      if (more.length > 0) {
        setExercises(prev => {
          const next = [...prev]
          next.splice(current + 1, 0, ...more)
          return next
        })
        setCurrent(c => c + 1)
        resetAnswerState()
        return
      }
    }

    if (current < exercises.length - 1) {
      setCurrent(c => c + 1)
      resetAnswerState()
    } else {
      navigate('/')
    }
  }

  if (pageLoading) return <div className="loading">Carregando exercícios...</div>

  const ex = exercises[current]
  const skill = ex?.toefl_skill as Skill | undefined
  const pct = Math.round(((current + (submitted ? 1 : 0)) / exercises.length) * 100)
  const theory = getTheory(contentId || '')
  const isProduction = ex?.type === 'production'
  const isSkillProduction = isProduction && (skill === 'speaking' || skill === 'writing')
  const badgeLabel = skill ? SKILL_LABELS[skill] : 'Gramática'
  const minWords = (() => {
    const m = ex?.question?.match(/(\d+)\s*words?/i)
    return m ? Math.min(250, Math.max(20, parseInt(m[1]))) : 30
  })()
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length

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
            background: skill ? 'rgba(79,70,229,0.1)' : 'rgba(245,158,11,0.1)',
            color: skill ? '#4F46E5' : '#92400E',
          }}>
            {badgeLabel}
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
        <div translate="no" className="notranslate" lang="en">
          <h3 style={{ fontSize: 20, lineHeight: 1.55, margin: '0 0 8px', color: '#0F172A', fontWeight: 500 }}>
            {ex?.question}
          </h3>
        </div>

        {skill === 'listening' && (
          <button
            type="button"
            onClick={() => {
              TextToSpeech.speak({
                text: ex.question.replace(/^\[TOEFL Listening\]\s*/i, ''),
                lang: 'en-US',
              })
            }}
            style={{ marginBottom: 20, padding: '8px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, color: '#1D4ED8', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            🔊 Ouvir
          </button>
        )}

        {!submitted ? (
          <>
            {ex?.type === 'multiple_choice' && ex.options ? (
              <div className="options-list" translate="no" lang="en">
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
            ) : skill === 'speaking' ? (
              <div style={{ marginBottom: 16 }}>
                {HAS_GEMINI ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={audio.recording ? audio.stopRecording : audio.startRecording}
                      style={{
                        width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: audio.recording ? '#EF4444' : '#4F46E5', color: 'white', fontSize: 22, flexShrink: 0,
                      }}
                    >
                      {audio.recording ? '■' : '🎤'}
                    </button>
                    <div style={{ fontSize: 13, color: '#64748B' }}>
                      {audio.recording ? 'Gravando... clique para parar.' : audio.audioBlob ? '✓ Áudio gravado. Pode confirmar ou gravar de novo.' : 'Clique no microfone e responda em inglês (até 45s).'}
                    </div>
                  </div>
                ) : (
                  <textarea
                    className="exercise-textarea"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onPaste={e => e.preventDefault()}
                    spellCheck={false}
                    placeholder="Configure VITE_GEMINI_API_KEY para gravar áudio. Por enquanto, escreva o que você diria em inglês..."
                    rows={5}
                  />
                )}
              </div>
            ) : skill === 'writing' ? (
              <>
                <textarea
                  className="exercise-textarea"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  onPaste={e => e.preventDefault()}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder={`Write at least ${minWords} words in English...`}
                  rows={8}
                />
                <p style={{ fontSize: 12, color: wordCount >= minWords ? '#22C55E' : '#94A3B8', margin: '4px 0 16px' }}>
                  {wordCount} / {minWords} palavras mínimas
                </p>
              </>
            ) : isProduction ? (
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
              disabled={loading || (skill === 'writing' ? wordCount < minWords : skill === 'speaking' ? (!audio.audioBlob && !userAnswer.trim()) : !userAnswer.trim())}>
              {loading ? 'Avaliando...' : 'Confirmar Resposta'}
            </button>
          </>
        ) : isSkillProduction && skillFeedback ? (
          <>
            <div className={`feedback-panel ${skillFeedback.score >= 18 ? 'correct' : 'incorrect'}`}>
              <h4>Nota: {skillFeedback.score}/30 — {skillFeedback.level}</h4>
              <div className="feedback-content">
                <p><strong>Pontos fortes:</strong> {skillFeedback.strengths}</p>
                <p><strong>Melhorar:</strong> {skillFeedback.improvements}</p>
                <p><strong>Dica:</strong> {skillFeedback.tips}</p>
              </div>
            </div>
            <button className="btn-primary" onClick={handleNext}>
              {current < exercises.length - 1 ? 'Próxima Questão →' : 'Concluir Treino do Dia ✓'}
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
                {feedback?.translation && <p><strong>Tradução:</strong> {feedback.translation}</p>}
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

// ---------- Theory card ----------
function ExerciseTheoryCard({ theory }: { theory: ContentTheory }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'sticky', top: 10, zIndex: 10, border: '1px solid #BFDBFE', borderRadius: 10, overflow: 'hidden', marginBottom: 20, background: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
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
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 14, whiteSpace: 'pre-wrap' }}>{theory.summary}</p>
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
  const reading: ExerciseItem[] = [
    { id: `d-r1-${block}`, content_id: contentId, block_number: block, exercise_number: 8, difficulty: 'medium', question: '[TOEFL Reading] "The verb TO BE is among the most irregular in English, changing form for almost every subject pronoun." What does this sentence emphasize?', answer: 'The high degree of irregularity of TO BE.', type: 'multiple_choice', options: ['The high degree of irregularity of TO BE.', 'That TO BE has no irregular forms.', 'That TO BE only changes in the past.', 'That pronouns are irregular.'], explanation: 'A frase destaca a irregularidade do TO BE.', toefl_skill: 'reading' },
  ]
  const listening: ExerciseItem[] = [
    { id: `d-l1-${block}`, content_id: contentId, block_number: block, exercise_number: 9, difficulty: 'medium', question: '[TOEFL Listening] A professor says: "Remember, we are meeting tomorrow, not today." What is true tomorrow?', answer: 'There is a meeting.', type: 'multiple_choice', options: ['There is a meeting.', 'There is no meeting.', 'The meeting was cancelled.', 'The meeting already happened.'], explanation: '"We are meeting tomorrow" = presente contínuo com valor de futuro.', toefl_skill: 'listening' },
  ]
  const speaking: ExerciseItem[] = [
    { id: `d-s1-${block}`, content_id: contentId, block_number: block, exercise_number: 10, difficulty: 'medium', question: '[TOEFL Speaking] Describe yourself in a few sentences using the verb TO BE (I am, I am not, I am from...).', answer: '', type: 'production', explanation: 'Use I am / I am not / I am from.', toefl_skill: 'speaking' },
  ]
  const writing: ExerciseItem[] = [
    { id: `d-w1-${block}`, content_id: contentId, block_number: block, exercise_number: 11, difficulty: 'medium', question: '[TOEFL Writing] Write at least 30 words describing your city using TO BE at least 3 times.', answer: '', type: 'production', explanation: 'Use is/are para descrever lugares.', toefl_skill: 'writing' },
  ]
  return [...grammar, ...reading, ...listening, ...speaking, ...writing]
}
