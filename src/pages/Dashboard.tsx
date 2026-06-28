import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { supabase, supabaseConfigured, type Content } from '../utils/supabase'

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
  const { settings } = useSettings()
  const WEEK_GOAL = settings.metaGoal
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

      {/* Desempenho TOEFL */}
      <TOEFLScoreSection />

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

// ── TOEFL Score Section ──────────────────────────────────────

const SECTIONS = [
  { icon: '📖', label: 'Reading',   key: 'reading_score'   },
  { icon: '🎧', label: 'Listening', key: 'listening_score' },
  { icon: '🗣️', label: 'Speaking',  key: 'speaking_score'  },
  { icon: '✍️', label: 'Writing',   key: 'writing_score'   },
] as const

interface TOEFLScores {
  reading_score: number
  listening_score: number
  speaking_score: number
  writing_score: number
}

function scoreColor(score: number): string {
  if (score >= 26) return '#22C55E'
  if (score >= 21) return '#F59E0B'
  return '#EF4444'
}

function scoreBg(score: number): string {
  if (score >= 26) return 'rgba(34,197,94,0.08)'
  if (score >= 21) return 'rgba(245,158,11,0.08)'
  return 'rgba(239,68,68,0.08)'
}

function TOEFLScoreSection() {
  const { user } = useAuth()
  const [scores, setScores] = useState<TOEFLScores | null>(null)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    if (!user || !supabaseConfigured) return
    supabase
      .from('simulado_history')
      .select('reading_score, listening_score, speaking_score, writing_score')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) { setScores(data as TOEFLScores); setHasData(true) }
      })
  }, [user])

  const s = scores ?? { reading_score: 0, listening_score: 0, speaking_score: 0, writing_score: 0 }
  const total = s.reading_score + s.listening_score + s.speaking_score + s.writing_score

  return (
    <section style={S.section}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
        <h2 style={S.sectionTitle}>Desempenho TOEFL (Estimativa)</h2>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>Baseado nos últimos simulados</span>
      </div>

      {!hasData ? (
        <div style={T.empty}>
          <span style={{ fontSize: 28, marginBottom: 8 }}>🎯</span>
          <p style={{ margin: 0, fontWeight: 600, color: '#334155', fontSize: 14 }}>Nenhum simulado realizado ainda</p>
          <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: 13 }}>Complete um Simulado TOEFL para ver sua estimativa de nota aqui.</p>
        </div>
      ) : (
        <>
          <div style={T.grid}>
            {SECTIONS.map(({ icon, label, key }) => {
              const score = s[key]
              return (
                <div key={label} style={{ ...T.card, background: scoreBg(score) }}>
                  <div style={T.cardTop}>
                    <span style={T.icon}>{icon}</span>
                    <span style={T.label}>{label}</span>
                  </div>
                  <div style={{ ...T.score, color: scoreColor(score) }}>
                    {score}<span style={T.max}>/30</span>
                  </div>
                  <div style={T.barTrack}>
                    <div style={{ ...T.barFill, width: `${(score / 30) * 100}%`, background: scoreColor(score) }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div style={T.totalRow}>
            <span style={T.totalLabel}>Total estimado</span>
            <span style={{ ...T.totalScore, color: scoreColor(total / 4) }}>
              {total}<span style={{ fontSize: 16, fontWeight: 400, color: '#94A3B8' }}>/120</span>
            </span>
          </div>
        </>
      )}
    </section>
  )
}

const T: Record<string, React.CSSProperties> = {
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    background: '#F8FAFC',
    border: '1px dashed #CBD5E1',
    borderRadius: 14,
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))',
    gap: 12,
    marginBottom: 14,
  },
  card: {
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: '18px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: 7 },
  icon: { fontSize: 16 },
  label: { fontSize: 12, fontWeight: 600, color: '#475569' },
  score: { fontSize: 34, fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1 },
  max: { fontSize: 16, fontWeight: 400, color: '#CBD5E1', marginLeft: 1 },
  barTrack: { height: 4, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999, transition: 'width 0.5s ease' },
  totalRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 4,
  },
  totalLabel: { fontSize: 12, color: '#94A3B8', fontWeight: 500 },
  totalScore: { fontSize: 26, fontWeight: 700, letterSpacing: '-1px' },
}

// ── Demo data ────────────────────────────────────────────────

const DEMO_CONTENTS: ContentWithProgress[] = [
  { id: 'verbo-to-be',       name: 'Verbo TO BE',       level_id: 'A1', description: 'Ser, estar, identidade', order_number: 1 },
  { id: 'present-simple',    name: 'Present Simple',    level_id: 'A1', description: 'Presente simples',       order_number: 2 },
  { id: 'past-simple',       name: 'Past Simple',       level_id: 'A1', description: 'Passado simples',        order_number: 3 },
  { id: 'present-continuous',name: 'Present Continuous',level_id: 'A1', description: 'Estar + -ing',           order_number: 4 },
  { id: 'passive-voice',     name: 'Passive Voice',     level_id: 'B1', description: 'Voz passiva',            order_number: 14 },
  { id: 'academic-connectors',name:'Academic Connectors',level_id: 'B2', description: 'Conectivos acadêmicos', order_number: 20 },
]
