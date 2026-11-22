import { describe, it, expect } from 'vitest'
import { checkBadges, BADGES } from './badges'

describe('checkBadges', () => {
  it('unlocks nothing with no activity', () => {
    const badges = checkBadges(0, 0, 0)
    expect(badges.every(b => !b.unlocked)).toBe(true)
  })

  it('unlocks First Drop at exactly one bottle', () => {
    const badges = checkBadges(1, 0, 0)
    expect(badges.find(b => b.key === 'first_drop').unlocked).toBe(true)
    expect(badges.find(b => b.key === 'hydrated').unlocked).toBe(false)
  })

  it('tracks streak badges from the current streak', () => {
    const badges = checkBadges(0, 7, 0)
    expect(badges.find(b => b.key === 'streak_3').unlocked).toBe(true)
    expect(badges.find(b => b.key === 'streak_7').unlocked).toBe(true)
    expect(badges.find(b => b.key === 'streak_14').unlocked).toBe(false)
  })

  it('tracks goal badges from days the goal was met', () => {
    const badges = checkBadges(0, 0, 7)
    expect(badges.find(b => b.key === 'goal_1').unlocked).toBe(true)
    expect(badges.find(b => b.key === 'goal_7').unlocked).toBe(true)
    expect(badges.find(b => b.key === 'goal_30').unlocked).toBe(false)
  })

  it('caps progress at 1 and floors it at partial completion', () => {
    const badges = checkBadges(5, 0, 0)
    expect(badges.find(b => b.key === 'hydrated').progress).toBe(0.5)
    expect(badges.find(b => b.key === 'first_drop').progress).toBe(1)
  })

  it('returns every defined badge', () => {
    expect(checkBadges(0, 0, 0)).toHaveLength(BADGES.length)
  })

  it('gives every badge a unique key', () => {
    expect(new Set(BADGES.map(b => b.key)).size).toBe(BADGES.length)
  })

  it('keeps thresholds increasing within each badge type', () => {
    for (const type of new Set(BADGES.map(b => b.type))) {
      const thresholds = BADGES.filter(b => b.type === type).map(b => b.threshold)
      expect(thresholds).toEqual([...thresholds].sort((a, b) => a - b))
      expect(new Set(thresholds).size).toBe(thresholds.length)
    }
  })

  it('unlocks the new top-tier badges only at their thresholds', () => {
    expect(checkBadges(999, 59, 99).filter(b => ['planet_saver', 'streak_60', 'goal_100'].includes(b.key)).every(b => !b.unlocked)).toBe(true)
    expect(checkBadges(1000, 60, 100).filter(b => ['planet_saver', 'streak_60', 'goal_100'].includes(b.key)).every(b => b.unlocked)).toBe(true)
  })
})
