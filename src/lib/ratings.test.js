import { describe, it, expect } from 'vitest'
import { summarize, isRateable } from './ratings'

function row(overrides) {
  return {
    ratings: 0, works_yes: 0, works_no: 0, drink_yes: 0, drink_no: 0,
    latest_works: true, last_rated: '2026-11-02T15:00:00Z',
    ...overrides,
  }
}

describe('summarize', () => {
  it('reports no ratings when a fountain has no summary', () => {
    expect(summarize(undefined)).toEqual({ status: 'unrated', label: 'No ratings yet', count: 0, lastRated: null })
  })

  it('reports no ratings when the count is zero', () => {
    expect(summarize(row({ ratings: 0 })).status).toBe('unrated')
  })

  it('shows broken when the latest rating says it does not work', () => {
    expect(summarize(row({ ratings: 3, works_yes: 2, works_no: 1, latest_works: false })))
      .toMatchObject({ status: 'broken', label: 'Reported broken', count: 3 })
  })

  it('trusts the latest rating once a broken fountain is fixed', () => {
    expect(summarize(row({ ratings: 3, works_yes: 1, works_no: 2, latest_works: true })).status).toBe('works')
  })

  it('says it works when nobody has said whether they would drink from it', () => {
    expect(summarize(row({ ratings: 2, works_yes: 2 }))).toMatchObject({ status: 'works', label: 'Works' })
  })

  it('flags it as gross when most people would not drink from it', () => {
    expect(summarize(row({ ratings: 3, works_yes: 3, drink_yes: 1, drink_no: 2 })))
      .toMatchObject({ status: 'gross', label: "Works, but most say it's gross" })
  })

  it('counts how many people would drink from it', () => {
    expect(summarize(row({ ratings: 4, works_yes: 4, drink_yes: 3, drink_no: 1 })))
      .toMatchObject({ status: 'good', label: 'Works · 3 of 4 would drink from it' })
  })

  it('treats a tie as drinkable', () => {
    expect(summarize(row({ ratings: 2, works_yes: 2, drink_yes: 1, drink_no: 1 })).status).toBe('good')
  })

  it('reads counts that arrive as strings', () => {
    expect(summarize(row({ ratings: '2', works_yes: '2', drink_yes: '2' })).label).toBe('Works · 2 of 2 would drink from it')
  })

  it('parses when it was last rated', () => {
    expect(summarize(row({ ratings: 1, works_yes: 1 })).lastRated).toEqual(new Date('2026-11-02T15:00:00Z'))
  })
})

describe('isRateable', () => {
  it('allows fountains and refill stations from OpenStreetMap and the seed list', () => {
    expect(isRateable({ id: 'osm_123456', type: 'fountain' })).toBe(true)
    expect(isRateable({ id: 'seed_2', type: 'refill_station' })).toBe(true)
  })

  it('rejects cafes, stores and partner spots', () => {
    expect(isRateable({ id: 'seed_5', type: 'cafe' })).toBe(false)
    expect(isRateable({ id: 'seed_6', type: 'store' })).toBe(false)
    expect(isRateable({ id: 'partner_1', type: 'partner' })).toBe(false)
  })

  it('rejects ids the database would refuse', () => {
    expect(isRateable({ id: 'partner_1', type: 'fountain' })).toBe(false)
    expect(isRateable({ id: 'osm_abc', type: 'fountain' })).toBe(false)
  })
})
