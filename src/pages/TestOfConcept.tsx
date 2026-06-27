import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured, type TestQuestion } from '../utils/supabase'
import { PASSING_PERCENTAGE } from '../utils/constants'
import { getTheory } from '../utils/theoryData'

// ============================================================
// TYPES
// ============================================================

type Step = 'theory' | 'questions' | 'results'

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TestOfConcept() {
  const { contentId } = useParams<{ contentId: string }>()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('theory')
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNextBtn, setShowNextBtn] = useState(false)

  const theory = getTheory(contentId || '')
  const contentLabel = String(contentId).replace(/-/g, ' ')

  // Se não há teoria, pula direto para questões
  useEffect(() => {
    if (!theory) setStep('questions')
  }, [theory])

  useEffect(() => {
    loadQuestions()
  }, [contentId])

  // Botão "Próximo" aparece com fade-in após 1.5s de leitura
  useEffect(() => {
    if (step !== 'theory') return
    setShowNextBtn(false)
    const t = setTimeout(() => setShowNextBtn(true), 1500)
    return () => clearTimeout(t)
  }, [step])

  const loadQuestions = async () => {
    if (!supabaseConfigured) {
      setQuestions(getDemoQuestions(contentId || ''))
      setLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('tests_of_concept')
        .select('*')
        .eq('content_id', contentId)
        .order('question_number')
      setQuestions(data && data.length > 0 ? data : getDemoQuestions(contentId || ''))
    } catch {
      setQuestions(getDemoQuestions(contentId || ''))
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex
    setAnswers(newAnswers)
  }

  const handleConfirm = () => {
    if (answers[currentIndex] === undefined) return
    
    if (!isAnswerConfirmed) {
      setIsAnswerConfirmed(true)
      return
    }

    setIsAnswerConfirmed(false)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setStep('results')
    }
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setAnswers([])
    setIsAnswerConfirmed(false)
    setStep('theory')
  }

  if (loading) return <div className="loading">Carregando...</div>

  const stepIndex = step === 'theory' ? 0 : step === 'questions' ? 1 : 2

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Step indicator */}
      <StepBar current={stepIndex} />

      {/* ── TELA 1: TEORIA ── */}
      {step === 'theory' && theory && (
        <div key="theory" className="fade-in-up">
          {/* Card de teoria sempre expandido */}
          <div style={{ border: '1px solid #bfdbfe', borderRadius: 14, overflow: 'hidden', background: 'white', marginBottom: 0 }}>
            {/* Header */}
            <div style={{ background: '#eff6ff', padding: '18px 24px', borderBottom: '1px solid #bfdbfe', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>📚</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#1d4ed8' }}>{theory.title}</div>
                <div style={{ fontSize: 13, color: '#3b82f6', marginTop: 2 }}>{theory.tagline}</div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              {/* Resumo */}
              <p style={{ fontSize: 15, lineHeight: 1.75, color: '#374151', marginBottom: 20 }}>
                {theory.summary}
              </p>

              {/* Estrutura */}
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                  Estrutura
                </div>
                <div style={{ fontWeight: 700, color: '#0c4a6e', fontSize: 15, fontFamily: 'monospace', letterSpacing: 0.2 }}>
                  {theory.structure}
                </div>
              </div>

              {/* Exemplos */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
                  Exemplos
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {theory.examples.map((ex, i) => (
                    <div key={i} style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                      <div style={{ width: 4, borderRadius: 2, background: '#2563eb', flexShrink: 0, marginRight: 16 }} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{ex.en}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{ex.pt}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 4 }}>
                          {ex.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dica */}
              <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>⚡</span>
                <p style={{ margin: 0, fontSize: 14, color: '#713f12', lineHeight: 1.65 }}>{theory.tip}</p>
              </div>
            </div>
          </div>

          {/* Botão Próximo com fade-in após leitura */}
          {showNextBtn && (
            <div className="fade-in-up" style={{ marginTop: 24 }}>
              <button
                className="btn-primary"
                onClick={() => setStep('questions')}
                style={{ width: '100%', padding: '15px', fontSize: 16 }}
              >
                Próximo — Iniciar Teste →
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
                {questions.length} questões · mínimo {PASSING_PERCENTAGE}% para avançar
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TELA 2: QUESTÕES ── */}
      {step === 'questions' && (() => {
        const q = questions[currentIndex]
        const selected = answers[currentIndex]
        const pct = ((currentIndex + 1) / questions.length) * 100

        return (
          <div key={`q-${currentIndex}`} className="fade-in-up">
            {/* Progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                  {contentLabel}
                </span>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>
              <div style={{ height: 5, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#2563eb', width: `${pct}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Question card */}
            <div style={{ background: 'white', borderRadius: 12, padding: '28px 32px', border: '1px solid #e5e7eb', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
                Questão {currentIndex + 1}
              </div>
              <h3 style={{ fontSize: 20, lineHeight: 1.55, margin: '0 0 28px', color: '#111827', fontWeight: 600 }}>
                {q?.question}
              </h3>
              <div className="options-list">
                {q?.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`option-btn ${selected === idx ? 'selected' : ''}`}
                    onClick={() => !isAnswerConfirmed && handleAnswer(idx)}
                    disabled={isAnswerConfirmed}
                    style={{ opacity: isAnswerConfirmed && selected !== idx ? 0.5 : 1 }}
                  >
                    <span style={{ fontWeight: 700, marginRight: 10, color: selected === idx ? '#2563eb' : '#9ca3af' }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>

              {isAnswerConfirmed && (
                <div style={{
                  marginTop: 20,
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 16px', borderRadius: 10, background: 'white',
                  border: `1px solid ${selected === q.correct_answer ? '#bbf7d0' : '#fecaca'}`,
                  borderLeft: `4px solid ${selected === q.correct_answer ? '#16a34a' : '#dc2626'}`,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{selected === q.correct_answer ? '✅' : '❌'}</span>
                  <div>
                    <div style={{ fontSize: 14, color: selected === q.correct_answer ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                      {selected === q.correct_answer ? 'Correto!' : 'Incorreto'}
                    </div>
                    {selected !== q.correct_answer && (
                      <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>
                        A resposta certa era: <span style={{ fontWeight: 600 }}>{q.options[q.correct_answer]}</span>
                      </div>
                    )}
                    {q.explanation && (
                      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  className="btn-primary"
                  onClick={handleConfirm}
                  disabled={selected === undefined}
                  style={{ opacity: selected === undefined ? 0.5 : 1, padding: '12px 24px', fontSize: 14 }}
                >
                  {isAnswerConfirmed ? 'Próximo →' : 'Confirmar'}
                </button>
              </div>
            </div>

            <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => navigate('/')}>
              ← Voltar ao Dashboard
            </button>
          </div>
        )
      })()}

      {/* ── TELA 3: RESULTADO ── */}
      {step === 'results' && (() => {
        const correct = answers.filter((ans, idx) => ans === questions[idx]?.correct_answer).length
        const pct = Math.round((correct / questions.length) * 100)
        const passed = pct >= PASSING_PERCENTAGE

        return (
          <div key="results" className="fade-in-up">
            {/* Score hero */}
            <div style={{ textAlign: 'center', padding: '36px 20px 28px', background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', marginBottom: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>{passed ? '🎉' : '📖'}</div>
              <div style={{ fontSize: 60, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 15, color: '#6b7280', marginTop: 6, marginBottom: 16 }}>
                {correct} de {questions.length} corretas
              </div>
              <span style={{
                display: 'inline-block', padding: '6px 20px', borderRadius: 20,
                fontSize: 14, fontWeight: 700,
                background: passed ? '#dcfce7' : '#fee2e2',
                color: passed ? '#166534' : '#991b1b',
              }}>
                {passed ? `Aprovado! Mínimo era ${PASSING_PERCENTAGE}%` : `Abaixo do mínimo (${PASSING_PERCENTAGE}%)`}
              </span>
            </div>

            {/* Per-question review */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.correct_answer
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '12px 16px', borderRadius: 10, background: 'white',
                    border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
                    borderLeft: `4px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{isCorrect ? '✅' : '❌'}</span>
                    <div>
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{q.question}</div>
                      {!isCorrect && (
                        <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>
                          Correto: {q.options[q.correct_answer]}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            {passed ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn-primary"
                  style={{ padding: '14px', fontSize: 15 }}
                  onClick={() => navigate(`/exercise/${contentId}/1`)}
                >
                  Começar Exercícios — Bloco 1 →
                </button>
                <button className="btn-secondary" style={{ fontSize: 14 }} onClick={() => navigate('/')}>
                  Voltar ao Dashboard
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn-primary" style={{ padding: '14px', fontSize: 15 }} onClick={handleRetry}>
                  Rever Teoria e Tentar Novamente →
                </button>
                <button className="btn-secondary" style={{ fontSize: 14 }} onClick={() => navigate('/')}>
                  Voltar ao Dashboard
                </button>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}

// ============================================================
// STEP BAR
// ============================================================

function StepBar({ current }: { current: number }) {
  const steps = ['Teoria', 'Questões', 'Resultado']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
      {steps.map((label, i) => (
        <Fragment key={label}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i < current ? '#2563eb' : i === current ? '#2563eb' : '#e5e7eb',
              color: i <= current ? 'white' : '#9ca3af',
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s',
              boxShadow: i === current ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize: 13,
              fontWeight: i === current ? 700 : 400,
              color: i === current ? '#111827' : i < current ? '#6b7280' : '#9ca3af',
              transition: 'color 0.3s',
            }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: '0 12px',
              background: i < current ? '#2563eb' : '#e5e7eb',
              transition: 'background 0.4s',
              minWidth: 20,
            }} />
          )}
        </Fragment>
      ))}
    </div>
  )
}

// ============================================================
// DEMO QUESTIONS
// ============================================================

function getDemoQuestions(contentId: string): TestQuestion[] {
  if (contentId === 'verbo-to-be') {
    return [
      { id: '1', content_id: contentId, question_number: 1, question: 'O verbo TO BE é usado principalmente para:', options: ['Fazer uma ação', 'Ser, estar, identidade', 'Ir a algum lugar', 'Ter algo'], correct_answer: 1, explanation: 'TO BE = Ser/Estar' },
      { id: '2', content_id: contentId, question_number: 2, question: 'Qual é a conjugação correta do TO BE?', options: ['I is, You am, He are', 'I am, You are, He is', 'I are, You is, He am', 'Todos usam is'], correct_answer: 1, explanation: 'I AM | You/We/They ARE | He/She/It IS' },
      { id: '3', content_id: contentId, question_number: 3, question: 'Como negar com TO BE?', options: ['I not am happy', 'I am not happy', 'I do not am happy', 'I no am happy'], correct_answer: 1, explanation: 'Subject + AM/ARE/IS + NOT' },
      { id: '4', content_id: contentId, question_number: 4, question: 'Como fazer pergunta com TO BE?', options: ['Do you are happy?', 'You are happy?', 'Are you happy?', 'Have you happy?'], correct_answer: 2, explanation: 'AM/ARE/IS + Subject + ...' },
      { id: '5', content_id: contentId, question_number: 5, question: 'Qual sentença está correta?', options: ['She are a doctor', 'She am a doctor', 'She is a doctor', 'She be a doctor'], correct_answer: 2, explanation: 'She/He/It + IS' },
    ]
  }
  return [
    { id: '1', content_id: contentId, question_number: 1, question: `Pergunta demo sobre ${contentId}`, options: ['Opção A', 'Opção B (Correta)', 'Opção C', 'Opção D'], correct_answer: 1, explanation: 'Esta é a explicação correta.' },
    { id: '2', content_id: contentId, question_number: 2, question: 'Configure o Supabase para ver questões reais.', options: ['Entendido!', 'Ok', 'Sim', 'Certo'], correct_answer: 0, explanation: 'Adicione VITE_SUPABASE_URL e VITE_SUPABASE_KEY no .env' },
  ]
}
