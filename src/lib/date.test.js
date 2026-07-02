import { describe, it, expect } from 'vitest'
import { localDay, daysBetween } from './date'

describe('localDay', () => {
  it('formats a Date as local YYYY-MM-DD', () => {
    expect(localDay(new Date(2026, 5, 15, 9, 30))).toBe('2026-06-15')
  })

  it('pads single-digit months and days', () => {
    expect(localDay(new Date(2026, 0, 3))).toBe('2026-01-03')
  })

  it('uses the local calendar day for late-evening times', () => {
    expect(localDay(new Date(2026, 5, 15, 23, 59))).toBe('2026-06-15')
  })

  it('accepts ISO strings', () => {
    const iso = new Date(2026, 5, 15, 20, 0).toISOString()
    expect(localDay(iso)).toBe('2026-06-15')
  })
})

describe('daysBetween', () => {
  it('returns 0 for the same day', () => {
    expect(daysBetween('2026-06-15', '2026-06-15')).toBe(0)
  })

  it('returns 1 for consecutive days', () => {
    expect(daysBetween('2026-06-16', '2026-06-15')).toBe(1)
  })

  it('is negative when the first day is earlier', () => {
    expect(daysBetween('2026-06-15', '2026-06-20')).toBe(-5)
  })

  it('is exact across a US DST spring-forward boundary', () => {
    expect(daysBetween('2026-03-09', '2026-03-06')).toBe(3)
  })

  it('is exact across a US DST fall-back boundary', () => {
    expect(daysBetween('2026-11-02', '2026-10-31')).toBe(2)
  })

  it('spans month and year boundaries', () => {
    expect(daysBetween('2027-01-01', '2026-12-31')).toBe(1)
  })
})
