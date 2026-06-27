import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { supabase, supabaseConfigured } from '../utils/supabase'

function fmt(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}min${seconds % 60 ? ` ${seconds % 60}s` : ''}`
}

export default function MinhaConta() {
  const { user, profile } = useAuth()
  const { settings, updateSetting, updateTimer, officialTimes } = useSettings()
  const [tutorInput, setTutorInput] = useState(settings.tutorId)
  const [tutorSaved, setTutorSaved] = useState(false)
  const [tutorError, setTutorError] = useState('')

  async function saveTutor() {
    if (!tutorInput.trim() || !supabaseConfigured || !user) return
    setTutorError('')
    setTutorSaved(false)
    try {
      const { error } = await supabase
        .from('student_tutor')
        .upsert({ student_id: user.id, tutor_id: tutorInput.trim() }, { onConflict: 'student_id' })
      if (error) { setTutorError('ID inválido ou tutor não encontrado.'); return }
      updateSetting('tutorId', tutorInput.trim())
      setTutorSaved(true)
    } catch {
      setTutorError('Erro ao salvar. Verifique o ID e tente novamente.')
    }
  }

  return (
    <div>
      <h2 style={S.pageTitle}>Minha Conta</h2>
      <p style={S.pageDesc}>{profile?.full_name ?? user?.email}</p>

      {/* 1 — Meta Semanal */}
      <Section title="Meta Semanal de Exercícios" icon="🎯">
        <div style={S.row}>
          <span style={S.rowLabel}>Exercícios por semana</span>
          <strong style={{ color: '#4F46E5', fontSize: 18, fontWeight: 700 }}>{settings.metaGoal}</strong>
        </div>
        <input
          type="range"
          min={30} max={150} step={5}
          value={settings.metaGoal}
          onChange={e => updateSetting('metaGoal', Number(e.target.value))}
          style={S.range}
        />
        <div style={S.rangeLabels}>
          <span>30</span>
          <span style={{ color: '#94A3B8', fontSize: 12 }}>Padrão: 70</span>
          <span>150</span>
        </div>
      </Section>

      {/* 2 — Modo Hardcore (timers) */}
      <Section title="Modo Hardcore — Timers TOEFL" icon="⚡">
        <p style={S.hint}>Reduza o tempo para treinar sob pressão. Você não pode exceder o tempo oficial da ETS.</p>
        {([
          { key: 'speaking',  label: 'Speaking (por tarefa)', official: officialTimes.speaking  },
          { key: 'writing',   label: 'Writing (por redação)',  official: officialTimes.writing   },
          { key: 'reading',   label: 'Reading (por seção)',    official: officialTimes.reading   },
          { key: 'listening', label: 'Listening (por seção)',  official: officialTimes.listening },
        ] as const).map(({ key, label, official }) => (
          <div key={key} style={S.timerRow}>
            <div style={{ flex: 1 }}>
              <div style={S.rowLabel}>{label}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Oficial: {fmt(official)}</div>
            </div>
            <div style={S.timerInputWrap}>
              <input
                type="number"
                min={10}
                max={official}
                step={key === 'speaking' ? 5 : 60}
                value={settings.timers[key]}
                onChange={e => updateTimer(key, Number(e.target.value))}
                style={S.timerInput}
              />
              <span style={{ fontSize: 12, color: '#64748B' }}>{fmt(settings.timers[key])}</span>
            </div>
          </div>
        ))}
      </Section>

      {/* 3 — Vínculo de Tutor */}
      <Section title="Vínculo com Tutor" icon="👤">
        <p style={S.hint}>Peça o <strong>User ID</strong> do seu tutor (encontrado em Minha Conta dele) e cole abaixo. Isso libera acesso a materiais e homework personalizados.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <input
            style={S.input}
            value={tutorInput}
            onChange={e => { setTutorInput(e.target.value); setTutorSaved(false); setTutorError('') }}
            placeholder="Cole o User ID do tutor aqui..."
            spellCheck={false}
          />
          <button style={S.saveBtn} onClick={saveTutor} disabled={!tutorInput.trim()}>
            Vincular
          </button>
        </div>
        {tutorSaved  && <p style={S.successMsg}>✓ Tutor vinculado com sucesso!</p>}
        {tutorError  && <p style={S.errorMsg}>{tutorError}</p>}
        {settings.tutorId && !tutorSaved && (
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
            Tutor atual: <code>{settings.tutorId.slice(0, 16)}...</code>
          </p>
        )}
      </Section>

      {/* 4 — Tema */}
      <Section title="Aparência" icon="🎨">
        <div style={S.row}>
          <span style={S.rowLabel}>{settings.darkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
          <button
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
            style={{ ...S.toggle, background: settings.darkMode ? '#4F46E5' : '#E2E8F0' }}
          >
            <span style={{
              ...S.toggleDot,
              transform: settings.darkMode ? 'translateX(22px)' : 'translateX(2px)',
              background: 'white',
            }} />
          </button>
        </div>
        <p style={S.hint}>{settings.darkMode ? 'Modo escuro ativo — ideal para estudar à noite.' : 'Modo claro ativo — padrão do sistema.'}</p>
      </Section>

      {/* ID do usuário (para compartilhar com tutor) */}
      <Section title="Seu User ID" icon="🔑">
        <p style={S.hint}>Compartilhe este ID com seu aluno para que ele possa se vincular a você.</p>
        <code style={S.idBox}>{user?.id}</code>
      </Section>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardIcon}>{icon}</span>
        <h3 style={S.cardTitle}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  pageTitle: { fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.3px' },
  pageDesc: { fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px', marginBottom: 16 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 },
  cardIcon: { fontSize: 18 },
  cardTitle: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  rowLabel: { fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 },
  hint: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 },
  range: { width: '100%', accentColor: '#4F46E5', cursor: 'pointer' },
  rangeLabels: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 },
  timerRow: { display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border)' },
  timerInputWrap: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  timerInput: { width: 72, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg)', textAlign: 'center' },
  input: { flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg)', outline: 'none' },
  saveBtn: { padding: '10px 18px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13 },
  successMsg: { fontSize: 13, color: '#22C55E', fontWeight: 600, marginTop: 8 },
  errorMsg: { fontSize: 13, color: '#EF4444', marginTop: 8 },
  toggle: { position: 'relative', width: 46, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', transition: 'background 0.25s', flexShrink: 0, padding: 0 },
  toggleDot: { position: 'absolute', top: 2, width: 22, height: 22, borderRadius: '50%', transition: 'transform 0.25s', display: 'block' },
  idBox: { display: 'block', marginTop: 8, padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)', wordBreak: 'break-all', lineHeight: 1.6 },
}
