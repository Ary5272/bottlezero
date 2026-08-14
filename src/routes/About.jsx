import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const NUMBERS = [
  { value: '12.7 g', label: 'Plastic per bottle', source: 'Average 500ml PET bottle weight — NAPCOR, 2020.' },
  { value: '82.8 g', label: 'CO₂e per bottle', source: 'Full lifecycle of a single-use PET bottle — Quantis for IBWA, 2010.' },
  { value: '$1.29', label: 'Cost per bottle', source: 'Average US 16.9oz single-serve bottled water — Beverage Marketing Corp.' },
  { value: '0.21 kg', label: 'CO₂ per car mile', source: 'Typical US passenger vehicle — EPA, 2023.' },
]

export default function About() {
  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
      <PageHeader title="About" subtitle="Built for the Congressional App Challenge" />

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-1.5">Our mission</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          BottleZero helps you track every single-use plastic bottle you avoid, find refill points
          near you, and see the real environmental impact of your choices. Small actions add up.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-1">About the numbers</h2>
        <p className="text-xs text-faint mb-3">Impact figures are based on published research and industry data.</p>
        <div className="flex flex-col divide-y divide-line">
          {NUMBERS.map((n, i) => (
            <div key={i} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{n.label}</span>
                <span className="text-sm font-bold text-accent tabular-nums">{n.value}</span>
              </div>
              <p className="text-[11px] text-faint mt-0.5">{n.source}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-2">Privacy</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          Your data stays on your device unless you create an account to sync it. Location is used
          only to find nearby refill points — it's never stored or shared.
        </p>
        <Link to="/privacy" className="text-[13px] font-medium text-accent hover:underline">
          Read the full privacy policy →
        </Link>
      </section>

      <p className="text-center text-[11px] text-faint">BottleZero · React · OpenStreetMap · Supabase · Python · PWA</p>
    </div>
  )
}
