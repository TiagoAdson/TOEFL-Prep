import { createContext, useContext, useEffect, useState } from 'react'

export interface TOEFLTimers {
  speaking: number   // seconds, official max = 45
  writing:  number   // seconds, official max = 1800 (30min)
  reading:  number   // seconds, official max = 900 (15min)
  listening: number  // seconds, official max = 600 (10min)
}

export interface AppSettings {
  metaGoal:    number      // weekly exercise goal, 30-150
  toeflTarget: number      // target TOEFL score, 60-120
  darkMode:    boolean
  timers:      TOEFLTimers
  tutorId:     string
}

const DEFAULTS: AppSettings = {
  metaGoal:    70,
  toeflTarget: 110,
  darkMode:    false,
  timers: { speaking: 45, writing: 1800, reading: 900, listening: 600 },
  tutorId: '',
}

const OFFICIAL: TOEFLTimers = { speaking: 45, writing: 1800, reading: 900, listening: 600 }

const STORAGE_KEY = 'meu-ingles-settings'

interface SettingsCtx {
  settings:     AppSettings
  updateSetting: <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => void
  updateTimer:   (key: keyof TOEFLTimers, val: number) => void
  officialTimes: TOEFLTimers
}

const Ctx = createContext<SettingsCtx | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return { ...DEFAULTS, ...JSON.parse(stored) }
    } catch {}
    return DEFAULTS
  })

  // Apply dark mode to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light')
  }, [settings.darkMode])

  function updateSetting<K extends keyof AppSettings>(key: K, val: AppSettings[K]) {
    setSettings(prev => {
      const next = { ...prev, [key]: val }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function updateTimer(key: keyof TOEFLTimers, val: number) {
    const clamped = Math.min(OFFICIAL[key], Math.max(10, val))
    setSettings(prev => {
      const next = { ...prev, timers: { ...prev.timers, [key]: clamped } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <Ctx.Provider value={{ settings, updateSetting, updateTimer, officialTimes: OFFICIAL }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
