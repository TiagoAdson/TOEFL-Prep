import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, supabaseConfigured, type Content } from '../utils/supabase'

const WEEK_GOAL = 70
const PASSING = 80

interface Stats {
  total: number
  correct: number
  accuracy: number
  weekDone: number
}

interface ContentWithProgress extends Content {
  accuracy?: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [contents, setContents] = useState<ContentWithProgress[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, correct: 0, accuracy: 0, weekDone: 0 })
  const [currentContentId, setCurrentContentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [user])

  async function loadData() {
    if (!supabaseConfigured || !user) {
      setContents(DEMO_CONTENTS)
      setLoading(false)
      return
    }
    try {
      const { data: contentsData } = await supabase
        .from('contents')
        .select('*')
        .order('order_number')

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      let masteryMap: Record<string, { total: number; correct: number }> = {}
      let weekDone = 0

      if (progressData && progressData.length > 0) {
        const correct = progressData.filter(p => p.is_correct).length
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        weekDone = progressData.filter(p => new Date(p.created_at) >= oneWeekAgo).length

        progressData.forEach(p => {
          if (!masteryMap[p.content_id]) masteryMap[p.content_id] = { total: 0, correct: 0 }
          masteryMap[p.content_id].total++
          if (p.is_correct) masteryMap[p.content_id].correct++
        })

        setStats({
          total: progressData.length,
          correct,
          accuracy: Math.round((correct / progressData.length) * 100),
          weekDone,
        })

        const last = [...progressData].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
        setCurrentContentId(last.content_id)
      }

      setContents(
        (contentsData || []).map(c => ({
          ...c,
          accuracy: masteryMap[c.id]
            ? Math.round((masteryMap[c.id].correct / masteryMap[c.id].total) * 100)
            : undefined,
        }))
      )
    } catch (err) {
      console.error(err)
      setContents(DEMO_CONTENTS)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Carregando...</div>

  const currentContent = currentContentId
    ? contents.find(c => c.id === currentContentId)
    : contents[0]

  const weekPct = Math.min((stats.weekDone / WEEK_GOAL) * 100, 100)

  return (
    <div>
      {/* Stats */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>Seu Progresso</h2>
        <div style={S.statsGrid}>
          <StatCard value={stats.total}          label="Exercícios Feitos" />
          <StatCard value={stats.correct}         label="Corretos"          accent="#22C55E" />
          <StatCard value={`${stats.accuracy}%`} label="Acurácia"          accent="#4F46E5" />
          <StatCard value={`${stats.weekDone}/${WEEK_GOAL}`} label="Meta Semanal" accent="#F59E0B" />
        </div>

        {/* Barra meta semanal */}
        <div style={S.weekBarWrap}>
          <div style={S.weekBarTrack}>
            <div style={{ ...S.weekBarFill, width: `${weekPct}%` }} />
          </div>
          <span style={S.weekBarLabel}>{stats.weekDone} de {WEEK_GOAL} exercícios esta semana</span>
        </div>
      </section>

      {/* Treino do dia */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>Continuar Estudando</h2>
        {currentContent ? (
          <div style={S.heroCard}>
            <div style={S.heroLeft}>
              <span style={{ ...S.levelBadge, background: levelColor(currentContent.level_id) }}>
                {currentContent.level_id}
              </span>
              <h3 style={S.heroName}>{currentContent.name}</h3>
              <p style={S.heroDesc}>{currentContent.description}</p>
              {currentContent.accuracy != null && (
                <div style={S.accuracyRow}>
                  <div style={S.accuracyTrack}>
                    <div style={{
                      ...S.accuracyFill,
                      width: `${currentContent.accuracy}%`,
                      background: currentContent.accuracy >= PASSING ? '#22C55E' : '#4F46E5',
                    }} />
                  </div>
                  <span style={S.accuracyLabel}>{currentContent.accuracy}% acurácia</span>
                </div>
              )}
            </div>
            <button
              style={S.trainBtn}
              onClick={() => navigate(`/exercise/${currentContent.id}/1`)}
            >
              Iniciar Treino do Dia
              <span style={S.trainBtnSub}>14 questões</span>
            </button>
          </div>
        ) : (
          <p style={{ color: '#64748B', fontSize: 14 }}>Nenhum conteúdo disponível.</p>
        )}
      </section>

      {/* Simulado */}
      <section style={S.section}>
        <div style={S.simuladoCard}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
              Simulado TOEFL
            </h3>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Disponível após dominar o Módulo 13 — Passive Voice
            </p>
          </div>
          <button
            style={S.simuladoBtn}
            onClick={() => navigate('/simulado')}
          >
            Ir para o Simulado
          </button>
        </div>
      </section>
    </div>
  )
}

function StatCard({ value, label, accent = '#0F172A' }: { value: string | number; label: string; accent?: string }) {
  return (
    <div style={S.statCard}>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent, letterSpacing: '-1px' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

function levelColor(level: string): string {
  const map: Record<string, string> = {
    A1: '#3B82F6', A2: '#6366F1',
    B1: '#8B5CF6', B2: '#EC4899',
    C1: '#F59E0B', C2: '#10B981',
  }
  return map[level] ?? '#64748B'
}

const S: Record<string, React.CSSProperties> = {
  section: { marginBottom: 36 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 16, letterSpacing: '-0.3px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 },
  statCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 12,
    padding: '18px 20px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
  },
  weekBarWrap: { display: 'flex', alignItems: 'center', gap: 12 },
  weekBarTrack: { flex: 1, height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
  weekBarFill: { height: '100%', background: '#F59E0B', borderRadius: 999, transition: 'width 0.5s ease' },
  weekBarLabel: { fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap', fontWeight: 500 },
  heroCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
    flexWrap: 'wrap',
  },
  heroLeft: { flex: 1, minWidth: 200 },
  levelBadge: {
    display: 'inline-block',
    color: 'white',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.3px',
    marginBottom: 8,
  },
  heroName: { fontSize: 20, fontWeight: 600, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.3px' },
  heroDesc: { fontSize: 13, color: '#64748B', margin: 0 },
  accuracyRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 },
  accuracyTrack: { flex: 1, height: 5, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
  accuracyFill: { height: '100%', borderRadius: 999, transition: 'width 0.5s ease' },
  accuracyLabel: { fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap', fontWeight: 500 },
  trainBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '14px 28px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '0.3px',
    boxShadow: '0 2px 12px rgba(79,70,229,0.30)',
    transition: 'background 0.18s',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  trainBtnSub: { fontSize: 11, fontWeight: 400, opacity: 0.8 },
  simuladoCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  simuladoBtn: {
    padding: '10px 20px',
    background: 'transparent',
    color: '#4F46E5',
    border: '1.5px solid #4F46E5',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.3px',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },
}

const DEMO_CONTENTS: ContentWithProgress[] = [
  { id: 'verbo-to-be',       name: 'Verbo TO BE',       level_id: 'A1', description: 'Ser, estar, identidade', order_number: 1 },
  { id: 'present-simple',    name: 'Present Simple',    level_id: 'A1', description: 'Presente simples',       order_number: 2 },
  { id: 'past-simple',       name: 'Past Simple',       level_id: 'A1', description: 'Passado simples',        order_number: 3 },
  { id: 'present-continuous',name: 'Present Continuous',level_id: 'A1', description: 'Estar + -ing',           order_number: 4 },
  { id: 'passive-voice',     name: 'Passive Voice',     level_id: 'B1', description: 'Voz passiva',            order_number: 14 },
  { id: 'academic-connectors',name:'Academic Connectors',level_id: 'B2', description: 'Conectivos acadêmicos', order_number: 20 },
]
