// ============================================================
// TOEFL Prep — Feedback AI (Claude API)
// Cobre: exercicios gramaticais + 4 secoes TOEFL
// ============================================================

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
const HAS_API_KEY = !!API_KEY && !API_KEY.includes('seu-key')

// ---- Tipos ----

export interface FeedbackResult {
  correct: boolean
  message: string
  explanation: string
  example?: string
  rule?: string
  translation?: string
}

export interface TOEFLSectionFeedback {
  score: number        // 0-30
  level: string        // Abaixo / Basico / Intermediario / Avancado / Excelente
  strengths: string
  improvements: string
  tips: string
  detail?: string
}

// ---- Helper: chama Claude API ----

async function callClaude(prompt: string, maxTokens = 400): Promise<string> {
  if (!HAS_API_KEY) return ''
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY!,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return ''
    const data = await res.json()
    return data?.content?.[0]?.text ?? ''
  } catch {
    return ''
  }
}

function parseJSON<T>(text: string, fallback: T): T {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return fallback
  try { return JSON.parse(match[0]) as T } catch { return fallback }
}

// ============================================================
// 1. FEEDBACK DE EXERCICIO GRAMATICAL
// ============================================================

interface ExerciseInput {
  question: string
  userAnswer: string
  correctAnswer: string
  type: string
  explanation?: string
}

export async function getFeedbackFromAI(input: ExerciseInput): Promise<FeedbackResult> {
  const { question, userAnswer, correctAnswer, type, explanation } = input
  const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

  if (!HAS_API_KEY) return localExerciseFeedback(isCorrect, correctAnswer, explanation)

  const prompt = isCorrect
    ? `Voce e tutor de ingles TOEFL. Feedback POSITIVO e breve.
Pergunta: ${question}
Resposta: ${userAnswer}
Tipo: ${type}
Responda SOMENTE JSON:
{"correct":true,"message":"Elogio breve","explanation":"Regra em 1 linha","example":"Exemplo similar","translation":"Tradução da pergunta para o português"}`
    : `Voce e tutor de ingles TOEFL. Feedback CORRETIVO util.
Pergunta: ${question}
Resposta do aluno: ${userAnswer}
Resposta correta: ${correctAnswer}
Tipo: ${type}
${explanation ? `Dica: ${explanation}` : ''}
Responda SOMENTE JSON:
{"correct":false,"message":"O que errou em 1 linha","explanation":"Por que esta errado","rule":"Regra correta","example":"Exemplo certo","translation":"Tradução da pergunta para o português"}`

  const text = await callClaude(prompt, 250)
  if (!text) return localExerciseFeedback(isCorrect, correctAnswer, explanation)

  const parsed = parseJSON<FeedbackResult>(text, localExerciseFeedback(isCorrect, correctAnswer, explanation))
  return { ...parsed, correct: isCorrect }
}

function localExerciseFeedback(isCorrect: boolean, correctAnswer: string, explanation?: string): FeedbackResult {
  if (isCorrect) return {
    correct: true,
    message: 'Correto! Muito bem!',
    explanation: explanation || 'Resposta certa.',
    example: 'Continue praticando!',
  }
  return {
    correct: false,
    message: 'Nao exatamente.',
    explanation: explanation || `Resposta correta: "${correctAnswer}"`,
    rule: explanation,
    example: `Esperado: "${correctAnswer}"`,
  }
}

// ============================================================
// 2. TOEFL READING — Feedback por questao + analise geral
// ============================================================

interface ReadingQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  userAnswer: string
}

export async function getTOEFLReadingFeedback(
  passage: string,
  questions: ReadingQuestion[]
): Promise<TOEFLSectionFeedback> {
  const correct = questions.filter(q => q.userAnswer === q.correctAnswer).length
  const pct = correct / questions.length
  const baseScore = Math.round(pct * 30)

  if (!HAS_API_KEY) return localTOEFLFeedback(baseScore, 'reading')

  const qSummary = questions.map((q, i) =>
    `Q${i+1}: "${q.question}" | Aluno: "${q.userAnswer}" | Correta: "${q.correctAnswer}" | ${q.userAnswer === q.correctAnswer ? 'CERTO' : 'ERRADO'}`
  ).join('\n')

  const prompt = `Voce e avaliador TOEFL. Analise as respostas de Reading:

TEXTO: "${passage.slice(0, 300)}..."
RESPOSTAS:
${qSummary}

Score calculado: ${baseScore}/30

Responda SOMENTE JSON:
{
  "score": ${baseScore},
  "level": "Basico|Intermediario|Avancado",
  "strengths": "O que o aluno fez bem",
  "improvements": "O que precisa melhorar",
  "tips": "2 dicas praticas para Reading TOEFL",
  "detail": "Analise breve das questoes erradas"
}`

  const text = await callClaude(prompt, 400)
  if (!text) return localTOEFLFeedback(baseScore, 'reading')
  return parseJSON<TOEFLSectionFeedback>(text, localTOEFLFeedback(baseScore, 'reading'))
}

// ============================================================
// 3. TOEFL LISTENING — Feedback por questao + analise geral
// ============================================================

export async function getTOEFLListeningFeedback(
  questions: ReadingQuestion[]
): Promise<TOEFLSectionFeedback> {
  const correct = questions.filter(q => q.userAnswer === q.correctAnswer).length
  const baseScore = Math.round((correct / questions.length) * 30)

  if (!HAS_API_KEY) return localTOEFLFeedback(baseScore, 'listening')

  const qSummary = questions.map((q, i) =>
    `Q${i+1}: "${q.question}" | Aluno: "${q.userAnswer}" | Correta: "${q.correctAnswer}" | ${q.userAnswer === q.correctAnswer ? 'CERTO' : 'ERRADO'}`
  ).join('\n')

  const prompt = `Voce e avaliador TOEFL. Analise as respostas de Listening:

RESPOSTAS:
${qSummary}

Score calculado: ${baseScore}/30

Responda SOMENTE JSON:
{
  "score": ${baseScore},
  "level": "Basico|Intermediario|Avancado",
  "strengths": "O que o aluno fez bem",
  "improvements": "O que precisa melhorar",
  "tips": "2 dicas praticas para Listening TOEFL",
  "detail": "Analise das questoes erradas"
}`

  const text = await callClaude(prompt, 400)
  if (!text) return localTOEFLFeedback(baseScore, 'listening')
  return parseJSON<TOEFLSectionFeedback>(text, localTOEFLFeedback(baseScore, 'listening'))
}

// ============================================================
// 4. TOEFL SPEAKING — IA avalia texto escrito como fala
// ============================================================

export async function getTOEFLSpeakingFeedback(
  prompt_task: string,
  userResponse: string
): Promise<TOEFLSectionFeedback> {
  const words = userResponse.trim().split(/\s+/).filter(Boolean).length
  const baseScore = Math.min(30, Math.max(0, Math.round((words / 120) * 20) + 5))

  if (!HAS_API_KEY || userResponse.trim().length < 10) return localTOEFLFeedback(baseScore, 'speaking')

  const prompt = `You are an official ETS evaluator for the TOEFL iBT Speaking section.

RULES:
- IGNORE foreign accents completely — accent does NOT affect the score.
- Penalize ONLY: long hesitations, unnatural pauses, loss of fluency, unintelligibility.
- Score using ETS rubric 1-4 (then multiply by 7.5 to get /30 equivalent).

TASK: "${prompt_task}"
STUDENT RESPONSE (written as spoken): "${userResponse}"

Evaluate using the three ETS dimensions:
1. Delivery: fluency, pace, clarity, natural rhythm (no long pauses, no filler words)
2. Language Use: grammar accuracy, vocabulary range, syntactic complexity
3. Topic Development: completeness, coherence, specific examples, logical progression

Responda SOMENTE JSON:
{
  "score": <numero 0-30>,
  "level": "Abaixo do basico|Basico|Intermediario|Avancado|Excelente",
  "strengths": "What the student did well (in Portuguese)",
  "improvements": "Specific improvements needed for TOEFL Speaking",
  "tips": "2 ETS-specific strategies to raise the score",
  "detail": "Grammar and vocabulary analysis"
}`

  const text = await callClaude(prompt, 500)
  if (!text) return localTOEFLFeedback(baseScore, 'speaking')
  return parseJSON<TOEFLSectionFeedback>(text, localTOEFLFeedback(baseScore, 'speaking'))
}

// ============================================================
// 5. TOEFL WRITING — IA avalia redacao com rubrica TOEFL
// ============================================================

export async function getTOEFLWritingFeedback(
  prompt_task: string,
  essay: string
): Promise<TOEFLSectionFeedback> {
  const words = essay.trim().split(/\s+/).filter(Boolean).length
  const baseScore = words < 50 ? 5 : words < 150 ? 15 : words < 250 ? 20 : 25

  if (!HAS_API_KEY || essay.trim().length < 20) return localTOEFLFeedback(baseScore, 'writing')

  const prompt = `Voce e avaliador TOEFL Writing (IBT). Avalie esta redacao:

PROMPT: "${prompt_task}"
REDACAO (${words} palavras): "${essay}"

Avalie com a rubrica oficial TOEFL Writing:
- Task Achievement (respondeu a pergunta?)
- Coherence & Cohesion (organizacao, conectivos)
- Lexical Resource (vocabulario variado)
- Grammatical Range & Accuracy (gramatica)

Score: 0-30 pontos

Responda SOMENTE JSON:
{
  "score": <numero 0-30>,
  "level": "Abaixo do basico|Basico|Intermediario|Avancado|Excelente",
  "strengths": "Pontos fortes da redacao",
  "improvements": "3 pontos principais para melhorar",
  "tips": "2 estrategias para TOEFL Writing",
  "detail": "Feedback sobre gramatica e vocabulario"
}`

  const text = await callClaude(prompt, 600)
  if (!text) return localTOEFLFeedback(baseScore, 'writing')
  return parseJSON<TOEFLSectionFeedback>(text, localTOEFLFeedback(baseScore, 'writing'))
}

// ---- Fallback local TOEFL ----

function localTOEFLFeedback(score: number, section: string): TOEFLSectionFeedback {
  const level = score >= 25 ? 'Avancado' : score >= 18 ? 'Intermediario' : score >= 10 ? 'Basico' : 'Abaixo do basico'
  return {
    score,
    level,
    strengths: 'Continue praticando regularmente.',
    improvements: `Foque em melhorar sua pontuacao em ${section}.`,
    tips: 'Configure sua API Key Anthropic no .env para receber feedback detalhado da IA.',
    detail: `Score estimado: ${score}/30`,
  }
}
