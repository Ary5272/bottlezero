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
})
