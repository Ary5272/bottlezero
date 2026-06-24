export function localDay(d = new Date()) {
  const dt = typeof d === 'string' ? new Date(d) : d
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function daysBetween(dayA, dayB) {
  const a = new Date(dayA + 'T12:00:00')
  const b = new Date(dayB + 'T12:00:00')
  return Math.round((a - b) / 86400000)
}
