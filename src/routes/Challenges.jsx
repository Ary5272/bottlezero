import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { supabase } from '../lib/supabase'
import { shareContent } from '../lib/share'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function Challenges() {
  const { user, isSupabaseEnabled } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [newGoal, setNewGoal] = useState(100)
  const [joinCode, setJoinCode] = useState('')
  const [boards, setBoards] = useState({})

  const loadChallenges = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('challenge_members')
      .select('challenge:challenges(*)')
      .eq('user_id', user.id)
    if (error) setError(error.message)
    else setChallenges((data || []).map(r => r.challenge).filter(Boolean))
    setLoading(false)
  }, [user])

  useEffect(() => { if (user) loadChallenges() }, [user, loadChallenges])

  async function handleCreate(e) {
    e.preventDefault(); setError('')
    const code = randomCode()
    const { data, error } = await supabase
      .from('challenges')
      .insert({ name: newName, code, goal: Number(newGoal) || 100, created_by: user.id })
      .select().single()
    if (error) { setError(error.message); return }
    await supabase.from('challenge_members').insert({ challenge_id: data.id, user_id: user.id })
    setNewName(''); setNewGoal(100); loadChallenges()
  }

  async function handleJoin(e) {
    e.preventDefault(); setError('')
    const code = joinCode.trim().toUpperCase()
    const { data: ch, error: findErr } = await supabase
      .from('challenges').select('*').eq('code', code).maybeSingle()
    if (findErr || !ch) { setError('No challenge found with that code.'); return }
    const { error: joinErr } = await supabase
      .from('challenge_members').insert({ challenge_id: ch.id, user_id: user.id })
    if (joinErr && !joinErr.message.includes('duplicate')) { setError(joinErr.message); return }
    setJoinCode(''); loadChallenges()
  }

  async function loadLeaderboard(code) {
    const { data, error } = await supabase.rpc('get_challenge_leaderboard', { p_code: code })
    if (!error) setBoards(prev => ({ ...prev, [code]: data || [] }))
  }

  async function shareCode(ch) {
    const result = await shareContent({
      title: `Join my BottleZero challenge: ${ch.name}`,
      text: `Join my "${ch.name}" challenge on BottleZero! Use code ${ch.code} to compete and save plastic bottles together.`,
      url: window.location.origin,
    })
    if (result === 'copied') alert('Invite copied to clipboard!')
  }

  const inputCls = "w-full px-3 py-2 rounded-lg border border-line text-sm bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"

  if (!isSupabaseEnabled || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
        <PageHeader title="Friends" subtitle="Compete to save the most bottles" />
        <div className="bg-surface rounded-2xl border border-line p-8 text-center flex flex-col items-center gap-3">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-accent-soft text-accent">
            <Icon name="users" size={24} />
          </span>
          <p className="text-[13px] text-muted max-w-xs">Sign in to create challenges, invite friends, and climb the leaderboard together.</p>
          <Link to="/auth" className="bg-accent text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
      <PageHeader title="Friends" subtitle="Compete to save the most bottles" />
      {error && <p className="text-xs text-warn">{error}</p>}

      <div className="grid grid-cols-1 gap-3">
        <form onSubmit={handleCreate} className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
          <h2 className="text-sm font-semibold text-ink">Create a challenge</h2>
          <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Challenge name (e.g. Class of 2026)" className={inputCls} />
          <div className="flex gap-2">
            <input type="number" min="1" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Team goal" className={inputCls} />
            <button type="submit" className="bg-accent text-white px-5 rounded-lg text-sm font-medium hover:bg-accent-dark cursor-pointer whitespace-nowrap">Create</button>
          </div>
        </form>

        <form onSubmit={handleJoin} className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
          <h2 className="text-sm font-semibold text-ink">Join with a code</h2>
          <div className="flex gap-2">
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="ABC123" maxLength={6} className={`${inputCls} uppercase tracking-widest font-mono`} />
            <button type="submit" className="border border-accent text-accent px-5 rounded-lg text-sm font-medium hover:bg-accent-soft cursor-pointer">Join</button>
          </div>
        </form>
      </div>

      <section className="flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Your challenges</h2>
        {loading && <p className="text-[13px] text-faint">Loading…</p>}
        {!loading && challenges.length === 0 && (
          <p className="text-[13px] text-faint">No challenges yet — create one or join with a code.</p>
        )}
        {challenges.map(ch => {
          const board = boards[ch.code]
          const teamTotal = board ? board.reduce((s, r) => s + Number(r.bottles), 0) : 0
          return (
            <div key={ch.id} className="bg-surface rounded-2xl border border-line p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink leading-tight">{ch.name}</h3>
                  <p className="text-xs text-faint mt-0.5">Goal: {ch.goal} bottles</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-wide text-faint">Code</p>
                  <p className="font-mono font-bold text-accent tracking-wide">{ch.code}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => loadLeaderboard(ch.code)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-canvas border border-line text-ink py-2 rounded-lg text-[13px] font-medium hover:border-accent/40 cursor-pointer">
                  <Icon name="trophy" size={15} /> Leaderboard
                </button>
                <button onClick={() => shareCode(ch)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-canvas border border-line text-ink py-2 rounded-lg text-[13px] font-medium hover:border-accent/40 cursor-pointer">
                  <Icon name="share" size={15} /> Invite
                </button>
              </div>

              {board && (
                <div className="mt-3 border-t border-line pt-3">
                  {board.length === 0 && <p className="text-xs text-faint">No data yet.</p>}
                  {board.map((row, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-1">
                      <span className="text-xs w-5 text-center font-semibold text-faint tabular-nums">
                        {['🥇','🥈','🥉'][i] || i + 1}
                      </span>
                      <span className="text-[13px] flex-1 truncate text-ink">{row.name || 'Anonymous'}</span>
                      <span className="text-[13px] font-semibold text-accent tabular-nums">{row.bottles}</span>
                    </div>
                  ))}
                  <div className="mt-2 h-1.5 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${Math.min(100, (teamTotal / ch.goal) * 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-faint mt-1 text-center tabular-nums">{teamTotal} / {ch.goal} team total</p>
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
