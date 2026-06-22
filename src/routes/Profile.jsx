import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { useAuth } from '../state/AuthContext'
import { useReminders } from '../state/ReminderContext'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import ThemeToggle from '../components/ThemeToggle'
import { save } from '../lib/storage'

export default function Profile() {
  const { profile, updateProfile, resetData, totalBottles, streak, impact, cloud, syncing } = useApp()
  const { user, signOut, isSupabaseEnabled } = useAuth()
  const { settings: reminder, permission, supported, enable, disable, setTime } = useReminders()
  const navigate = useNavigate()

  async function toggleReminder() {
    if (reminder.enabled) disable()
    else await enable()
  }

  const [name, setName] = useState(profile.name)
  const [goal, setGoal] = useState(profile.dailyGoal)
  const [showReset, setShowReset] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(profile.name)
    setGoal(profile.dailyGoal)
  }, [profile.name, profile.dailyGoal])

  function handleSave() {
    updateProfile({ name, dailyGoal: Number(goal) || 5 })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function replayTour() {
    save('onboarded', false)
    window.location.assign('/')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
      <PageHeader title="Profile" />

      <section className="bg-surface rounded-2xl border border-line p-4">
        {cloud ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-accent-soft text-accent shrink-0">
                <Icon name="user" size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{user.email}</p>
                <p className="text-xs text-accent flex items-center gap-1">
                  <Icon name="check" size={12} stroke={2.4} />
                  {syncing ? 'Syncing…' : 'Synced to cloud'}
                </p>
              </div>
            </div>
            <button onClick={() => signOut()}
              className="shrink-0 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink border border-line rounded-lg px-3 py-1.5 cursor-pointer">
              <Icon name="logout" size={15} /> Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] text-muted">
              {isSupabaseEnabled
                ? 'Sign in to sync your progress across devices.'
                : 'Your data is saved on this device.'}
            </p>
            <button onClick={() => navigate('/auth')} disabled={!isSupabaseEnabled}
              className="shrink-0 bg-accent text-white py-1.5 px-3.5 rounded-lg text-sm font-medium hover:bg-accent-dark cursor-pointer disabled:opacity-50">
              Sign in
            </button>
          </div>
        )}
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ink">Settings</h2>
        <div>
          <label className="text-xs text-muted block mb-1">Display name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
            className="w-full px-3 py-2 rounded-lg border border-line text-sm bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Daily bottle goal</label>
          <input type="number" min="1" max="20" value={goal} onChange={e => setGoal(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-line text-sm bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
        </div>
        <button onClick={handleSave}
          className="bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors cursor-pointer">
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-3">Appearance</h2>
        <ThemeToggle />
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-3">Daily reminder</h2>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] text-muted">
            Get nudged to log so you don't break your streak.
          </p>
          <button
            onClick={toggleReminder}
            disabled={!supported || permission === 'denied'}
            role="switch"
            aria-checked={reminder.enabled}
            className={`shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              reminder.enabled ? 'bg-accent' : 'bg-line'
            }`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${reminder.enabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {reminder.enabled && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
            <label className="text-[13px] text-muted">Remind me at</label>
            <input
              type="time"
              value={reminder.time}
              onChange={e => setTime(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-line text-sm bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
        )}

        {!supported && (
          <p className="text-[11px] text-faint mt-2">This browser doesn't support notifications.</p>
        )}
        {supported && permission === 'denied' && (
          <p className="text-[11px] text-warn mt-2">Notifications are blocked. Enable them for this site in your browser settings.</p>
        )}
        <p className="text-[11px] text-faint mt-2">
          Reminders work while the app is open and nudge you when you reopen it past your set time. Set per device.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4">
        <h2 className="text-sm font-semibold text-ink mb-3">Lifetime</h2>
        <div className="grid grid-cols-2 gap-y-2.5 text-[13px]">
          <Stat label="Bottles saved" value={totalBottles} />
          <Stat label="Longest streak" value={`${streak.longest} d`} />
          <Stat label="Plastic avoided" value={`${impact.plasticKg} kg`} />
          <Stat label="Money saved" value={`$${impact.moneySaved}`} />
        </div>
      </section>

      <section className="bg-surface rounded-2xl border border-line divide-y divide-line overflow-hidden">
        <RowLink to="/insights" icon="chart" label="Dashboard" />
        <RowLink to="/learn" icon="book" label="Learn" />
        <RowLink to="/about" icon="leaf" label="About & impact sources" />
        <RowButton icon="refresh" label="Replay the tour" onClick={replayTour} />
      </section>

      <section className="px-1">
        {!showReset ? (
          <button onClick={() => setShowReset(true)} className="text-[13px] text-faint hover:text-warn cursor-pointer">
            Reset all data
          </button>
        ) : (
          <div className="bg-surface border border-warn/30 rounded-2xl p-4 flex flex-col gap-2">
            <p className="text-[13px] text-muted">This permanently deletes your logs and stats. This can't be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => { resetData(); setShowReset(false) }}
                className="bg-warn text-white py-1.5 px-4 rounded-lg text-sm font-medium cursor-pointer">
                Reset everything
              </button>
              <button onClick={() => setShowReset(false)}
                className="py-1.5 px-4 rounded-lg text-sm text-muted hover:bg-canvas cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <>
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-ink text-right tabular-nums">{value}</span>
    </>
  )
}

function RowLink({ to, icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3.5 hover:bg-canvas transition-colors">
      <span className="text-faint"><Icon name={icon} size={19} /></span>
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <span className="text-faint"><Icon name="chevronRight" size={18} /></span>
    </Link>
  )
}

function RowButton({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-canvas transition-colors cursor-pointer text-left">
      <span className="text-faint"><Icon name={icon} size={19} /></span>
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <span className="text-faint"><Icon name="chevronRight" size={18} /></span>
    </button>
  )
}
