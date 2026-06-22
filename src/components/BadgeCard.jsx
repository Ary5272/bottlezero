import Icon from './Icon'

export default function BadgeCard({ badge }) {
  const { icon, name, description, unlocked, progress } = badge

  return (
    <div className={`rounded-2xl p-3.5 border text-center transition-colors ${
      unlocked ? 'bg-surface border-line' : 'bg-canvas border-line'
    }`}>
      <div className={`mx-auto mb-2 grid place-items-center w-12 h-12 rounded-full text-2xl ${
        unlocked ? 'bg-accent-soft' : 'bg-line/60'
      }`}>
        <span className={unlocked ? '' : 'opacity-30 grayscale'}>{icon}</span>
      </div>
      <p className={`font-semibold text-[13px] leading-tight ${unlocked ? 'text-ink' : 'text-muted'}`}>{name}</p>
      <p className="text-[11px] text-faint mt-0.5 leading-snug">{description}</p>
      {unlocked ? (
        <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-accent">
          <Icon name="check" size={12} stroke={2.4} /> Earned
        </span>
      ) : (
        <div className="mt-2.5 h-1 bg-line rounded-full overflow-hidden">
          <div className="h-full bg-faint/60 rounded-full" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}
    </div>
  )
}
