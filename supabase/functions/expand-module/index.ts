// Supabase Edge Function: expand-module
// Admin-only. Generates new exercises via Claude for a module until it reaches
// `target_count` rows, prioritizing skills (reading/listening/speaking/writing)
// that currently have the least coverage in that module.
//
// Deploy: supabase functions deploy expand-module
// Secrets needed (supabase secrets set ...):
//   ANTHROPIC_API_KEY   — server-side Claude key (never the browser VITE_ key)
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically by the platform.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const BATCH_SIZE = 15
const MIN_SKILL_COVERAGE = 15 // aim for at least this many of each skill before topping up with objective exercises

interface GeneratedExercise {
  type: 'gap_fill' | 'multiple_choice' | 'production'
  question: string
  answer: string
  options: string[] | null
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  toefl_skill: 'reading' | 'listening' | 'speaking' | 'writing' | null
}

Deno.serve(async req => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')

    const authHeader = req.headers.get('Authorization') ?? ''
    const jwt = authHeader.replace('Bearer ', '')

    // Client scoped to the caller's JWT — used only to verify who is calling.
    const callerClient = createClient(supabaseUrl, serviceKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await callerClient.auth.getUser(jwt)
    if (userErr || !userData?.user) {
      return json({ error: 'Não autenticado.' }, 401, cors)
    }

    // Service-role client — bypasses RLS, used only after confirming admin below.
    const admin = createClient(supabaseUrl, serviceKey)

    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('user_id', userData.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return json({ error: 'Apenas admin pode expandir módulos.' }, 403, cors)
    }

    const { content_id, target_count } = await req.json()
    if (!content_id || !target_count) {
      return json({ error: 'content_id e target_count são obrigatórios.' }, 400, cors)
    }

    const { data: content } = await admin.from('contents').select('id, name').eq('id', content_id).single()
    if (!content) return json({ error: `Módulo ${content_id} não encontrado.` }, 404, cors)

    const { data: existing } = await admin
      .from('exercises')
      .select('block_number, exercise_number, toefl_skill')
      .eq('content_id', content_id)
      .order('exercise_number', { ascending: false })

    const rows = existing || []
    const currentTotal = rows.length
    const needed = Math.max(0, target_count - currentTotal)
    if (needed === 0) {
      return json({ inserted: 0, total: currentTotal, message: 'Módulo já está na quantidade desejada.' }, 200, cors)
    }

    const skillCounts: Record<string, number> = { reading: 0, listening: 0, speaking: 0, writing: 0 }
    rows.forEach(r => { if (r.toefl_skill) skillCounts[r.toefl_skill] = (skillCounts[r.toefl_skill] || 0) + 1 })

    let nextExerciseNumber = (rows[0]?.exercise_number || 0) + 1
    let nextBlockNumber = Math.max(1, ...rows.map(r => r.block_number)) + 1

    let remaining = needed
    let insertedTotal = 0
    let skippedTotal = 0

    while (remaining > 0) {
      const batchSize = Math.min(BATCH_SIZE, remaining)

      // Decide skill focus for this batch: top up whichever skill is furthest below MIN_SKILL_COVERAGE.
      const skillNeeds = (['reading', 'listening', 'speaking', 'writing'] as const)
        .filter(s => skillCounts[s] < MIN_SKILL_COVERAGE)
        .sort((a, b) => skillCounts[a] - skillCounts[b])
      const focusSkill = skillNeeds[0] ?? null

      const generated = await generateBatch(anthropicKey, content.name, content_id, batchSize, focusSkill)

      const toInsert = generated
        .filter(isValidExercise)
        .slice(0, batchSize)
        .map((ex, i) => ({
          content_id,
          block_number: nextBlockNumber,
          exercise_number: nextExerciseNumber + i,
          type: ex.type,
          question: ex.question,
          answer: ex.answer,
          options: ex.options,
          explanation: ex.explanation,
          difficulty: ex.difficulty,
          toefl_skill: ex.toefl_skill,
        }))

      skippedTotal += generated.length - toInsert.length

      if (toInsert.length > 0) {
        const { error: insertErr } = await admin
          .from('exercises')
          .upsert(toInsert, { onConflict: 'content_id,block_number,exercise_number', ignoreDuplicates: true })
        if (!insertErr) {
          insertedTotal += toInsert.length
          toInsert.forEach(ex => { if (ex.toefl_skill) skillCounts[ex.toefl_skill]++ })
          nextExerciseNumber += toInsert.length
          nextBlockNumber++
        }
      }

      remaining -= batchSize
      if (generated.length === 0) break // Claude failed repeatedly — stop instead of looping forever
    }

    return json({
      inserted: insertedTotal,
      skipped: skippedTotal,
      total: currentTotal + insertedTotal,
    }, 200, cors)
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Erro desconhecido' }, 500, cors)
  }
})

function isValidExercise(ex: unknown): ex is GeneratedExercise {
  if (!ex || typeof ex !== 'object') return false
  const e = ex as Record<string, unknown>
  return (
    typeof e.question === 'string' && e.question.length > 5 &&
    typeof e.answer === 'string' &&
    typeof e.explanation === 'string' &&
    ['gap_fill', 'multiple_choice', 'production'].includes(e.type as string) &&
    ['easy', 'medium', 'hard'].includes(e.difficulty as string) &&
    (e.options === null || Array.isArray(e.options))
  )
}

async function generateBatch(
  anthropicKey: string | undefined,
  moduleName: string,
  contentId: string,
  count: number,
  focusSkill: string | null
): Promise<GeneratedExercise[]> {
  if (!anthropicKey) return []

  const skillInstruction = focusSkill
    ? `All ${count} exercises must have "toefl_skill": "${focusSkill}" and be tagged in the question text with "[TOEFL ${focusSkill[0].toUpperCase() + focusSkill.slice(1)}]" at the start, following genuine TOEFL ${focusSkill} task format.`
    : `These are general grammar practice exercises — set "toefl_skill": null.`

  const prompt = `You are writing English grammar practice exercises for a TOEFL prep app, module "${moduleName}" (content_id: "${contentId}").

Write exactly ${count} NEW exercises. ${skillInstruction}

Rules:
- Question text must be clear and unambiguous (a student reading it once should understand exactly what to do — no dense multi-blank patterns).
- For "gap_fill": answer is the missing word(s), options is null.
- For "multiple_choice": options is an array of 3-4 strings, answer matches one option exactly.
- For "production" (used for speaking/writing tasks): answer is "", options is null.
- difficulty: mix of easy/medium/hard.
- explanation: one short sentence explaining the grammar rule.
- Use plain double quotes correctly escaped for valid JSON — do not use smart quotes.

Respond ONLY with a valid JSON array, no markdown, no commentary:
[
  {"type":"gap_fill","question":"...","answer":"...","options":null,"explanation":"...","difficulty":"easy","toefl_skill":null},
  ...
]`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return []
    const data = await res.json()
    const text: string = data?.content?.[0]?.text ?? ''
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return []
    return JSON.parse(match[0])
  } catch {
    return []
  }
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
}
