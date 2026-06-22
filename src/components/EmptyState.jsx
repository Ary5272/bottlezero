const ILLUSTRATIONS = {
  chart: (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className="w-full h-full">
      <line x1="16" y1="96" x2="104" y2="96" stroke="var(--c-line)" strokeWidth="3" strokeLinecap="round" />
      <rect x="24" y="72" width="18" height="22" rx="5" fill="var(--c-accent-soft)" />
      <rect x="51" y="58" width="18" height="36" rx="5" fill="var(--c-accent-soft)" />
      <rect x="78" y="42" width="18" height="52" rx="5" fill="var(--c-accent)" />
      <path d="M60 16c7 8 10 13 0 21-10-8-7-13 0-21Z" fill="var(--c-accent)" />
    </svg>
  ),
  badge: (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className="w-full h-full">
      <path d="M47 70 L41 104 L60 94 L79 104 L73 70 Z" fill="var(--c-accent-soft)" stroke="var(--c-accent)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="60" cy="50" r="30" fill="var(--c-accent-soft)" />
      <circle cx="60" cy="50" r="30" fill="none" stroke="var(--c-accent)" strokeWidth="3" />
      <path d="M60 36 l4.6 9.3 10.3 1.5 -7.45 7.25 1.76 10.25 -9.2 -4.85 -9.2 4.85 1.76 -10.25 -7.45 -7.25 10.3 -1.5 Z" fill="var(--c-accent)" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className="w-full h-full">
      <path d="M30 38 L48 30 L72 38 L90 30 L90 86 L72 94 L48 86 L30 94 Z" fill="var(--c-accent-soft)" stroke="var(--c-accent)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M48 30 L48 86 M72 38 L72 94" stroke="var(--c-accent)" strokeWidth="3" strokeLinejoin="round" opacity="0.5" />
      <path d="M60 48c6 7 9 12 0 19-9-7-6-12 0-19Z" fill="var(--c-accent)" />
    </svg>
  ),
}

export default function EmptyState({ variant = 'chart', title, text, action, compact = false }) {
  return (
    <div className={`bg-surface rounded-2xl border border-line text-center flex flex-col items-center shadow-soft ${compact ? 'p-5 gap-2.5' : 'p-8 gap-3.5'}`}>
      <div className={compact ? 'w-16 h-16' : 'w-24 h-24'}>{ILLUSTRATIONS[variant]}</div>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        {text && <p className="text-[13px] text-muted mt-1 max-w-xs mx-auto leading-relaxed">{text}</p>}
      </div>
      {action}
    </div>
  )
}
