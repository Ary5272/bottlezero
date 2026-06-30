import { useEffect, useRef } from 'react'
import { useApp } from '../state/AppContext'
import { useReminders } from '../state/ReminderContext'
import { load, save } from '../lib/storage'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function HabitReminders() {
  const { todayCount, profile } = useApp()
  const { settings, permission, supported } = useReminders()
  const goal = profile.dailyGoal

  const ref = useRef({ todayCount, goal })
  useEffect(() => {
    ref.current = { todayCount, goal }
  })

  useEffect(() => {
    if (!('setAppBadge' in navigator)) return
    const remaining = Math.max(0, goal - todayCount)
    try {
      if (remaining > 0) navigator.setAppBadge(remaining)
      else navigator.clearAppBadge()
    } catch { void 0 }
  }, [todayCount, goal])

  useEffect(() => {
    if (!supported || !settings.enabled || permission !== 'granted') return

    function fire() {
      const { todayCount: tc, goal: g } = ref.current
      const remaining = g - tc
      if (remaining <= 0) return
      try {
        new Notification('BottleZero', {
          body: tc === 0
            ? "Don't forget to log your refills today 💧"
            : `${remaining} more to hit today's goal — keep your streak alive!`,
          icon: '/icons/icon-192.png',
          tag: 'bottlezero-daily',
        })
        save('reminder_last', todayStr())
      } catch { void 0 }
    }

    const [h, m] = settings.time.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(h, m, 0, 0)

    let catchUp, timer
    if (target > now) {
      timer = setTimeout(fire, target - now)
    } else if (load('reminder_last', '') !== todayStr() && (ref.current.goal - ref.current.todayCount) > 0) {
      catchUp = setTimeout(fire, 4000)
    }

    return () => { clearTimeout(catchUp); clearTimeout(timer) }
  }, [settings, permission, supported])

  return null
}
