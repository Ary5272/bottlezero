import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { useToast } from '../state/ToastContext'
import BottleButton from '../components/BottleButton'
import StatCard from '../components/StatCard'
import CommunityImpact from '../components/CommunityImpact'
import Icon from '../components/Icon'
import { haptic } from '../lib/motion'
import { shareContent, impactMessage } from '../lib/share'
import { shareImpactCard } from '../lib/shareCard'

const SOURCES = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'fountain', label: 'Fountain', icon: 'droplet' },
  { key: 'station', label: 'Station', icon: 'recycle' },
  { key: 'store', label: 'Store', icon: 'store' },
]

export default function Dashboard() {
  const { impact, streak, totalBottles, todayCount, cloud, syncing, logBottle, removeLog } = useApp()
  const { toast } = useToast()
  const [shareMsg, setShareMsg] = useState('')
  const [source, setSource] = useState('home')
  const [showMany, setShowMany] = useState(false)
  const [qty, setQty] = useState(2)

  async function logMany() {
    haptic(14)
    const id = await logBottle(qty, source)
    toast(`Logged ${qty} bottles`, { icon: 'droplet', actionLabel: 'Undo', onAction: () => removeLog(id) })
    setShowMany(false)
    setQty(2)
  }

  const nudge = totalBottles === 0
    ? { icon: 'sparkle', text: 'Tap the button to log your first saved bottle.' }
    : todayCount === 0
      ? { icon: 'flame', text: streak.current > 0
          ? `Don't break your ${streak.current}-day streak — log one today!`
          : "You haven't logged today. One tap keeps you going." }
      : null

  async function handleShare() {
    const result = await shareImpactCard({
      bottles: totalBottles,
      plasticKg: impact.plasticKg,
      co2Kg: impact.co2Kg,
      moneySaved: impact.moneySaved,
      streak: streak.current,
    })
    if (result === 'downloaded') {
      setShareMsg('Impact card saved!')
      setTimeout(() => setShareMsg(''), 2500)
      return
    }
    if (result === 'failed') {
      const fallback = await shareContent({
        title: 'My BottleZero Impact',
        text: impactMessage(impact),
        url: window.location.origin,
      })
      if (fallback === 'copied') {
        setShareMsg('Link copied')
        setTimeout(() => setShareMsg(''), 2000)
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-6">
      {nudge && (
        <div className="flex items-center gap-2.5 bg-accent-soft border border-accent/20 rounded-2xl px-4 py-3">
          <Icon name={nudge.icon} size={18} className="text-accent shrink-0" />
          <p className="text-[13px] font-medium text-ink">{nudge.text}</p>
        </div>
      )}

      <section className="relative overflow-hidden bg-surface rounded-3xl border border-line pt-8 pb-6 px-4 flex flex-col items-center gap-5 shadow-card">
        <BottleButton source={source} />
        <div className="flex items-center gap-1.5 bg-canvas rounded-full p-1 border border-line">
          {SOURCES.map(s => (
            <button
              key={s.key}
              onClick={() => setSource(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                source === s.key ? 'bg-accent text-white' : 'text-muted hover:text-ink'
              }`}
            >
              <Icon name={s.icon} size={14} stroke={2} />
              {s.label}
            </button>
          ))}
        </div>

        {!showMany ? (
          <button onClick={() => setShowMany(true)} className="text-[11px] text-faint hover:text-accent cursor-pointer">
            Log several at once
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-canvas border border-line rounded-full p-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" className="grid place-items-center w-7 h-7 rounded-full hover:bg-line text-ink cursor-pointer">
                <Icon name="minus" size={14} stroke={2.4} />
              </button>
              <span className="w-7 text-center text-sm font-bold text-ink tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Increase" className="grid place-items-center w-7 h-7 rounded-full hover:bg-line text-ink cursor-pointer">
                <Icon name="plus" size={14} stroke={2.4} />
              </button>
            </div>
            <button onClick={logMany} className="bg-accent text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-accent-dark cursor-pointer active:scale-95">
              Log {qty}
            </button>
            <button onClick={() => { setShowMany(false); setQty(2) }} className="text-xs text-faint hover:text-muted cursor-pointer px-1">
              Cancel
            </button>
          </div>
        )}

        <p className="text-[11px] text-faint flex items-center gap-1.5" aria-live="polite">
          <Icon name={syncing ? 'refresh' : cloud ? 'cloud' : 'check'} size={12} stroke={2.2} className={`text-accent ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing…' : cloud ? 'Synced to your account' : 'Saved on this device'}
          {!cloud && !syncing && <Link to="/auth" className="text-accent font-medium hover:underline">· Sign in to sync</Link>}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="bottle" label="bottles saved" value={totalBottles} accent />
        <StatCard icon="flame" label="day streak" value={streak.current} />
        <StatCard icon="leaf" label="plastic avoided" value={impact.plasticKg} unit="kg" />
        <StatCard icon="cloud" label="CO₂ prevented" value={impact.co2Kg} unit="kg" />
      </div>

      <CommunityImpact />

      <section className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-ink">Your impact</h2>
          <span className="text-xs font-medium text-accent tabular-nums">${impact.moneySaved} saved</span>
        </div>
        <p className="text-[13px] text-muted leading-relaxed">
          You've kept <strong className="text-ink font-semibold">{impact.plasticKg} kg</strong> of plastic out of
          landfills and avoided <strong className="text-ink font-semibold">{impact.co2Kg} kg</strong> of CO₂ —
          about <strong className="text-ink font-semibold">{(impact.co2Kg / 0.21).toFixed(1)} miles</strong> of driving.
        </p>
        <button
          onClick={handleShare}
          className="mt-3 w-full flex items-center justify-center gap-2 border border-line rounded-xl py-2.5 text-sm font-medium text-ink hover:bg-canvas transition-colors cursor-pointer"
        >
          <Icon name="share" size={16} />
          {shareMsg || 'Share my impact'}
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <HubLink to="/insights" icon="chart" title="Dashboard" desc="Trends & charts" />
        <HubLink to="/learn" icon="book" title="Learn" desc="Facts & tips" />
      </div>
    </div>
  )
}

function HubLink({ to, icon, title, desc }) {
  return (
    <Link to={to} className="bg-surface rounded-2xl border border-line p-4 flex items-center gap-3 shadow-soft hover:border-accent/40 hover:-translate-y-0.5 transition-all active:scale-[0.98]">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent shrink-0">
        <Icon name={icon} size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink leading-tight">{title}</p>
        <p className="text-xs text-faint truncate">{desc}</p>
      </div>
    </Link>
  )
}
