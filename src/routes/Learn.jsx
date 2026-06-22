import { useState, useMemo } from 'react'
import facts from '../data/facts.json'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'

const TABS = [
  { key: 'impact', label: 'Impact' },
  { key: 'tips', label: 'Tips' },
  { key: 'diy', label: 'DIY' },
  { key: 'news', label: 'News' },
]

const dayIndex = Math.floor(Date.now() / 86400000)

function rotate(arr, n) {
  if (arr.length === 0) return arr
  const k = ((n % arr.length) + arr.length) % arr.length
  return [...arr.slice(k), ...arr.slice(0, k)]
}

function SourceLink({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-accent hover:underline"
    >
      {item.source}
      <Icon name="external" size={12} stroke={2} />
    </a>
  )
}

export default function Learn() {
  const [tab, setTab] = useState('impact')

  const spotlight = useMemo(() => facts[dayIndex % facts.length], [])
  const items = useMemo(
    () => rotate(facts.filter(f => f.category === tab), dayIndex),
    [tab]
  )

  const today = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
      <PageHeader title="Learn" subtitle="Why it matters and how to do more" />

      <a
        href={spotlight.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-accent text-white rounded-2xl p-5 relative overflow-hidden hover:bg-accent-dark transition-colors"
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/80 mb-2">
          <Icon name="calendar" size={13} stroke={2} />
          Today's spotlight · {today}
        </div>
        <h2 className="text-lg font-bold leading-snug">{spotlight.title}</h2>
        <p className="text-sm text-white/90 mt-1 leading-relaxed">{spotlight.text}</p>
        <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-white">
          Read at {spotlight.source}
          <Icon name="external" size={13} stroke={2} />
        </span>
      </a>

      <div className="flex gap-1.5 bg-surface border border-line rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              tab === t.key ? 'bg-accent text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <article key={i} className="bg-surface rounded-2xl border border-line p-4">
            <h3 className="font-semibold text-[15px] text-ink">{item.title}</h3>
            <p className="text-[13px] text-muted mt-1 leading-relaxed">{item.text}</p>
            <SourceLink item={item} />
          </article>
        ))}
      </div>

      <p className="text-center text-[11px] text-faint">Fresh picks every day · tap any card to read the source</p>
    </div>
  )
}
