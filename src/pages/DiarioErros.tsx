import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, supabaseConfigured } from '../utils/supabase'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
const HAS_AI  = !!API_KEY && !API_KEY.includes('seu-key')

interface Mistake {
  id: string
  question:      string
  user_answer:   string
  correct_answer: string
  content_id:    string
  created_at:    string
  is_resolved:   boolean
  notes?:        string
}

interface ChatMsg { role: 'ai' | 'user'; text: string }

export default function DiarioErros() {
  const { user } = useAuth()
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<Mistake | null>(null)
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { loadMistakes() }, [user])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat])

  async function loadMistakes() {
    if (!supabaseConfigured || !user) { setLoading(false); return }
    const { data } = await supabase
      .from('mistake_journal')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })
    setMistakes(data ?? [])
    setLoading(false)
  }

  function openMistake(m: Mistake) {
    setActive(m)
    setInput('')
    const opening: ChatMsg = {
      role: 'ai',
      text: `📌 **Questão:** "${m.question}"\n\n` +
        `Sua resposta: **"${m.user_answer}"**\n` +
        `Resposta correta: **"${m.correct_answer}"**\n\n` +
        `Escreva qualquer dúvida abaixo ou apenas clique em enviar para que eu te explique objetivamente por que essa é a resposta correta.`,
    }
    setChat([opening])
  }

  async function sendMessage() {
    if (!input.trim() || !active || thinking) return
    const userMsg: ChatMsg = { role: 'user', text: input.trim() }
    setChat(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    if (!HAS_AI) {
      setTimeout(() => {
        setChat(prev => [...prev, {
          role: 'ai',
          text: `Interessante! Configure a API Key Anthropic para receber análise socrática personalizada. ` +
            `A resposta correta é "${active.correct_answer}" porque: ${active.notes || 'revise o conteúdo relacionado.'}`,
        }])
        setThinking(false)
      }, 600)
      return
    }

    try {
      const history = chat.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      }))

      const systemPrompt = `Você é um professor particular de inglês focado em ser o mais claro e objetivo possível.
O aluno errou a seguinte questão e quer entender o porquê.

QUESTÃO: "${active.question}"
RESPOSTA DO ALUNO: "${active.user_answer}" (INCORRETA)
RESPOSTA CORRETA: "${active.correct_answer}"

SEU PAPEL:
1. Vá direto ao ponto. Explique de forma clara e objetiva por que a resposta do aluno está errada e por que a outra é a correta.
2. Foque na regra gramatical ou de vocabulário, usando frases curtas e simples.
3. Não use o método socrático e não faça perguntas abertas. Dê a resposta mastigada.
4. Responda sempre em português, com tom prestativo e encorajador.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY!,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-5',
          max_tokens: 400,
          system: systemPrompt,
          messages: [
            ...history,
            { role: 'user', content: userMsg.text },
          ],
        }),
      })
      const data = await res.json()
      const aiText = data?.content?.[0]?.text ?? 'Não consegui processar. Tente novamente.'
      setChat(prev => [...prev, { role: 'ai', text: aiText }])

      if (aiText.includes('✅')) {
        await markResolved(active.id)
        setMistakes(prev => prev.filter(m => m.id !== active.id))
      }
    } catch {
      setChat(prev => [...prev, { role: 'ai', text: 'Erro de conexão. Verifique sua API Key e tente novamente.' }])
    } finally {
      setThinking(false)
    }
  }

  async function markResolved(id: string) {
    if (!supabaseConfigured) return
    const reviewDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    await supabase
      .from('mistake_journal')
      .update({ is_resolved: true, spaced_review_date: reviewDate })
      .eq('id', id)
  }

  if (loading) return <div className="loading">Carregando diário...</div>

  // ---- Tela principal ----
  if (!active) {
    return (
      <div>
        <h2 style={S.pageTitle}>Diário de Erros</h2>
        <p style={S.pageDesc}>
          Analise seus erros com o método socrático. A IA guia você até entender o conceito — sem dar a resposta de imediato.
        </p>

        {mistakes.length === 0 ? (
          <div style={S.emptyState}>
            <span style={{ fontSize: 40 }}>🎉</span>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginTop: 12 }}>
              Nenhum erro pendente!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
              Seus erros do Simulado e do Treino Diário aparecerão aqui.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mistakes.map(m => (
              <div key={m.id} style={S.mistakeCard}>
                <div style={{ flex: 1 }}>
                  <div style={S.mistakeQ}>{m.question}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={S.wrongTag}>✗ {m.user_answer}</span>
                    <span style={S.rightTag}>✓ {m.correct_answer}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {new Date(m.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <button style={S.analyzeBtn} onClick={() => openMistake(m)}>
                  Analisar →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ---- Chat socrático ----
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <button style={S.backBtn} onClick={() => setActive(null)}>
        ← Voltar ao Diário
      </button>

      <div style={S.chatBox}>
        {chat.map((msg, i) => (
          <div key={i} style={msg.role === 'ai' ? S.aiMsg : S.userMsg}>
            <pre style={S.msgText}>{msg.text}</pre>
          </div>
        ))}
        {thinking && (
          <div style={S.aiMsg}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>A IA está pensando...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={S.inputRow}>
        <input
          style={S.chatInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage() }}
          placeholder="Explique seu raciocínio em português ou inglês..."
          disabled={thinking}
          spellCheck={false}
        />
        <button style={S.sendBtn} onClick={sendMessage} disabled={!input.trim() || thinking}>
          Enviar
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button style={S.resolveBtn} onClick={async () => {
          await markResolved(active.id)
          setMistakes(prev => prev.filter(m => m.id !== active.id))
          setActive(null)
        }}>
          ✅ Marcar como resolvido
        </button>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  pageTitle: { fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.3px' },
  pageDesc: { fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 },
  emptyState: { textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' },
  mistakeCard: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 },
  mistakeQ: { fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5 },
  wrongTag: { fontSize: 12, fontWeight: 600, color: '#BE123C', background: '#FFF1F2', padding: '2px 10px', borderRadius: 999 },
  rightTag: { fontSize: 12, fontWeight: 600, color: '#15803D', background: '#F0FDF4', padding: '2px 10px', borderRadius: 999 },
  analyzeBtn: { padding: '8px 16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, flexShrink: 0 },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'inherit', padding: '0 0 16px', fontWeight: 500 },
  chatBox: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, minHeight: 300, maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 },
  aiMsg: { background: 'var(--bg)', borderRadius: '12px 12px 12px 2px', padding: '12px 16px', maxWidth: '85%', alignSelf: 'flex-start' },
  userMsg: { background: '#EEF2FF', borderRadius: '12px 12px 2px 12px', padding: '12px 16px', maxWidth: '85%', alignSelf: 'flex-end' },
  msgText: { fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' },
  inputRow: { display: 'flex', gap: 8 },
  chatInput: { flex: 1, padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--surface)', outline: 'none' },
  sendBtn: { padding: '11px 20px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13 },
  resolveBtn: { fontSize: 12, fontWeight: 600, color: '#15803D', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
}
