import { localDay } from './date'

const DROP = 'M0 -12 C 7 -2, 9 4, 0 12 C -9 4, -7 -2, 0 -12 Z'

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function fitFont(ctx, text, weight, max, maxWidth) {
  let size = max
  do {
    ctx.font = `${weight} ${size}px Inter, "Segoe UI", sans-serif`
    if (ctx.measureText(text).width <= maxWidth) return size
    size -= 10
  } while (size > 60)
  return size
}

function drawCard({ bottles, plasticKg, co2Kg, moneySaved, streak }) {
  const S = 1080
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')

  const bg = ctx.createLinearGradient(0, 0, S, S)
  bg.addColorStop(0, '#10a873')
  bg.addColorStop(1, '#0a7f56')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, S, S)

  ctx.save()
  ctx.translate(880, 340)
  ctx.scale(22, 22)
  ctx.globalAlpha = 0.07
  ctx.fillStyle = '#ffffff'
  ctx.fill(new Path2D(DROP))
  ctx.restore()

  rr(ctx, 72, 72, 96, 96, 26)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.save()
  ctx.translate(120, 122)
  ctx.scale(2.9, 2.9)
  ctx.fillStyle = '#0e9f6e'
  ctx.fill(new Path2D(DROP))
  ctx.restore()

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 58px Inter, "Segoe UI", sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText('BottleZero', 196, 122)

  ctx.textAlign = 'center'
  ctx.globalAlpha = 0.85
  ctx.font = '600 36px Inter, "Segoe UI", sans-serif'
  ctx.fillText('SINGLE-USE BOTTLES AVOIDED', S / 2, 330)
  ctx.globalAlpha = 1

  const countText = Number(bottles).toLocaleString()
  const countSize = fitFont(ctx, countText, 800, 230, S - 160)
  ctx.font = `800 ${countSize}px Inter, "Segoe UI", sans-serif`
  ctx.fillText(countText, S / 2, 480)

  const stats = [
    [`${plasticKg} kg`, 'plastic avoided'],
    [`${co2Kg} kg`, 'CO₂ prevented'],
    [`$${moneySaved}`, 'money saved'],
  ]
  const pw = 288
  const gap = 24
  const startX = (S - (pw * 3 + gap * 2)) / 2
  stats.forEach(([value, label], i) => {
    const x = startX + i * (pw + gap)
    ctx.globalAlpha = 0.14
    rr(ctx, x, 620, pw, 150, 26)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.font = '700 46px Inter, "Segoe UI", sans-serif'
    ctx.fillText(value, x + pw / 2, 675)
    ctx.globalAlpha = 0.8
    ctx.font = '500 27px Inter, "Segoe UI", sans-serif'
    ctx.fillText(label, x + pw / 2, 730)
    ctx.globalAlpha = 1
  })

  if (streak > 1) {
    ctx.font = '600 36px Inter, "Segoe UI", sans-serif'
    ctx.fillText(`${streak}-day streak and counting`, S / 2, 850)
  }

  ctx.globalAlpha = 0.75
  ctx.font = '500 30px Inter, "Segoe UI", sans-serif'
  ctx.fillText('bottlezero.vercel.app', S / 2, 980)
  ctx.globalAlpha = 1

  return canvas
}

export async function shareImpactCard(stats) {
  try {
    if (document.fonts?.load) {
      await Promise.all([
        document.fonts.load('800 100px Inter'),
        document.fonts.load('600 36px Inter'),
      ]).catch(() => {})
    }
    const canvas = drawCard(stats)
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'))
    if (!blob) return 'failed'
    const file = new File([blob], `bottlezero-impact-${localDay()}.png`, { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'My BottleZero impact',
          text: `${stats.bottles} single-use bottles avoided with BottleZero 🌍`,
        })
        return 'shared'
      } catch (e) {
        if (e.name === 'AbortError') return 'cancelled'
      }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    return 'downloaded'
  } catch {
    return 'failed'
  }
}
