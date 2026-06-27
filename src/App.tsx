import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import TestOfConcept from './pages/TestOfConcept'
import Exercise from './pages/Exercise'
import Simulado from './pages/Simulado'
import DiarioErros from './pages/DiarioErros'
import TutorHumano from './pages/TutorHumano'
import MinhaConta from './pages/MinhaConta'
import './App.css'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={S.shell}>
      <Sidebar />
      <main style={S.main}>
        <div style={S.content}>{children}</div>
      </main>
    </div>
  )
}

function AppRoutes() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 14 }}>
        Carregando...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/simulado" element={<ProtectedRoute><AppLayout><Simulado /></AppLayout></ProtectedRoute>} />
      <Route path="/diario-erros" element={<ProtectedRoute><AppLayout><DiarioErros /></AppLayout></ProtectedRoute>} />
      <Route path="/tutor-humano" element={<ProtectedRoute><AppLayout><TutorHumano /></AppLayout></ProtectedRoute>} />
      <Route path="/minha-conta" element={<ProtectedRoute><AppLayout><MinhaConta /></AppLayout></ProtectedRoute>} />
      <Route path="/test-of-concept/:contentId" element={<ProtectedRoute><AppLayout><TestOfConcept /></AppLayout></ProtectedRoute>} />
      <Route path="/exercise/:contentId/:block" element={<ProtectedRoute><AppLayout><Exercise /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

const S: Record<string, React.CSSProperties> = {
  shell: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  main: { flex: 1, minWidth: 0, overflowY: 'auto' },
  content: { maxWidth: '820px', margin: '0 auto', padding: '36px 28px' },
}
