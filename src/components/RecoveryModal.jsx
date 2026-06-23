import { useState } from 'react'
import { useAuth } from '../state/AuthContext'
import Icon from './Icon'

export default function RecoveryModal() {
  const { recovering, updatePassword, dismissRecovery } = useAuth()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!recovering) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      await updatePassword(password)
      setDone(true)
      setTimeout(() => dismissRecovery(), 1500)
    } catch (err) {
      setError(err.message || 'Could not update password.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[220] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface rounded-3xl border border-line shadow-float p-6 flex flex-col gap-4 sheet-up">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-accent-soft text-accent">
            <Icon name={done ? 'check' : 'lock'} size={26} stroke={2.2} />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">{done ? 'Password updated' : 'Set a new password'}</h2>
            <p className="text-sm text-muted mt-1">{done ? 'You\'re all set — you\'re signed in.' : 'Choose a new password for your account.'}</p>
          </div>
        </div>

        {!done && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              required
              minLength={6}
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="New password (6+ characters)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            {error && <p className="text-xs text-warn">{error}</p>}
            <button type="submit" disabled={busy}
              className="bg-accent text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50 active:scale-[0.99]">
              {busy ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
