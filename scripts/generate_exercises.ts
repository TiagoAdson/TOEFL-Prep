/**
 * generate_exercises.ts
 *
 * Gera exercícios para um módulo usando Claude API e insere no Supabase.
 * Uso: npx tsx scripts/generate_exercises.ts <content-id> [--count 300]
 *
 * Exemplo: npx tsx scripts/generate_exercises.ts present-simple --count 300
 *
 * Requer: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY no .env
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL  || ''
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY || ''
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || ''

if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_KEY) {
  console.error('❌ Variáveis faltando: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY')
  process.exit(1)
}

const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY)
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })

const contentId = process.argv[2]
const countArg  = process.argv.indexOf('--count')
const TARGET    = countArg >= 0 ? parseInt(process.argv[countArg + 1]) : 300
const BATCH_SIZE = 20

if (!contentId) {
  console.error('❌ Uso: npx tsx scripts/generate_exercises.ts <content-id> [--count 300]')
  process.exit(1)
}

interface Exercise {
  content_id: string
  block_number: number
  exercise_number: number
  type: 'gap_fill' | 'multiple_choice' | 'production'
  question: string
  answer: string
  options: string[] | null
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

async function getContentInfo() {
  const { data, error } = await supabase
    .from('contents')
    .select('id, name, level_id')
    .eq('id', contentId)
    .single()
  if (error || !data) throw new Error(`Conteúdo '${contentId}' não encontrado`)
  return data
}

async function getCurrentCount(): Promise<number> {
  const { count } = await supabase
    .from('exercises')
    .select('id', { count: 'exact', head: true })
    .eq('content_id', contentId)
  return count || 0
}

async function getMaxNumbers(): Promise<{ maxBlock: number; maxExercise: number }> {
  const { data } = await supabase
    .from('exercises')
    .select('block_number, exercise_number')
    .eq('content_id', contentId)
    .order('exercise_number', { ascending: false })
    .limit(1)
  if (!data || data.length === 0) return { maxBlock: 0, maxExercise: 0 }
  return { maxBlock: data[0].block_number, maxExercise: data[0].exercise_number }
}

async function generateBatch(
  content: { id: string; name: string; level_id: string },
  startExercise: number,
  startBlock: number,
  count: number
): Promise<Exercise[]> {
  const prompt = `You are generating English grammar exercises for a TOEFL preparation app called "Meu Inglês" (Brazilian students).

CONTENT MODULE: "${content.name}" (ID: ${content.id}, Level: ${content.level_id})
EXERCISES NEEDED: ${count} exercises
STARTING EXERCISE NUMBER: ${startExercise}
STARTING BLOCK NUMBER: ${startBlock}

Generate EXACTLY ${count} exercises. Mix of:
- 40% gap_fill (fill in the blank — single word or short phrase)
- 40% multiple_choice (4 options, one correct)
- 20% production (TOEFL Speaking/Writing prompt, 45s)

Difficulty distribution: 30% easy, 50% medium, 20% hard.
Include TOEFL academic context in at least 50% of exercises.

Return ONLY a JSON array with this exact structure (no markdown, no explanation):
[
  {
    "block_number": ${startBlock},
    "exercise_number": ${startExercise},
    "type": "gap_fill",
    "question": "She ___ to school every day.",
    "answer": "goes",
    "options": null,
    "explanation": "3rd person singular: verb + s",
    "difficulty": "easy"
  },
  {
    "block_number": ${startBlock},
    "exercise_number": ${startExercise + 1},
    "type": "multiple_choice",
    "question": "Which sentence is correct?",
    "answer": "She goes to school.",
    "options": ["She go to school.", "She goes to school.", "She going to school.", "She goed to school."],
    "explanation": "3rd person singular requires -s",
    "difficulty": "medium"
  }
]

Rules:
- Increment exercise_number sequentially from ${startExercise}
- Group 10 exercises per block_number (block ${startBlock} = exercises ${startExercise}-${startExercise + 9}, block ${startBlock + 1} = next 10, etc.)
- For gap_fill: options must be null
- For multiple_choice: options must be array of exactly 4 strings, answer must be one of those strings
- For production: answer is empty string "", options is null
- All text in English, explanations can be brief Portuguese
- Make questions progressively harder within each block`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Claude não retornou JSON válido')

  const parsed = JSON.parse(jsonMatch[0])
  return parsed.map((e: Omit<Exercise, 'content_id'>) => ({ ...e, content_id: contentId }))
}

async function insertBatch(exercises: Exercise[]): Promise<number> {
  const { data, error } = await supabase
    .from('exercises')
    .insert(exercises)
    .select('id')

  if (error) {
    // ON CONFLICT — contar quantos foram inseridos
    if (error.code === '23505') {
      // Tenta um por um
      let inserted = 0
      for (const ex of exercises) {
        const { error: e2 } = await supabase.from('exercises').insert(ex)
        if (!e2) inserted++
      }
      return inserted
    }
    throw error
  }
  return data?.length || 0
}

async function main() {
  console.log(`\n🚀 Gerador de Exercícios — Meu Inglês`)
  console.log(`📚 Módulo: ${contentId}`)
  console.log(`🎯 Meta: ${TARGET} exercícios\n`)

  const content = await getContentInfo()
  console.log(`✅ Conteúdo encontrado: "${content.name}" (${content.level_id})\n`)

  const currentCount = await getCurrentCount()
  const needed = Math.max(0, TARGET - currentCount)
  console.log(`📊 Existentes: ${currentCount} | Faltam: ${needed}`)

  if (needed === 0) {
    console.log(`✅ Módulo já tem ${currentCount} exercícios. Nada a fazer.`)
    return
  }

  const { maxBlock, maxExercise } = await getMaxNumbers()
  let currentBlock    = maxBlock > 0 ? maxBlock : 1
  let currentExercise = maxExercise > 0 ? maxExercise + 1 : 1

  let totalInserted = 0
  const batches = Math.ceil(needed / BATCH_SIZE)

  for (let i = 0; i < batches; i++) {
    const batchCount = Math.min(BATCH_SIZE, needed - totalInserted)
    process.stdout.write(`  Batch ${i + 1}/${batches} (${batchCount} exercícios)... `)

    try {
      const exercises = await generateBatch(content, currentExercise, currentBlock, batchCount)
      const inserted  = await insertBatch(exercises)
      totalInserted  += inserted
      currentExercise += batchCount
      currentBlock = Math.ceil(currentExercise / 10)
      console.log(`✅ ${inserted} inseridos (total: ${currentCount + totalInserted})`)
    } catch (err) {
      console.error(`\n  ❌ Erro no batch ${i + 1}:`, err)
      // Aguarda 2s e tenta próximo batch
      await new Promise(r => setTimeout(r, 2000))
    }

    // Rate limiting: 1s entre batches
    if (i < batches - 1) await new Promise(r => setTimeout(r, 1000))
  }

  const finalCount = await getCurrentCount()
  console.log(`\n🎉 Concluído! Módulo "${content.name}" agora tem ${finalCount} exercícios.`)

  // Salvar log
  const logFile = `scripts/logs/generate_${contentId}_${Date.now()}.json`
  fs.mkdirSync('scripts/logs', { recursive: true })
  fs.writeFileSync(logFile, JSON.stringify({ contentId, target: TARGET, inserted: totalInserted, finalCount, date: new Date().toISOString() }, null, 2))
  console.log(`📝 Log salvo em ${logFile}`)
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err)
  process.exit(1)
})
