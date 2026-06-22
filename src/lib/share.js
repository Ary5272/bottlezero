export async function shareContent({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return 'shared'
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}${url ? ' ' + url : ''}`.trim())
    return 'copied'
  } catch {
    return 'failed'
  }
}

export function impactMessage(impact) {
  return `I've saved ${impact.bottles} plastic bottles with BottleZero — that's ${impact.plasticKg}kg of plastic and ${impact.co2Kg}kg of CO₂ kept out of the environment! 🌍💧 Join me:`
}
