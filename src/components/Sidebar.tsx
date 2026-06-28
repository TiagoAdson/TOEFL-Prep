import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase, supabaseConfigured } from '../utils/supabase'

interface ContentNode {
  id: string
  name: string
  level_id: string
  order_number: number
  accuracy?: number
  hasTutorMaterial?: boolean
}

interface MasteryMap { [contentId: string]: number }

const NAV = [
  { label: 'Visão Geral',     to: '/',               icon: '⊞' },
  { label: 'Diário de Erros', to: '/diario-erros',   icon: '📓' },
  { label: 'Meu Tutor',       to: '/tutor-humano',   icon: '👤' },
  { label: 'Simulado',        to: '/simulado',        icon: '🎯' },
  { label: 'Minha Conta',     to: '/minha-conta',     icon: '⚙️' },
]

const LEVEL_ORDER = ['A1','A2','B1','B2','C1','C2']

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const { user, profile, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [contents, setContents] = useState<ContentNode[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!user || !supabaseConfigured) return
    loadSidebar()
  }, [user])

  async function loadSidebar() {
    const { data: contentsData } = await supabase
      .from('contents')
      .select('id, name, level_id, order_number')
      .order('order_number')

    const { data: progressData } = await supabase
      .from('user_progress')
      .select('content_id, is_correct, created_at')
      .eq('user_id', user!.id)

    const { data: materials } = await supabase
      .from('tutor_materials')
      .select('linked_contents')
      .eq('user_id', user!.id)

    // Computa acurácia por conteúdo
    const masteryMap: MasteryMap = {}
    if (progressData) {
      const grouped: Record<string, { total: number; correct: number }> = {}
      progressData.forEach(p => {
        if (!grouped[p.content_id]) grouped[p.content_id] = { total: 0, correct: 0 }
        grouped[p.content_id].total++
        if (p.is_correct) grouped[p.content_id].correct++
      })
      Object.entries(grouped).forEach(([id, { total, correct }]) => {
        masteryMap[id] = Math.round((correct / total) * 100)
      })

      // Conteúdo atual = último acessado
      const sorted = [...progressData].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      if (sorted[0]) setCurrentId(sorted[0].content_id)
    }

    // Conteúdos com material do tutor
    const tutorContentIds = new Set<string>()
    materials?.forEach(m => m.linked_contents?.forEach((id: string) => tutorContentIds.add(id)))

    setContents(
      (contentsData || []).map(c => ({
        ...c,
        accuracy: masteryMap[c.id],
        hasTutorMaterial: tutorContentIds.has(c.id),
      }))
    )
  }

  function dotColor(c: ContentNode): string {
    if ((c.accuracy ?? 0) >= 80) return '#22C55E'   // verde — dominado
    if (c.id === currentId)       return '#F59E0B'   // amarelo — estudando
    if ((c.accuracy ?? 0) > 0)    return '#F59E0B'   // amarelo — em progresso
    return '#CBD5E1'                                  // cinza — bloqueado
  }

  function itemBg(c: ContentNode): string {
    if ((c.accuracy ?? 0) >= 80) return 'rgba(34,197,94,0.07)'
    if (c.id === currentId)       return 'rgba(245,158,11,0.09)'
    return 'transparent'
  }

  const grouped = LEVEL_ORDER.reduce<Record<string, ContentNode[]>>((acc, level) => {
    acc[level] = contents.filter(c => c.level_id === level)
    return acc
  }, {})

  return (
    <aside style={S.sidebar} className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      {/* Botão fechar no mobile */}
      {onClose && (
        <button onClick={onClose} style={S.closeBtn} className="sidebar-close" aria-label="Fechar menu">✕</button>
      )}

      {/* Logo */}
      <div style={S.logoArea}>
        <button onClick={() => { navigate('/'); onClose?.() }} style={S.logoBtn}>
          <span style={S.logoText}>Meu Inglês</span>
        </button>
        <span style={S.badge}>SUA META: 110 TOEFL</span>
      </div>

      {/* Navegação global */}
      <nav style={S.nav}>
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            style={({ isActive }) => ({ ...S.navLink, ...(isActive ? S.navLinkActive : {}) })}
          >
            <span style={S.navIcon}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div style={S.divider} />

      {/* Mapa de progresso */}
      <div style={S.mapHeader}>
        <span style={S.mapTitle}>Mapa de Progresso</span>
        <button style={S.collapseBtn} onClick={() => setCollapsed(v => !v)}>
          {collapsed ? '▸' : '▾'}
        </button>
      </div>

      {!collapsed && (
        <div style={S.mapList}>
          {LEVEL_ORDER.map(level => {
            const items = grouped[level]
            if (!items?.length) return null
            return (
              <div key={level} style={S.levelGroup}>
                <span style={S.levelLabel}>{level}</span>
                {items.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/exercise/${c.id}/1`)}
                    style={{ ...S.mapItem, background: itemBg(c) }}
                    title={`${c.name}${c.accuracy != null ? ` — ${c.accuracy}%` : ''}`}
                  >
                    <span style={{ ...S.dot, background: dotColor(c) }} />
                    <span style={S.mapItemName}>{c.name}</span>
                    {c.id === currentId && <span style={S.hereTag}>📍 Você está aqui</span>}
                    {c.hasTutorMaterial && <span style={S.tutorTag}>Tutor</span>}
                    {(c.accuracy ?? 0) >= 80 && <span style={S.masteredTag}>✓</span>}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Rodapé do sidebar */}
      <div style={S.footer}>
        <button onClick={toggleTheme} style={S.themeBtn} title={isDark ? 'Modo claro' : 'Modo escuro'}>
          {isDark ? '☀️' : '🌙'}
        </button>
        <span style={S.footerName}>{profile?.full_name ?? user?.email}</span>
        <button onClick={signOut} style={S.signoutBtn}>Sair</button>
      </div>
    </aside>
  )
}

const S: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '272px',
    minWidth: '272px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    background: '#F8FAFC',
    borderRight: '1px solid #E2E8F0',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
  },
  logoArea: {
    padding: '20px 16px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #E2E8F0',
    flexShrink: 0,
  },
  logoBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
  },
  logoText: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: '-0.3px',
  },
  badge: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#4F46E5',
    background: 'rgba(79,70,229,0.10)',
    padding: '3px 8px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
  },
  nav: {
    padding: '10px 10px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flexShrink: 0,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 500,
    color: '#475569',
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
  },
  navLinkActive: {
    background: 'rgba(79,70,229,0.08)',
    color: '#4F46E5',
    fontWeight: 600,
  },
  navIcon: {
    fontSize: '14px',
    width: '18px',
    textAlign: 'center',
  },
  divider: {
    height: '1px',
    background: '#E2E8F0',
    margin: '4px 0',
    flexShrink: 0,
  },
  mapHeader: {
    padding: '10px 14px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  mapTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#94A3B8',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
  },
  collapseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94A3B8',
    fontSize: '12px',
    padding: '2px 4px',
    fontFamily: 'inherit',
  },
  mapList: {
    padding: '0 10px',
    flex: 1,
  },
  levelGroup: {
    marginBottom: '6px',
  },
  levelLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    color: '#CBD5E1',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    padding: '8px 4px 4px',
  },
  mapItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '7px 8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    transition: 'background 0.15s',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  mapItemName: {
    fontSize: '12.5px',
    color: '#334155',
    fontWeight: 400,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  hereTag: {
    fontSize: '9px',
    fontWeight: 600,
    color: '#78350F',
    background: '#FEF3C7',
    padding: '2px 6px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
    border: '1px solid #FDE68A',
    flexShrink: 0,
  },
  tutorTag: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#7C3AED',
    background: 'rgba(124,58,237,0.10)',
    padding: '1px 5px',
    borderRadius: '4px',
  },
  masteredTag: {
    fontSize: '11px',
    color: '#22C55E',
    fontWeight: 700,
  },
  footer: {
    marginTop: 'auto',
    padding: '14px 16px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  footerName: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: 500,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  themeBtn: {
    fontSize: '16px',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '4px 8px',
    cursor: 'pointer',
    flexShrink: 0,
    lineHeight: 1,
  },
  closeBtn: {
    display: 'none',
    position: 'absolute' as const,
    top: 12,
    right: 12,
    background: 'none',
    border: 'none',
    fontSize: 18,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: 4,
    lineHeight: 1,
  },
  signoutBtn: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#94A3B8',
    background: 'none',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'color 0.15s, border-color 0.15s',
    flexShrink: 0,
  },
}
