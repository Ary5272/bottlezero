export const PLASTIC_PER_BOTTLE_G = 12.7
export const CO2_PER_BOTTLE_KG = 0.083
export const COST_PER_BOTTLE_USD = 1.29
export const WATER_ML_PER_BOTTLE = 500

export function calcImpact(totalBottles) {
  return {
    bottles: totalBottles,
    plasticKg: +((totalBottles * PLASTIC_PER_BOTTLE_G) / 1000).toFixed(2),
    co2Kg: +(totalBottles * CO2_PER_BOTTLE_KG).toFixed(2),
    moneySaved: +(totalBottles * COST_PER_BOTTLE_USD).toFixed(2),
    waterLiters: +((totalBottles * WATER_ML_PER_BOTTLE) / 1000).toFixed(1),
  }
}
