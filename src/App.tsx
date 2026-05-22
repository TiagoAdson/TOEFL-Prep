import { useState, useEffect } from 'react'
import './App.css'

interface SkillData {
  label: string
  icon: string
  completed: number
  total: number
  percentage: number
}

function App() {
  const [timeLeft, setTimeLeft] = useState(3600)
  const [timerRunning, setTimerRunning] = useState(false)
  const generalProgress = 28

  const skills: SkillData[] = [
    { label: 'Reading', icon: '📖', completed: 4, total: 12, percentage: 33 },
    { label: 'Listening', icon: '🎧', completed: 2, total: 18, percentage: 28 },
    { label: 'Speaking', icon: '🎤', completed: 1, total: 8, percentage: 12 },
    { label: 'Writing', icon: '✍️', completed: 7, total: 18, percentage: 39 },
  ]

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>TOEFL Prep</h1>
      </header>

      <main className="app-main">
        <section className="study-session">
          <div className="session-header">
            <h2>Sua sessão de estudo</h2>
            <p>Mantenha o foco. Cada minuto conta.</p>
          </div>

          <div className="timer-section">
            <div className="timer">
              <span className="timer-display">{formatTime(timeLeft)}</span>
              <button
                className="timer-btn-play"
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? '⏸' : '▶'}
              </button>
              <button
                className="timer-btn-reset"
                onClick={() => { setTimeLeft(3600); setTimerRunning(false); }}
              >
                ↻
              </button>
            </div>
          </div>

          <div className="progress-section">
            <label className="progress-label">Progresso Geral</label>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${generalProgress}%` }}></div>
            </div>
            <span className="progress-percentage">{generalProgress}%</span>
          </div>

          <div className="skills-grid">
            {skills.map((skill) => (
              <div key={skill.label} className="skill-card">
                <div className="skill-header">
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-count">
                    {skill.completed}/{skill.total}
                  </span>
                </div>
                <h3 className="skill-label">{skill.label}</h3>
                <p className="skill-tasks">{skill.total} tarefas restantes</p>
                <div className="skill-progress-bar">
                  <div
                    className="skill-progress"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
                <span className="skill-percentage">{skill.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary">Iniciar Simulado</button>
            <button className="btn btn-secondary">Gravar Áudio</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
