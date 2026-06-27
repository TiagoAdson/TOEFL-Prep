import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

type Mode = 'signin' | 'signup'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Digite seu nome completo.'); setLoading(false); return }
      const err = await signUp(email, password, fullName)
      if (!err) {
        setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
        setLoading(false)
        return
      }
      setError(err)
    } else {
      const err = await signIn(email, password)
      if (err) setError(err)
    }

    setLoading(false)
  }

  function inputStyle(name: string): React.CSSProperties {
    return {
      width: '100%',
      height: '48px',
      padding: '0 16px',
      fontSize: '15px',
      fontFamily: 'inherit',
      fontWeight: 400,
      color: '#0F172A',
      background: '#FAFBFC',
      border: `1.5px solid ${focused === name ? '#4F46E5' : '#E2E8F0'}`,
      borderRadius: '10px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: focused === name ? '0 0 0 3px rgba(79,70,229,0.10)' : 'none',
    }
  }

  return (
    <div style={S.page}>
      {/* Background decoration */}
      <div style={S.blob1} />
      <div style={S.blob2} />

      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoWrap}>
          <span style={S.logoText}>Meu Inglês</span>
        </div>

        <h2 style={S.title}>
          {mode === 'signin' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p style={S.subtitle}>
          {mode === 'signin'
            ? 'Entre para continuar sua jornada rumo ao 110+'
            : 'Comece agora. É gratuito.'}
        </p>

        <form ref={formRef} onSubmit={handleSubmit} style={S.form}>
          {mode === 'signup' && (
            <div style={S.field}>
              <label style={S.label}>Nome completo</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Seu nome"
                style={inputStyle('name')}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                autoComplete="off"
                spellCheck={false}
                required
              />
            </div>
          )}

          <div style={S.field}>
            <label style={S.label}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={inputStyle('email')}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              autoComplete="email"
              required
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Senha</label>
            <div style={S.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle('password'), paddingRight: '48px' }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={S.eyeBtn}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div style={S.error}>{error}</div>}
          {success && <div style={S.successMsg}>{success}</div>}

          <button type="submit" disabled={loading} style={S.btn}>
            {loading ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div style={S.divider}><span style={S.dividerLine} /><span style={S.dividerText}>ou</span><span style={S.dividerLine} /></div>

        <div style={S.toggle}>
          {mode === 'signin' ? (
            <>Não tem conta?{' '}
              <button onClick={() => { setMode('signup'); setError(null) }} style={S.link}>
                Criar conta grátis
              </button>
            </>
          ) : (
            <>Já tem conta?{' '}
              <button onClick={() => { setMode('signin'); setError(null) }} style={S.link}>
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '8vh 20px 40px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'fixed',
    top: '-10vw',
    right: '-10vw',
    width: '40vw',
    height: '40vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed',
    bottom: '-8vw',
    left: '-8vw',
    width: '35vw',
    height: '35vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '24px',
    padding: '44px 40px 36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    marginBottom: '28px',
    textAlign: 'center',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: '-0.5px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#0F172A',
    letterSpacing: '-0.4px',
    marginBottom: '6px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: '28px',
    fontWeight: 400,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#475569',
    letterSpacing: '0.1px',
  },
  btn: {
    marginTop: '6px',
    height: '48px',
    padding: '0 24px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.5px',
    transition: 'background 0.18s, box-shadow 0.18s',
    boxShadow: '0 2px 12px rgba(79,70,229,0.30)',
  },
  error: {
    background: '#FFF1F2',
    border: '1px solid #FECDD3',
    color: '#BE123C',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 400,
  },
  successMsg: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#15803D',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  passwordWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'opacity 0.15s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#E2E8F0',
    display: 'block',
  },
  dividerText: {
    fontSize: '12px',
    color: '#94A3B8',
    fontWeight: 500,
  },
  toggle: {
    marginTop: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748B',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#4F46E5',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit',
    padding: 0,
  },
}
