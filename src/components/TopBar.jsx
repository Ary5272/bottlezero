import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import Icon from './Icon'

export default function TopBar() {
  const { rewards } = useApp()
  const { points, level } = rewards

  return (
    <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-sm border-b border-line" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-xl mx-auto h-14 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 active:scale-[0.98] transition-transform">
          <span className="grid place-items-center w-7 h-7 rounded-[9px] bg-accent text-white shadow-soft">
            <Icon name="droplet" size={16} stroke={2.3} />
          </span>
          <span className="font-bold tracking-tight text-ink text-[15px]">BottleZero</span>
        </Link>
        <Link
          to="/rewards"
          className="flex items-center gap-1.5 rounded-full border border-line bg-surface pl-2 pr-3 py-1 text-xs shadow-soft hover:border-accent/30 transition-colors active:scale-[0.98]"
        >
          <span className="grid place-items-center w-5 h-5 rounded-full bg-accent-soft text-accent">
            <Icon name="leaf" size={12} stroke={2.2} />
          </span>
          <span className="font-semibold text-ink">{level.name}</span>
          <span className="text-faint">·</span>
          <span className="font-medium text-muted tabular-nums">{points.toLocaleString()}</span>
        </Link>
      </div>
    </header>
  )
}
