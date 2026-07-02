import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { calcStreak, countDaysGoalMet } from './streak'

function daysAgo(n, hour = 10) {
  const d = new Date(2026, 5, 15, hour)
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function log(daysBack, count = 1) {
  return { id: String(Math.random()), count, source: 'home', timestamp: daysAgo(daysBack) }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 5, 15, 12, 0))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('calcStreak', () => {
  it('is zero with no logs', () => {
    expect(calcStreak([])).toEqual({ current: 0, longest: 0 })
  })

  it('counts a single log today as a 1-day streak', () => {
    expect(calcStreak([log(0)]).current).toBe(1)
  })

  it('keeps the streak alive if the last log was yesterday', () => {
    const streak = calcStreak([log(1), log(2), log(3)])
    expect(streak.current).toBe(3)
  })

  it('resets the current streak after a missed day', () => {
    const streak = calcStreak([log(2), log(3), log(4)])
    expect(streak.current).toBe(0)
    expect(streak.longest).toBe(3)
  })

  it('does not double-count multiple logs on the same day', () => {
    const streak = calcStreak([log(0), log(0), log(1)])
    expect(streak.current).toBe(2)
  })

  it('remembers the longest run even when broken', () => {
    const streak = calcStreak([log(0), log(10), log(11), log(12), log(13), log(14)])
    expect(streak.current).toBe(1)
    expect(streak.longest).toBe(5)
  })

  it('bridges today back through consecutive days', () => {
    const streak = calcStreak([log(0), log(1), log(2), log(3), log(4), log(5), log(6)])
    expect(streak.current).toBe(7)
    expect(streak.longest).toBe(7)
  })
})

describe('countDaysGoalMet', () => {
  it('counts days whose total meets the goal', () => {
    const logs = [log(0, 3), log(0, 2), log(1, 4), log(2, 5)]
    expect(countDaysGoalMet(logs, 5)).toBe(2)
  })

  it('treats missing count as one bottle', () => {
    const logs = [
      { timestamp: daysAgo(0) },
      { timestamp: daysAgo(0) },
    ]
    expect(countDaysGoalMet(logs, 2)).toBe(1)
  })

  it('is zero when no day reaches the goal', () => {
    expect(countDaysGoalMet([log(0, 1)], 5)).toBe(0)
  })
})
