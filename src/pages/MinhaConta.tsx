import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { supabase, supabaseConfigured } from '../utils/supabase'

function fmt(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}min${seconds % 60 ? ` ${seconds % 60}s` : ''}`
}

function fmtBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FREE_TIER_LIMIT_BYTES = 1024 * 1024 * 1024 // ~1GB, plano Free do Supabase

export default function MinhaConta() {
  const { user, profile } = useAuth()
  const { settings, updateSetting, updateTimer, officialTimes } = useSettings()
  const [tutorInput, setTutorInput] = useState(settings.tutorId)
  const [tutorSaved, setTutorSaved] = useState(false)
  const [tutorError, setTutorError] = useState('')

  const [audioFiles, setAudioFiles] = useState<{ name: string; size: number }[]>([])
  const [loadingStorage, setLoadingStorage] = useState(false)
  const [freeing, setFreeing] = useState(false)
  const [freedMsg, setFreedMsg] = useState('')

  const isAdmin = profile?.role === 'admin'
  const [modules, setModules] = useState<{ id: string; name: string }[]>([])
  const [expandContentId, setExpandContentId] = useState('')
  const [expandTarget, setExpandTarget] = useState(500)
  const [expanding, setExpanding] = useState(false)
  const [expandMsg, setExpandMsg] = useState('')

  const loadModules = useCallback(async () => {
    if (!isAdmin || !supabaseConfigured) return
    const { data } = await supabase.from('contents').select('id, name').order('order_number')
    setModules(data || [])
    if (data?.[0]) setExpandContentId(data[0].id)
  }, [isAdmin])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount, not a render-time state sync
  useEffect(() => { loadModules() }, [loadModules])

  async function expandModule() {
    if (!expandContentId) return
    setExpanding(true)
    setExpandMsg('')
    try {
      const { data, error } = await supabase.functions.invoke('expand-module', {
        body: { content_id: expandContentId, target_count: expandTarget },
      })
      if (error) {
        setExpandMsg(`✗ Erro: ${error.message}`)
      } else {
        setExpandMsg(`✓ ${data?.inserted ?? 0} exercícios novos adicionados a "${expandContentId}" (total agora: ${data?.total ?? '?'})`)
      }
    } catch (err) {
      setExpandMsg(`✗ Erro ao chamar a função: ${err instanceof Error ? err.message : 'desconhecido'}`)
    } finally {
      setExpanding(false)
    }
  }

  const loadStorageUsage = useCallback(async () => {
    if (!supabaseConfigured || !user) return
    setLoadingStorage(true)
    try {
      const { data } = await supabase.storage.from('speaking-audio').list(user.id, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
      })
      setAudioFiles((data || []).map(f => ({ name: f.name, size: f.metadata?.size ?? 0 })))
    } finally {
      setLoadingStorage(false)
    }
  }, [user])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount, not a render-time state sync
  useEffect(() => { loadStorageUsage() }, [loadStorageUsage])

  const totalBytes = audioFiles.reduce((sum, f) => sum + f.size, 0)
  const usagePct = Math.min(100, (totalBytes / FREE_TIER_LIMIT_BYTES) * 100)

  async function freeSpace() {
    if (!user || audioFiles.length === 0) return
    setFreeing(true)
    setFreedMsg('')
    try {
      // Apaga a metade mais antiga (nomes são prefixados por timestamp, então ordem alfabética = ordem cronológica)
      const toDelete = audioFiles.slice(0, Math.ceil(audioFiles.length / 2))
      const paths = toDelete.map(f => `${user.id}/${f.name}`)

      const { error } = await supabase.storage.from('speaking-audio').remove(paths)
      if (!error) {
        // Mantém a transcrição/nota no histórico — só remove a referência ao áudio bruto
        await supabase.from('speaking_history')
          .update({ audio_path: null, audio_size_bytes: null })
          .eq('user_id', user.id)
          .in('audio_path', paths)

        const freedBytes = toDelete.reduce((sum, f) => sum + f.size, 0)
        setFreedMsg(`✓ ${fmtBytes(freedBytes)} liberados (${toDelete.length} áudios). As transcrições continuam salvas.`)
        loadStorageUsage()
      }
    } finally {
      setFreeing(false)
    }
  }

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

      {/* 0 — Meta de Nota TOEFL */}
      <Section title="Meta de Nota no TOEFL" icon="🏆">
        <div style={S.row}>
          <span style={S.rowLabel}>Sua meta de pontuação</span>
          <strong style={{ color: '#4F46E5', fontSize: 22, fontWeight: 700 }}>{settings.toeflTarget}</strong>
        </div>
        <input
          type="range"
          min={60} max={120} step={5}
          value={settings.toeflTarget}
          onChange={e => updateSetting('toeflTarget', Number(e.target.value))}
          style={S.range}
        />
        <div style={S.rangeLabels}>
          <span>60</span>
          <span style={{ color: '#94A3B8', fontSize: 12 }}>Padrão: 110</span>
          <span>120</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          {[79, 90, 100, 110, 120].map(score => (
            <button
              key={score}
              onClick={() => updateSetting('toeflTarget', score)}
              style={{
                ...S.presetBtn,
                background: settings.toeflTarget === score ? '#4F46E5' : 'var(--bg)',
                color:      settings.toeflTarget === score ? 'white'   : 'var(--text-secondary)',
                border:     `1px solid ${settings.toeflTarget === score ? '#4F46E5' : 'var(--border)'}`,
                fontWeight: settings.toeflTarget === score ? 700 : 500,
              }}
            >
              {score}
            </button>
          ))}
        </div>
        <p style={{ ...S.hint, marginTop: 10 }}>
          {settings.toeflTarget >= 110
            ? 'Meta excelente! Apto para programas altamente competitivos.'
            : settings.toeflTarget >= 100
            ? 'Meta forte. Atende à maioria dos programas de pós-graduação.'
            : settings.toeflTarget >= 90
            ? 'Meta sólida. Suficiente para a maioria das universidades americanas.'
            : 'Meta inicial. Vá aumentando conforme avança nos módulos.'}
        </p>
      </Section>

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

      {/* 1.5 — Sessão Diária de Exercícios */}
      <Section title="Sessão Diária de Exercícios" icon="📝">
        <p style={S.hint}>Defina quantos exercícios você quer fazer por dia em cada categoria.</p>
        <div style={S.row}>
          <span style={S.rowLabel}>Exercícios objetivos (gramática — múltipla escolha / completar)</span>
          <input
            type="number"
            min={1}
            max={100}
            value={settings.dailyObjectiveCount}
            onChange={e => updateSetting('dailyObjectiveCount', Math.max(1, Number(e.target.value) || 1))}
            style={S.timerInput}
          />
        </div>
        <div style={{ ...S.row, marginBottom: 0 }}>
          <span style={S.rowLabel}>Exercícios por habilidade (Reading, Listening, Speaking e Writing — cada uma)</span>
          <input
            type="number"
            min={1}
            max={50}
            value={settings.skillsBatchSize}
            onChange={e => updateSetting('skillsBatchSize', Math.max(1, Number(e.target.value) || 1))}
            style={S.timerInput}
          />
        </div>
        <p style={{ ...S.hint, marginTop: 10, marginBottom: 0 }}>
          Total por sessão: <strong style={{ color: '#4F46E5' }}>{settings.dailyObjectiveCount + settings.skillsBatchSize * 4}</strong> exercícios
          ({settings.dailyObjectiveCount} objetivos + {settings.skillsBatchSize} de cada uma das 4 habilidades TOEFL).
          Quando você terminar os {settings.skillsBatchSize} de uma habilidade, o app carrega mais {settings.skillsBatchSize} dela automaticamente — dá pra continuar praticando sem parar.
        </p>
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

      {/* 3.5 — Armazenamento de Áudio (Speaking) */}
      <Section title="Armazenamento de Áudio" icon="🎙️">
        <p style={S.hint}>
          Suas gravações de Speaking ficam salvas para a IA comparar sua evolução ao longo do tempo.
          O plano gratuito do Supabase tem ~1GB de espaço.
        </p>
        {loadingStorage ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Carregando uso de armazenamento...</p>
        ) : (
          <>
            <div style={S.row}>
              <span style={S.rowLabel}>{fmtBytes(totalBytes)} usados · {audioFiles.length} gravações</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>~1 GB disponível</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{
                height: '100%', width: `${usagePct}%`, borderRadius: 999,
                background: usagePct > 85 ? '#EF4444' : usagePct > 60 ? '#F59E0B' : '#22C55E',
                transition: 'width 0.4s',
              }} />
            </div>
            <button
              style={{ ...S.saveBtn, marginTop: 14, background: audioFiles.length === 0 ? '#94A3B8' : '#EF4444' }}
              onClick={freeSpace}
              disabled={freeing || audioFiles.length === 0}
            >
              {freeing ? 'Liberando...' : 'Liberar espaço (apaga os áudios mais antigos)'}
            </button>
            <p style={{ ...S.hint, marginTop: 8, marginBottom: 0 }}>
              Isso apaga só o áudio bruto — a transcrição, nota e apontamentos continuam salvos no seu histórico.
            </p>
            {freedMsg && <p style={S.successMsg}>{freedMsg}</p>}
          </>
        )}
      </Section>

      {/* 3.6 — Admin: expandir módulo (300 -> 500) */}
      {isAdmin && (
        <Section title="Admin — Expandir Módulo" icon="🛠️">
          <p style={S.hint}>Gera exercícios novos via IA para um módulo, até a quantidade escolhida (padrão: 500).</p>
          <div style={S.row}>
            <span style={S.rowLabel}>Módulo</span>
            <select
              value={expandContentId}
              onChange={e => setExpandContentId(e.target.value)}
              style={{ ...S.timerInput, width: 220, textAlign: 'left' }}
            >
              {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div style={{ ...S.row, marginBottom: 0 }}>
            <span style={S.rowLabel}>Total desejado de exercícios</span>
            <input
              type="number"
              min={1}
              max={2000}
              value={expandTarget}
              onChange={e => setExpandTarget(Math.max(1, Number(e.target.value) || 1))}
              style={S.timerInput}
            />
          </div>
          <button
            style={{ ...S.saveBtn, marginTop: 14, background: !expandContentId ? '#94A3B8' : '#4F46E5' }}
            onClick={expandModule}
            disabled={expanding || !expandContentId}
          >
            {expanding ? 'Gerando exercícios...' : `Expandir para ${expandTarget}`}
          </button>
          {expandMsg && <p style={expandMsg.startsWith('✓') ? S.successMsg : S.errorMsg}>{expandMsg}</p>}
        </Section>
      )}

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
  presetBtn: { padding: '6px 16px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, transition: 'all 0.15s' },
}
