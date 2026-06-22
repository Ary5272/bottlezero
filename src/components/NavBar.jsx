import { NavLink } from 'react-router-dom'
import Icon from './Icon'
import { prefetchRoute } from '../lib/prefetch'

const links = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/insights', icon: 'chart', label: 'Dashboard' },
  { to: '/map', icon: 'map', label: 'Map' },
  { to: '/rewards', icon: 'gift', label: 'Rewards' },
  { to: '/challenges', icon: 'users', label: 'Friends' },
  { to: '/profile', icon: 'user', label: 'Profile' },
]

export default function NavBar() {
  return (
    <nav
      className="sticky bottom-0 z-40 px-3 pt-2 pointer-events-none"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="pointer-events-auto mx-auto max-w-md flex justify-around items-stretch h-16 rounded-2xl border border-line bg-surface/95 backdrop-blur-md shadow-float">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onPointerEnter={() => prefetchRoute(to)}
            onTouchStart={() => prefetchRoute(to)}
            className="flex flex-1 flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
          >
            {({ isActive }) => (
              <>
                <span className={`grid place-items-center px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-accent-soft text-accent' : 'text-faint'}`}>
                  <Icon name={icon} size={20} stroke={isActive ? 2.2 : 1.8} />
                </span>
                <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'text-accent' : 'text-faint'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
