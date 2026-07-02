import { describe, it, expect } from 'vitest'
import { calcPoints, getLevel, getRewards, getPerkState, LEVELS } from './rewards'

describe('calcPoints', () => {
  it('sums bottles, badges, and goal days at documented rates', () => {
    expect(calcPoints(10, 2, 3)).toBe(10 * 10 + 2 * 50 + 3 * 15)
  })

  it('is zero with no activity', () => {
    expect(calcPoints(0, 0, 0)).toBe(0)
  })
})

describe('getLevel', () => {
  it('starts at Seedling', () => {
    const lvl = getLevel(0)
    expect(lvl.name).toBe('Seedling')
    expect(lvl.levelNumber).toBe(1)
  })

  it('stays Seedling one point below the Sprout threshold', () => {
    expect(getLevel(249).name).toBe('Seedling')
  })

  it('promotes exactly at each threshold', () => {
    for (const [i, level] of LEVELS.entries()) {
      const got = getLevel(level.min)
      expect(got.name).toBe(level.name)
      expect(got.levelNumber).toBe(i + 1)
    }
  })

  it('reports progress toward the next level', () => {
    const lvl = getLevel(475)
    expect(lvl.name).toBe('Sprout')
    expect(lvl.progress).toBeCloseTo((475 - 250) / (700 - 250))
    expect(lvl.pointsToNext).toBe(225)
  })

  it('caps at Guardian with full progress', () => {
    const lvl = getLevel(999999)
    expect(lvl.name).toBe('Guardian')
    expect(lvl.next).toBeNull()
    expect(lvl.progress).toBe(1)
    expect(lvl.pointsToNext).toBe(0)
  })
})

describe('getRewards', () => {
  it('combines points and level', () => {
    const { points, level } = getRewards(100, 5, 10)
    expect(points).toBe(1400)
    expect(level.name).toBe('Sapling')
  })
})

describe('getPerkState', () => {
  it('grants nothing visual at level 1', () => {
    expect(getPerkState(1)).toEqual({
      sproutFrame: false,
      goldenButton: false,
      leaderboardFlair: false,
      title: null,
    })
  })

  it('unlocks the sprout frame at level 2', () => {
    expect(getPerkState(2).sproutFrame).toBe(true)
    expect(getPerkState(2).goldenButton).toBe(false)
  })

  it('unlocks the golden button at level 4', () => {
    expect(getPerkState(3).goldenButton).toBe(false)
    expect(getPerkState(4).goldenButton).toBe(true)
  })

  it('unlocks leaderboard flair at level 5', () => {
    expect(getPerkState(5).leaderboardFlair).toBe(true)
  })

  it('grants Forest Founder at level 6 and Guardian at level 7', () => {
    expect(getPerkState(5).title).toBeNull()
    expect(getPerkState(6).title).toBe('Forest Founder')
    expect(getPerkState(7).title).toBe('Guardian')
  })
})
