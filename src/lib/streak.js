import { localDay, daysBetween } from './date'

export function calcStreak(logs) {
  if (logs.length === 0) return { current: 0, longest: 0 }

  const days = new Set(logs.map(l => localDay(l.timestamp)))
  const sorted = [...days].sort().reverse()

  const today = localDay()
  const yesterday = localDay(new Date(Date.now() - 86400000))

  if (!days.has(today) && !days.has(yesterday)) return { current: 0, longest: calcLongest(sorted) }

  let current = 0
  let cursor = days.has(today) ? new Date() : new Date(Date.now() - 86400000)

  while (days.has(localDay(cursor))) {
    current++
    cursor = new Date(cursor.getTime() - 86400000)
  }

  return { current, longest: Math.max(current, calcLongest(sorted)) }
}

export function calcLongest(sortedDays) {
  let longest = 0
  let run = 1
  for (let i = 1; i < sortedDays.length; i++) {
    if (daysBetween(sortedDays[i - 1], sortedDays[i]) === 1) {
      run++
    } else {
      longest = Math.max(longest, run)
      run = 1
    }
  }
  return Math.max(longest, run)
}

export function countDaysGoalMet(logs, dailyGoal) {
  const counts = {}
  for (const log of logs) {
    const day = localDay(log.timestamp)
    counts[day] = (counts[day] || 0) + (log.count || 1)
  }
  return Object.values(counts).filter(c => c >= dailyGoal).length
}
