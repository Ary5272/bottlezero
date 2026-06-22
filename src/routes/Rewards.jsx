import { useApp } from '../state/AppContext'
import PageHeader from '../components/PageHeader'
import BadgeCard from '../components/BadgeCard'
import Icon from '../components/Icon'
import EmptyState from '../components/EmptyState'
import { getRewards, PERKS, POINTS } from '../lib/rewards'

export default function Rewards() {
  const { totalBottles, badges, daysGoalMet } = useApp()
  const unlocked = badges.filter(b => b.unlocked)
  const { points, level } = getRewards(totalBottles, unlocked.length, daysGoalMet)

  const R = 26
  const C = 2 * Math.PI * R

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-6">
      <PageHeader title="Rewards" subtitle="Earn points and level up your impact" />

      <section className="bg-surface rounded-2xl border border-line p-5">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-line)" strokeWidth="5" />
              <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-accent)" strokeWidth="5"
                strokeLinecap="round" strokeDasharray={`${level.progress * C} ${C}`} className="transition-all duration-500" />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-accent">
              <Icon name="leaf" size={22} stroke={2} />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-faint">Level {level.levelNumber}</p>
            <p className="text-lg font-bold text-ink leading-tight">{level.name}</p>
            <p className="text-[13px] text-muted mt-0.5">
              {level.next
                ? <><span className="font-semibold text-ink tabular-nums">{level.pointsToNext.toLocaleString()}</span> pts to {level.next.name}</>
                : 'Highest level reached 🌳'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent tabular-nums leading-none">{points.toLocaleString()}</p>
            <p className="text-xs text-faint mt-1">points</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <PointStat icon="bottle" value={`+${POINTS.perBottle}`} label="per bottle" />
        <PointStat icon="trophy" value={`+${POINTS.perBadge}`} label="per badge" />
        <PointStat icon="target" value={`+${POINTS.perGoalDay}`} label="goal day" />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink mb-3">Perks</h2>
        <div className="flex flex-col gap-2">
          {PERKS.map(perk => {
            const earned = level.levelNumber >= perk.level
            return (
              <div key={perk.level} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${
                earned ? 'bg-surface border-line' : 'bg-canvas border-line'
              }`}>
                <span className={`grid place-items-center w-9 h-9 rounded-full shrink-0 ${
                  earned ? 'bg-accent-soft text-accent' : 'bg-line/60 text-faint'
                }`}>
                  <Icon name={earned ? 'gift' : 'lock'} size={17} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${earned ? 'text-ink' : 'text-muted'}`}>{perk.title}</p>
                  <p className="text-xs text-faint">{perk.desc}</p>
                </div>
                <span className="text-[11px] font-medium text-faint shrink-0">Lv {perk.level}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink">Achievements</h2>
          <span className="text-xs text-faint tabular-nums">{unlocked.length}/{badges.length}</span>
        </div>
        {unlocked.length === 0 && (
          <div className="mb-3">
            <EmptyState
              variant="badge"
              compact
              title="No badges yet"
              text="Log your first bottle to start unlocking achievements — your progress is shown below."
            />
          </div>
        )}
        <div className="grid grid-cols-3 gap-2.5">
          {badges.map(b => <BadgeCard key={b.key} badge={b} />)}
        </div>
      </section>
    </div>
  )
}

function PointStat({ icon, value, label }) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-3 flex flex-col items-center text-center">
      <Icon name={icon} size={18} className="text-faint mb-1.5" />
      <span className="text-base font-bold text-accent tabular-nums">{value}</span>
      <span className="text-[11px] text-faint">{label}</span>
    </div>
  )
}
