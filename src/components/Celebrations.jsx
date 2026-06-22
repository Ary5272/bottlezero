import { useEffect, useRef } from 'react'
import { useApp } from '../state/AppContext'
import { useToast } from '../state/ToastContext'
import { getRewards } from '../lib/rewards'
import { confettiBurst } from '../lib/confetti'

export default function Celebrations() {
  const { totalBottles, badges, daysGoalMet, todayCount, profile, cloud, syncing } = useApp()
  const { toast } = useToast()

  const unlocked = badges.filter(b => b.unlocked)
  const { level } = getRewards(totalBottles, unlocked.length, daysGoalMet)

  const ready = useRef(false)
  const ctxKey = useRef(null)
  const prev = useRef({ badgeKeys: new Set(), levelNum: 0, goalMet: false })

  useEffect(() => {
    if (syncing) return

    if (!ready.current || ctxKey.current !== `${cloud}`) {
      ctxKey.current = `${cloud}`
      prev.current = {
        badgeKeys: new Set(unlocked.map(b => b.key)),
        levelNum: level.levelNumber,
        goalMet: todayCount >= profile.dailyGoal,
      }
      ready.current = true
      return
    }

    for (const b of unlocked) {
      if (!prev.current.badgeKeys.has(b.key)) {
        toast(`Badge unlocked: ${b.name}`, { icon: 'trophy' })
      }
    }

    if (level.levelNumber > prev.current.levelNum) {
      toast(`Level up! You're now a ${level.name}`, { icon: 'sparkle' })
      confettiBurst()
    }

    const goalMet = todayCount >= profile.dailyGoal
    if (goalMet && !prev.current.goalMet) {
      toast('Daily goal reached! 🌱', { icon: 'target' })
      confettiBurst()
    }

    prev.current = {
      badgeKeys: new Set(unlocked.map(b => b.key)),
      levelNum: level.levelNumber,
      goalMet,
    }
  }, [totalBottles, daysGoalMet, todayCount, level.levelNumber, cloud, syncing, level.name, profile.dailyGoal, unlocked, toast])

  return null
}
