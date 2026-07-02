import { describe, it, expect } from 'vitest'
import { calcImpact } from './impact'

describe('calcImpact', () => {
  it('returns all zeros for zero bottles', () => {
    expect(calcImpact(0)).toEqual({
      bottles: 0,
      plasticKg: 0,
      co2Kg: 0,
      moneySaved: 0,
      waterLiters: 0,
    })
  })

  it('computes the documented equivalences for 100 bottles', () => {
    expect(calcImpact(100)).toEqual({
      bottles: 100,
      plasticKg: 1.27,
      co2Kg: 8.3,
      moneySaved: 129,
      waterLiters: 50,
    })
  })

  it('rounds to sensible precision for odd counts', () => {
    const impact = calcImpact(7)
    expect(impact.plasticKg).toBe(0.09)
    expect(impact.co2Kg).toBe(0.58)
    expect(impact.moneySaved).toBe(9.03)
  })

  it('scales linearly into the thousands', () => {
    expect(calcImpact(1000).plasticKg).toBe(12.7)
    expect(calcImpact(1000).moneySaved).toBe(1290)
  })
})
