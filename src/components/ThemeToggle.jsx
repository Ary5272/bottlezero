import { useTheme } from '../state/ThemeContext'
import Icon from './Icon'

const OPTIONS = [
  { key: 'light', label: 'Light', icon: 'sparkle' },
  { key: 'dark', label: 'Dark', icon: 'droplet' },
  { key: 'system', label: 'Auto', icon: 'settings' },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex gap-1.5 bg-canvas border border-line rounded-xl p-1">
      {OPTIONS.map(o => (
        <button
          key={o.key}
          onClick={() => setTheme(o.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
            theme === o.key ? 'bg-accent text-white' : 'text-muted hover:text-ink'
          }`}
        >
          <Icon name={o.icon} size={15} stroke={2} />
          {o.label}
        </button>
      ))}
    </div>
  )
}
