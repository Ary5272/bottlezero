import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { useToast } from '../state/ToastContext'
import { haptic } from '../lib/motion'
import Icon from './Icon'

export default function BottleButton({ source = 'home' }) {
  const { logBottle, removeLog, todayCount, profile } = useApp()
  const { toast } = useToast()
  const [pop, setPop] = useState(false)
  const [ripples, setRipples] = useState([])

  const pct = Math.min(todayCount / profile.dailyGoal, 1)
  const goalMet = todayCount >= profile.dailyGoal
  const R = 54
  const C = 2 * Math.PI * R

  async function handleLog() {
    haptic(14)
    setPop(true)
    setTimeout(() => setPop(false), 350)
    const rid = Date.now()
    setRipples(r => [...r, rid])
    setTimeout(() => setRipples(r => r.filter(x => x !== rid)), 700)

    const id = await logBottle(1, source)
    toast('Logged 1 bottle', {
      icon: 'droplet',
      actionLabel: 'Undo',
      onAction: () => removeLog(id),
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-44 h-44 hero-glow">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90 relative z-10">
          <circle cx="64" cy="64" r={R} fill="none" stroke="var(--c-line)" strokeWidth="6" />
          <circle
            cx="64" cy="64" r={R} fill="none"
            stroke="var(--c-accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${pct * C} ${C}`}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {ripples.map(id => (
          <span key={id} className="absolute inset-6 rounded-full border-2 border-accent/50 ripple-ring z-10" />
        ))}

        <button
          onClick={handleLog}
          aria-label="Log a saved bottle"
          style={{
            background: 'linear-gradient(155deg, color-mix(in srgb, var(--c-accent) 92%, white), var(--c-accent-dark))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 6px rgba(0,0,0,0.12), 0 14px 30px -12px color-mix(in srgb, var(--c-accent) 70%, transparent)',
          }}
          className={`absolute inset-6 z-10 rounded-full text-white flex flex-col items-center justify-center
            hover:brightness-[1.04] active:scale-[0.96] transition-[transform,filter] duration-150 cursor-pointer
            ${pop ? 'btn-pop' : ''}`}
        >
          <Icon name="plus" size={24} stroke={2.6} />
          <span className="text-[10px] font-semibold mt-1 tracking-[0.14em] text-white/90">LOG BOTTLE</span>
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-bold text-ink text-base tabular-nums">{todayCount}</span>
          <span className="text-faint"> of {profile.dailyGoal} today</span>
        </p>
        {goalMet && (
          <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-accent">
            <Icon name="check" size={13} stroke={2.4} /> Daily goal reached
          </span>
        )}
      </div>
    </div>
  )
}
