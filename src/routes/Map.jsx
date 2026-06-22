import MapView, { TYPE_COLORS, TYPE_LABELS } from '../components/MapView'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import partners from '../data/partners.json'

export default function Map() {
  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
      <PageHeader title="Refill map" subtitle="Fountains, stations & partner spots near you" />

      <div className="rounded-2xl border border-line overflow-hidden h-[58dvh] min-h-72">
        <MapView />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <span key={type} className="inline-flex items-center gap-1.5 text-xs text-muted">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_COLORS[type] }} />
            {label}
          </span>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-semibold text-ink mb-3">Partner spots</h2>
        <div className="flex flex-col gap-2">
          {partners.map(p => (
            <div key={p.id} className="bg-surface rounded-2xl border border-line p-3.5 flex items-start gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent shrink-0">
                <Icon name={p.type === 'cafe' ? 'coffee' : p.type === 'store' ? 'store' : 'droplet'} size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink leading-tight">{p.name}</p>
                <p className="text-[13px] text-accent">{p.perk}</p>
                <p className="text-xs text-faint mt-0.5">{p.address}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
