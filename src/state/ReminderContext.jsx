import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { load, save } from '../lib/storage'

const ReminderContext = createContext()
const DEFAULTS = { enabled: false, time: '18:00' }

export function ReminderProvider({ children }) {
  const supported = typeof window !== 'undefined' && 'Notification' in window
  const [settings, setSettings] = useState(() => ({ ...DEFAULTS, ...load('reminder', {}) }))
  const [permission, setPermission] = useState(() => (supported ? Notification.permission : 'unsupported'))

  const persist = useCallback((next) => { setSettings(next); save('reminder', next) }, [])

  const requestPermission = useCallback(async () => {
    if (!supported) return 'unsupported'
    const p = await Notification.requestPermission()
    setPermission(p)
    return p
  }, [supported])

  const enable = useCallback(async () => {
    const p = await requestPermission()
    if (p === 'granted') persist({ ...settings, enabled: true })
    return p
  }, [requestPermission, persist, settings])

  const disable = useCallback(() => persist({ ...settings, enabled: false }), [persist, settings])
  const setTime = useCallback((time) => persist({ ...settings, time }), [persist, settings])

  const value = useMemo(
    () => ({ settings, permission, supported, enable, disable, setTime, requestPermission }),
    [settings, permission, supported, enable, disable, setTime, requestPermission]
  )

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>
}

export function useReminders() {
  const ctx = useContext(ReminderContext)
  if (!ctx) throw new Error('useReminders must be inside ReminderProvider')
  return ctx
}
