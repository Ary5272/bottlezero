import { reducedMotion } from './motion'

const COLORS = ['#0e9f6e', '#52b788', '#2f93cf', '#e9c46a', '#0a7d57']

export function confettiBurst() {
  if (reducedMotion()) return

  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const cx = canvas.width / 2
  const cy = canvas.height * 0.35
  const particles = Array.from({ length: 90 }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 7
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 5 + Math.random() * 6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
    }
  })

  let raf
  const start = performance.now()
  function frame(now) {
    const elapsed = now - start
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const p of particles) {
      p.vy += 0.22
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      p.life = Math.max(0, 1 - elapsed / 1500)
      ctx.save()
      ctx.globalAlpha = p.life
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    }
    if (elapsed < 1500) {
      raf = requestAnimationFrame(frame)
    } else {
      cancelAnimationFrame(raf)
      canvas.remove()
    }
  }
  raf = requestAnimationFrame(frame)
}
