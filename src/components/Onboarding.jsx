import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { useAuth } from '../state/AuthContext'
import { supabase } from '../lib/supabase'
import { load, save } from '../lib/storage'
import Icon from './Icon'

const GOALS = [3, 5, 8]

const STEPS = ['welcome', 'tour-log', 'tour-track', 'tour-map', 'tour-social', 'setup', 'account']

export default function Onboarding({ onDone }) {
  const { profile, updateProfile } = useApp()
  const { user, signUp, signIn, isSupabaseEnabled } = useAuth()

  const [i, setI] = useState(0)
  const key = STEPS[i]

  const [name, setName] = useState(profile.name || '')
  const [goal, setGoal] = useState(profile.dailyGoal || 5)

  const [authMode, setAuthMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function applyLocalProfile() {
    const patch = { dailyGoal: goal }
    if (name.trim()) patch.name = name.trim()
    updateProfile(patch)
  }
  function done() { save('onboarded', true); onDone() }
  function continueLocal() { applyLocalProfile(); done() }
  function skip() { done() }
  const next = () => setI(n => Math.min(n + 1, STEPS.length - 1))

  async function handleAuth(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      if (authMode === 'signup') {
        const data = await signUp(email, password, name.trim())
        if (data?.user) {
          try { await supabase.from('profiles').update({ daily_goal: goal }).eq('id', data.user.id) } catch { void 0 }
        }
        if (!data?.session) {
          setError('Account created! Check your email to confirm, then sign in.')
          setAuthMode('signin'); setBusy(false); return
        }
      } else {
        await signIn(email, password)
      }
      done()
    } catch (err) {
      setError(err.message || 'Something went wrong.'); setBusy(false)
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-line text-base bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"

  return (
    <div className="fixed inset-0 z-[200] bg-canvas flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-6 py-9 min-h-full flex flex-col justify-center" key={i}>
          <div className="sheet-up">
            {key === 'welcome' && (
              <div className="flex flex-col items-center text-center gap-5">
                <span className="grid place-items-center w-16 h-16 rounded-[20px] bg-accent text-white shadow-[0_10px_30px_-8px_rgba(14,159,110,0.5)]">
                  <Icon name="droplet" size={32} stroke={2.2} />
                </span>
                <div>
                  <h1 className="text-[26px] font-bold tracking-tight text-ink leading-tight">Welcome to BottleZero</h1>
                  <p className="text-[15px] text-muted mt-2 leading-relaxed">
                    A simple way to cut single-use plastic — and actually see the difference you make.
                  </p>
                </div>
                <p className="text-xs text-faint">Here's a quick look at how it works.</p>
              </div>
            )}

            {key === 'tour-log' && (
              <TourSlide title="Log a bottle" desc="Tap the big button every time you avoid a single-use bottle. Set where you refilled so your stats stay accurate.">
                <LogMock />
              </TourSlide>
            )}

            {key === 'tour-track' && (
              <TourSlide title="Watch your impact grow" desc="Each bottle turns into real numbers — plastic, CO₂, and money saved — plus daily streaks to keep you going.">
                <TrackMock />
              </TourSlide>
            )}

            {key === 'tour-map' && (
              <TourSlide title="Find places to refill" desc="The map shows water fountains, refill stations, eco-stores, and partner spots with perks near you.">
                <MapMock />
              </TourSlide>
            )}

            {key === 'tour-social' && (
              <TourSlide title="Earn rewards & compete" desc="Collect points, level up, unlock badges, and start challenges to climb the leaderboard with friends.">
                <SocialMock />
              </TourSlide>
            )}

            {key === 'setup' && (
              <div className="flex flex-col gap-5">
                <StepHeading title="Make it yours" sub="Set a name and a daily goal — you can change these anytime." />
                <div>
                  <label className="text-xs text-muted block mb-1.5">Display name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Daily goal</label>
                  <div className="grid grid-cols-3 gap-3">
                    {GOALS.map(g => (
                      <button key={g} onClick={() => setGoal(g)}
                        className={`rounded-2xl border py-4 flex flex-col items-center transition-all cursor-pointer active:scale-[0.97] ${
                          goal === g ? 'border-accent bg-accent-soft shadow-soft' : 'border-line bg-surface'
                        }`}>
                        <span className={`text-xl font-bold ${goal === g ? 'text-accent' : 'text-ink'}`}>{g}</span>
                        <span className="text-[11px] text-faint">per day</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {key === 'account' && (
              <div className="flex flex-col gap-5">
                <StepHeading
                  title={user ? "You're all set" : 'Save your progress'}
                  sub={user
                    ? 'Your progress is synced to the cloud.'
                    : isSupabaseEnabled
                      ? 'Create an account to sync across devices and join friend challenges.'
                      : 'Cloud accounts aren’t set up — your data stays on this device.'} />
                {user ? (
                  <div className="flex items-center gap-3 bg-surface border border-line rounded-2xl p-4">
                    <span className="grid place-items-center w-10 h-10 rounded-full bg-accent-soft text-accent shrink-0">
                      <Icon name="check" size={20} stroke={2.4} />
                    </span>
                    <p className="text-sm text-ink truncate">{user.email}</p>
                  </div>
                ) : isSupabaseEnabled && (
                  <form onSubmit={handleAuth} className="flex flex-col gap-3">
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputCls} />
                    <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (6+ characters)" className={inputCls} />
                    {error && <p className="text-xs text-warn">{error}</p>}
                    <button type="submit" disabled={busy}
                      className="bg-accent text-white py-3 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50 active:scale-[0.99]">
                      {busy ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'}
                    </button>
                    <button type="button" onClick={() => { setAuthMode(authMode === 'signup' ? 'signin' : 'signup'); setError('') }}
                      className="text-sm text-muted hover:text-ink cursor-pointer">
                      {authMode === 'signup' ? 'I already have an account' : 'Create an account instead'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-surface/80 backdrop-blur-sm">
        <div className="max-w-sm mx-auto px-6 py-4 flex flex-col gap-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <div className="flex justify-center gap-1.5">
            {STEPS.map((_, idx) => (
              <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-accent' : 'w-1.5 bg-line'}`} />
            ))}
          </div>
          {key !== 'account' ? (
            <div className="flex gap-2">
              <button onClick={skip} className="px-4 py-3 text-sm font-medium text-muted hover:text-ink cursor-pointer">Skip</button>
              <button onClick={next} className="flex-1 bg-accent text-white py-3 rounded-xl text-sm font-semibold hover:bg-accent-dark cursor-pointer active:scale-[0.99]">
                {key === 'setup' ? 'Almost done' : key === 'welcome' ? 'Take the tour' : 'Next'}
              </button>
            </div>
          ) : user ? (
            <button onClick={done} className="w-full bg-accent text-white py-3 rounded-xl text-sm font-semibold hover:bg-accent-dark cursor-pointer active:scale-[0.99]">
              Done
            </button>
          ) : (
            <button onClick={continueLocal} className="py-3 text-sm font-medium text-muted hover:text-ink cursor-pointer">
              Continue without an account
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TourSlide({ title, desc, children }) {
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div className="w-full rounded-3xl border border-line bg-canvas p-5 shadow-soft">{children}</div>
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink leading-tight">{title}</h1>
        <p className="text-[14px] text-muted mt-1.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function StepHeading({ title, sub }) {
  return (
    <div className="text-center">
      <h1 className="text-[24px] font-bold tracking-tight text-ink leading-tight">{title}</h1>
      <p className="text-sm text-muted mt-1.5">{sub}</p>
    </div>
  )
}

function LogMock() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="grid place-items-center w-24 h-24 rounded-full text-white"
        style={{
          background: 'linear-gradient(155deg, color-mix(in srgb, var(--c-accent) 92%, white), var(--c-accent-dark))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 12px 26px -12px color-mix(in srgb, var(--c-accent) 70%, transparent)',
        }}>
        <div className="flex flex-col items-center">
          <Icon name="plus" size={22} stroke={2.6} />
          <span className="text-[8px] font-semibold tracking-[0.12em] mt-0.5 text-white/90">LOG</span>
        </div>
      </div>
      <div className="flex gap-1.5">
        {[['home', 'Home', true], ['droplet', 'Fountain'], ['store', 'Store']].map(([ic, lbl, on]) => (
          <span key={lbl} className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${on ? 'bg-accent text-white' : 'bg-surface border border-line text-muted'}`}>
            <Icon name={ic} size={11} stroke={2} />{lbl}
          </span>
        ))}
      </div>
    </div>
  )
}

function TrackMock() {
  const tiles = [
    { icon: 'bottle', n: '128', l: 'bottles', accent: true },
    { icon: 'flame', n: '6', l: 'day streak' },
    { icon: 'leaf', n: '1.6', l: 'kg plastic' },
    { icon: 'cloud', n: '10.6', l: 'kg CO₂' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {tiles.map(t => (
        <div key={t.l} className="bg-surface border border-line rounded-xl p-2.5 text-left">
          <span className={`grid place-items-center w-6 h-6 rounded-md mb-1.5 ${t.accent ? 'bg-accent-soft text-accent' : 'bg-line/50 text-muted'}`}>
            <Icon name={t.icon} size={12} stroke={2} />
          </span>
          <p className="text-lg font-bold text-ink leading-none tabular-nums">{t.n}</p>
          <p className="text-[10px] text-faint mt-0.5">{t.l}</p>
        </div>
      ))}
    </div>
  )
}

function MapMock() {
  const pins = [
    { c: '#2f93cf', top: '22%', left: '30%' },
    { c: '#0e9f6e', top: '40%', left: '64%' },
    { c: '#7c6cf0', top: '62%', left: '38%' },
    { c: '#d9892f', top: '30%', left: '78%' },
  ]
  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative h-28 rounded-xl border border-line overflow-hidden"
        style={{ background: 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--c-line) 60%, transparent) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-line) 60%, transparent) 0 1px, transparent 1px 22px), var(--c-surface)' }}>
        {pins.map((p, idx) => (
          <span key={idx} className="absolute w-3 h-3 rounded-full border-2 border-white" style={{ background: p.c, top: p.top, left: p.left, boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {[['#2f93cf', 'Fountain'], ['#0e9f6e', 'Station'], ['#d9892f', 'Partner']].map(([c, l]) => (
          <span key={l} className="inline-flex items-center gap-1 text-[10px] text-muted">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  )
}

function SocialMock() {
  const R = 16, C = 2 * Math.PI * R
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 shrink-0">
          <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
            <circle cx="22" cy="22" r={R} fill="none" stroke="var(--c-line)" strokeWidth="4" />
            <circle cx="22" cy="22" r={R} fill="none" stroke="var(--c-accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${0.65 * C} ${C}`} />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-accent"><Icon name="leaf" size={16} stroke={2} /></span>
        </div>
        <div className="text-left">
          <p className="text-[11px] text-faint">Level 2</p>
          <p className="text-sm font-bold text-ink leading-tight">Sprout · 305 pts</p>
        </div>
      </div>
      <div className="bg-surface border border-line rounded-xl p-2.5 flex flex-col gap-1.5">
        {[['🥇', 'You', '128'], ['🥈', 'Maya', '94'], ['🥉', 'Jordan', '71']].map(([m, n, v]) => (
          <div key={n} className="flex items-center gap-2 text-[11px]">
            <span className="w-4 text-center">{m}</span>
            <span className="flex-1 text-left text-ink">{n}</span>
            <span className="font-semibold text-accent tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function needsOnboarding() {
  return !load('onboarded', false)
}
