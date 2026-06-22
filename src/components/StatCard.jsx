import Icon from './Icon'
import AnimatedNumber from './AnimatedNumber'

export default function StatCard({ icon, label, value, unit, accent = false, animate = true }) {
  const isNumber = typeof value === 'number'
  return (
    <div className="bg-surface rounded-2xl p-4 border border-line shadow-soft">
      <div className="flex items-center gap-2 mb-3">
        <span className={`grid place-items-center w-7 h-7 rounded-lg ${accent ? 'bg-accent-soft text-accent' : 'bg-line/50 text-muted'}`}>
          <Icon name={icon} size={15} stroke={2} />
        </span>
        <p className="text-[12px] font-medium text-faint">{label}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-bold tracking-tight text-ink tabular-nums leading-none">
          {isNumber && animate ? <AnimatedNumber value={value} /> : value}
        </span>
        {unit && <span className="text-xs font-medium text-faint">{unit}</span>}
      </div>
    </div>
  )
}
