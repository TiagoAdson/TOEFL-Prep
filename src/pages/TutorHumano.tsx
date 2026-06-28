import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, supabaseConfigured } from '../utils/supabase'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
const HAS_AI  = !!API_KEY && !API_KEY.includes('seu-key')

const PROMPT_INSTRUCTION = `Você é um assistente pedagógico especializado em inglês acadêmico (TOEFL).
Analise o material do professor particular abaixo e:

1. Identifique quais módulos do currículo A1-C2 são cobertos (use exatamente estes nomes quando aplicável):
   Verbo TO BE, Present Simple, Past Simple, Present Continuous, Future (will/going to), Modal Verbs,
   Comparatives & Superlatives, Conditionals, Passive Voice, Reported Speech, Relative Clauses,
   Articles & Determiners, Academic Connectors, Noun Clauses, Gerunds & Infinitives,
   TOEFL Reading Skills, TOEFL Listening Skills, TOEFL Speaking Tasks, TOEFL Writing Tasks,
   Academic Vocabulary, Pronunciation & Fluency, Essay Structure, Grammar Review, Mock Test Practice

2. Crie 5 exercícios de homework personalizados baseados no material

Responda SOMENTE em JSON válido:
{
  "modules": ["lista dos módulos cobertos"],
  "summary": "Resumo do conteúdo em 2 linhas em português",
  "exercises": [
    {"question": "Pergunta em inglês", "answer": "Resposta correta", "tip": "Dica rápida em português"},
    {"question": "...", "answer": "...", "tip": "..."},
    {"question": "...", "answer": "...", "tip": "..."},
    {"question": "...", "answer": "...", "tip": "..."},
    {"question": "...", "answer": "...", "tip": "..."}
  ]
}`

interface SavedMaterial {
  id: string
  title: string
  created_at: string
  linked_contents: string[]
  homework_count: number
}

interface AnalysisResult {
  modules: string[]
  exercises: { question: string; answer: string; tip: string }[]
  summary: string
}

export default function TutorHumano() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [saved, setSaved] = useState(false)
  const [materials, setMaterials] = useState<SavedMaterial[]>([])
  const [loadingMaterials, setLoadingMaterials] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadMaterials() }, [user])

  async function loadMaterials() {
    if (!supabaseConfigured || !user) { setLoadingMaterials(false); return }
    const { data } = await supabase
      .from('tutor_materials')
      .select('id, title, created_at, linked_contents, homework_exercises')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setMaterials(
      (data || []).map(m => ({
        id: m.id,
        title: m.title ?? 'Material sem título',
        created_at: m.created_at,
        linked_contents: m.linked_contents ?? [],
        homework_count: Array.isArray(m.homework_exercises) ? m.homework_exercises.length : 0,
      }))
    )
    setLoadingMaterials(false)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setResult(null)
    setSaved(false)

    if (file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        setPdfBase64(base64)
        setText('')
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = () => {
        setText(reader.result as string)
        setPdfBase64(null)
      }
      reader.readAsText(file)
    }
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  function clearFile() {
    setPdfBase64(null)
    setFileName('')
    setText('')
    setResult(null)
    setSaved(false)
  }

  async function analyzeWithAI() {
    const hasContent = pdfBase64 !== null || text.trim().length > 0
    if (!hasContent || !HAS_AI) return
    setAnalyzing(true)
    setResult(null)
    setSaved(false)
    try {
      let messageContent: unknown

      if (pdfBase64) {
        messageContent = [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
          },
          { type: 'text', text: PROMPT_INSTRUCTION },
        ]
      } else {
        messageContent = `${PROMPT_INSTRUCTION}\n\nMATERIAL DO TUTOR:\n"""\n${text.slice(0, 3000)}\n"""`
      }

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
          max_tokens: 1200,
          messages: [{ role: 'user', content: messageContent }],
        }),
      })
      const data = await res.json()
      const raw = data?.content?.[0]?.text ?? ''
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]) as AnalysisResult)
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  async function saveMaterial() {
    if (!result || !supabaseConfigured || !user) return
    await supabase.from('tutor_materials').insert({
      user_id: user.id,
      title: title.trim() || fileName || 'Material do Tutor',
      content_text: text,
      linked_contents: result.modules,
      homework_exercises: result.exercises,
    })
    setSaved(true)
    clearFile()
    setTitle('')
    setResult(null)
    loadMaterials()
  }

  const hasContent = pdfBase64 !== null || text.trim().length > 0

  return (
    <div>
      <h2 style={S.pageTitle}>Meu Tutor Humano</h2>
      <p style={S.pageDesc}>
        Cole ou faça upload do material do seu professor particular. A IA identifica os módulos
        cobertos no <strong>Mapa de Progresso</strong> e gera exercícios de <strong>homework</strong> personalizados.
      </p>

      {!HAS_AI && (
        <div style={S.banner}>
          Configure <code>VITE_ANTHROPIC_API_KEY</code> no arquivo <code>.env</code> para ativar a IA.
        </div>
      )}

      {/* Upload form */}
      <div style={S.card}>
        <label style={S.label}>Título do Material (opcional)</label>
        <input
          style={S.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex: Aula 3 – Conditionals com a Professora Ana"
          spellCheck={false}
        />

        {/* File upload row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 4 }}>
          <label style={S.label}>Cole o texto ou faça upload do arquivo:</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            style={S.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            Enviar arquivo (PDF / TXT)
          </button>
        </div>

        {/* File chip */}
        {fileName && (
          <div style={S.fileChip}>
            <span style={{ fontSize: 14 }}>{pdfBase64 ? '📄' : '📝'}</span>
            <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{fileName}</span>
            {pdfBase64 && <span style={S.pdfBadge}>PDF pronto para análise</span>}
            <button onClick={clearFile} style={S.clearBtn}>✕</button>
          </div>
        )}

        {/* Text area — hidden when PDF is loaded */}
        {!pdfBase64 && (
          <textarea
            style={S.textarea}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Cole aqui o PDF, transcrição da aula, anotações ou qualquer material do seu tutor..."
            rows={8}
            spellCheck={false}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {pdfBase64 ? 'PDF carregado via upload' : `${text.length} caracteres`}
          </span>
          <button
            style={{ ...S.btn, opacity: !hasContent || analyzing ? 0.5 : 1 }}
            onClick={analyzeWithAI}
            disabled={!hasContent || analyzing || !HAS_AI}
          >
            {analyzing ? 'Analisando com IA...' : 'Analisar Material com IA →'}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={S.card}>
          <div style={S.resultHeader}>
            <h3 style={S.resultTitle}>Análise Concluída</h3>
            {!saved && (
              <button style={S.saveBtn} onClick={saveMaterial}>
                Salvar e Adicionar ao Mapa
              </button>
            )}
            {saved && <span style={S.savedBadge}>✓ Salvo</span>}
          </div>

          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
            {result.summary}
          </p>

          <div style={{ marginBottom: 20 }}>
            <div style={S.sectionLabel}>Módulos Identificados no Mapa de Progresso</div>
            <div style={S.tagsRow}>
              {result.modules.map(m => (
                <span key={m} style={S.tag}>{m}</span>
              ))}
            </div>
          </div>

          <div style={S.sectionLabel}>5 Exercícios de Homework</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result.exercises.map((ex, i) => (
              <div key={i} style={S.exerciseCard}>
                <div style={S.exNum}>Q{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{ex.question}</div>
                  <div style={{ fontSize: 13, color: '#22C55E', fontWeight: 600, marginBottom: 2 }}>✓ {ex.answer}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>💡 {ex.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved materials */}
      {!loadingMaterials && materials.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
            Materiais Salvos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {materials.map(m => (
              <div key={m.id} style={S.savedCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {new Date(m.created_at).toLocaleDateString('pt-BR')}
                    &nbsp;·&nbsp;{m.homework_count} exercícios
                    &nbsp;·&nbsp;{m.linked_contents.length} módulos
                  </div>
                </div>
                <div style={S.tagsRow}>
                  {m.linked_contents.slice(0, 3).map(c => (
                    <span key={c} style={S.tagSmall}>{c}</span>
                  ))}
                  {m.linked_contents.length > 3 && (
                    <span style={S.tagSmall}>+{m.linked_contents.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  pageTitle:   { fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.3px' },
  pageDesc:    { fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 },
  banner:      { background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#92400E', marginBottom: 20 },
  card:        { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' },
  label:       { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 },
  input:       { width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg)', outline: 'none', boxSizing: 'border-box' },
  textarea:    { width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6, marginTop: 8 },
  btn:         { padding: '10px 20px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13 },
  uploadBtn:   { padding: '7px 14px', background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 },
  fileChip:    { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 8, marginBottom: 10 },
  pdfBadge:    { fontSize: 11, fontWeight: 700, color: '#4F46E5', background: 'rgba(79,70,229,0.1)', padding: '2px 8px', borderRadius: 4 },
  clearBtn:    { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, padding: '2px 4px', lineHeight: 1 },
  resultHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultTitle: { fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 },
  saveBtn:     { padding: '8px 16px', background: '#22C55E', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 12 },
  savedBadge:  { fontSize: 13, fontWeight: 700, color: '#22C55E' },
  sectionLabel:{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 },
  tagsRow:     { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tag:         { fontSize: 12, fontWeight: 600, color: '#4F46E5', background: 'rgba(79,70,229,0.08)', padding: '3px 10px', borderRadius: 999 },
  tagSmall:    { fontSize: 11, color: '#7C3AED', background: 'rgba(124,58,237,0.08)', padding: '2px 8px', borderRadius: 999 },
  exerciseCard:{ display: 'flex', gap: 12, padding: '14px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' },
  exNum:       { fontSize: 11, fontWeight: 700, color: '#4F46E5', background: 'rgba(79,70,229,0.1)', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  savedCard:   { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)' },
}
