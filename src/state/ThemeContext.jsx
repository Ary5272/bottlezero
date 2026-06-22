import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

const ThemeContext = createContext()
const KEY = 'bottlezero_theme'
const THEME_COLORS = { light: '#f7f8f7', dark: '#0d1210' }

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

function apply(theme) {
  const dark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light)
  return dark
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(KEY) || 'system')
  const [isDark, setIsDark] = useState(() => apply(localStorage.getItem(KEY) || 'system'))

  const setTheme = useCallback((next) => {
    localStorage.setItem(KEY, next)
    setThemeState(next)
    setIsDark(apply(next))
  }, [])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setIsDark(apply('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const value = useMemo(() => ({ theme, isDark, setTheme }), [theme, isDark, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
