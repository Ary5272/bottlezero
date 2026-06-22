export function reducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function haptic(ms = 12) {
  try { navigator.vibrate?.(ms) } catch { void 0 }
}
