import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import EmptyState from '../components/EmptyState'

const EQUIV_ICONS = { car: 'cloud', phone: 'sparkle', bulb: 'sparkle', bag: 'recycle' }

function dayKey(d) {
  return d.toISOString().slice(0, 10)
}

const SOURCE_LABELS = {
  home: 'At home',
  fountain: 'Fountain',
  station: 'Refill station',
  store: 'Store',
  other: 'Other',
}

export default function Insights() {
  const { logs, impact, totalBottles, removeLog, syncing } = useApp()

  const recent = useMemo(
    () => [...logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 12),
    [logs]
  )

  const [equiv, setEquiv] = useState(null)
  useEffect(() => {
    if (totalBottles <= 0) { setEquiv(null); return }
    let cancelled = false
    fetch(`/api/impact?bottles=${totalBottles}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelled && d && d.equivalents) setEquiv(d) })
      .catch(() => { if (!cancelled) setEquiv(null) })
    return () => { cancelled = true }
  }, [totalBottles])

  const data = useMemo(() => {
    const byDay = {}
    const bySource = {}
    for (const l of logs) {
      const day = l.timestamp.slice(0, 10)
      byDay[day] = (byDay[day] || 0) + (l.count || 1)
      const s = l.source || 'other'
      bySource[s] = (bySource[s] || 0) + (l.count || 1)
    }

    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      days.push({
        key: dayKey(d),
        label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        count: byDay[dayKey(d)] || 0,
      })
    }

    const thisWeek = days.reduce((s, d) => s + d.count, 0)
    let lastWeek = 0
    for (let i = 13; i >= 7; i--) {
      lastWeek += byDay[dayKey(new Date(Date.now() - i * 86400000))] || 0
    }

    const activeDays = Object.keys(byDay).length
    const avg = activeDays ? (totalBottles / activeDays).toFixed(1) : '0'
    const best = Object.values(byDay).reduce((m, v) => Math.max(m, v), 0)

    const sources = Object.entries(bySource)
      .map(([k, v]) => ({ key: k, label: SOURCE_LABELS[k] || k, count: v }))
      .sort((a, b) => b.count - a.count)

    return { days, thisWeek, lastWeek, avg, best, activeDays, sources }
  }, [logs, totalBottles])

  const maxDay = Math.max(1, ...data.days.map(d => d.count))
  const trend = data.thisWeek - data.lastWeek

  if (totalBottles === 0 && !syncing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-6">
        <PageHeader title="Dashboard" subtitle="Your bottle-saving trends over time" />
        <EmptyState
          variant="chart"
          title="No data yet"
          text="Log your first bottle on the Home tab and your trends, charts, and impact will show up here."
          action={
            <Link to="/" className="bg-accent text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors active:scale-[0.99]">
              Log a bottle
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-6">
      <PageHeader title="Dashboard" subtitle="Your bottle-saving trends over time" />

      <section className="bg-surface rounded-2xl border border-line p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">Last 7 days</h2>
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
            trend >= 0 ? 'text-accent' : 'text-warn'
          }`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)} vs last week
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {data.days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[11px] font-medium text-faint tabular-nums">{d.count || ''}</span>
              <div
                className={`w-full rounded-md transition-all ${d.count ? 'bg-accent' : 'bg-line'}`}
                style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
              />
              <span className="text-[11px] text-faint">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <MiniStat value={data.thisWeek} label="this week" />
        <MiniStat value={data.avg} label="daily avg" />
        <MiniStat value={data.best} label="best day" />
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-3">Where you refill</h2>
        {data.sources.length === 0 ? (
          <p className="text-[13px] text-faint">Log some bottles to see your breakdown.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.sources.map(s => (
              <div key={s.key}>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-muted">{s.label}</span>
                  <span className="font-medium text-ink tabular-nums">{s.count}</span>
                </div>
                <div className="h-2 bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${(s.count / totalBottles) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-3">Recent activity</h2>
        {recent.length === 0 ? (
          <p className="text-[13px] text-faint">Nothing logged yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {recent.map(l => (
              <div key={l.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent-soft text-accent shrink-0">
                  <Icon name="droplet" size={15} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink">
                    {l.count} bottle{l.count > 1 ? 's' : ''} · {SOURCE_LABELS[l.source] || 'Other'}
                  </p>
                  <p className="text-[11px] text-faint">
                    {new Date(l.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => removeLog(l.id)}
                  aria-label="Delete entry"
                  className="shrink-0 text-faint hover:text-warn p-1.5 cursor-pointer"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-3">Lifetime impact</h2>
        <div className="grid grid-cols-2 gap-y-4">
          <ImpactItem icon="bottle" value={totalBottles} label="bottles saved" />
          <ImpactItem icon="leaf" value={`${impact.plasticKg} kg`} label="plastic avoided" />
          <ImpactItem icon="cloud" value={`${impact.co2Kg} kg`} label="CO₂ prevented" />
          <ImpactItem icon="dollar" value={`$${impact.moneySaved}`} label="money saved" />
        </div>
      </section>

      {equiv && (
        <section className="bg-surface rounded-2xl border border-line p-4">
          <h2 className="text-sm font-semibold text-ink mb-3">Real-world equivalents</h2>
          <div className="flex flex-col divide-y divide-line">
            {equiv.equivalents.map(e => (
              <div key={e.key} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent-soft text-accent shrink-0">
                  <Icon name={EQUIV_ICONS[e.key] || 'leaf'} size={15} />
                </span>
                <span className="text-lg font-bold text-ink tabular-nums">{e.value.toLocaleString()}</span>
                <span className="text-[13px] text-muted">{e.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-faint mt-3">Computed by a Python service.</p>
        </section>
      )}
    </div>
  )
}

function MiniStat({ value, label }) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-3 text-center">
      <p className="text-xl font-bold text-ink tabular-nums">{value}</p>
      <p className="text-[11px] text-faint mt-0.5">{label}</p>
    </div>
  )
}

function ImpactItem({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent shrink-0">
        <Icon name={icon} size={18} />
      </span>
      <div>
        <p className="text-sm font-bold text-ink tabular-nums leading-tight">{value}</p>
        <p className="text-[11px] text-faint">{label}</p>
      </div>
    </div>
  )
}
