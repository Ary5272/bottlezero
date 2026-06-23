import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import Icon from '../components/Icon'

const SUBTITLES = {
  signin: 'Welcome back',
  signup: 'Create your account',
  forgot: 'Reset your password',
}

export default function Auth() {
  const { signIn, signUp, resetPassword, isSupabaseEnabled } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  function switchMode(next) {
    setMode(next); setError(''); setInfo('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setInfo(''); setBusy(true)
    try {
      if (mode === 'forgot') {
        await resetPassword(email)
        setInfo('Check your email for a password reset link.')
      } else if (mode === 'signup') {
        const data = await signUp(email, password, name)
        if (data?.session) navigate('/')
        else { setInfo('Account created! Check your email to confirm, then sign in.'); setMode('signin') }
      } else {
        await signIn(email, password)
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-line text-sm bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
  const submitLabel = busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center max-w-sm w-full mx-auto px-5 py-10">
      <div className="flex flex-col items-center mb-8">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-accent text-white mb-3">
          <Icon name="droplet" size={26} stroke={2.2} />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-ink">BottleZero</h1>
        <p className="text-sm text-muted mt-1">{SUBTITLES[mode]}</p>
      </div>

      {!isSupabaseEnabled && (
        <div className="bg-surface border border-line rounded-xl p-3 mb-5 text-center">
          <p className="text-xs text-muted">Cloud sync isn't connected. Your data is still saved on this device.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'signup' && (
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className={inputCls} />
        )}
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputCls} />
        {mode !== 'forgot' && (
          <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (6+ characters)" className={inputCls} />
        )}

        {mode === 'signin' && (
          <button type="button" onClick={() => switchMode('forgot')} className="self-end text-xs text-muted hover:text-accent cursor-pointer">
            Forgot password?
          </button>
        )}

        {error && <p className="text-xs text-warn">{error}</p>}
        {info && <p className="text-xs text-accent">{info}</p>}

        <button type="submit" disabled={busy || !isSupabaseEnabled}
          className="mt-1 bg-accent text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {submitLabel}
        </button>
      </form>

      {mode === 'forgot' ? (
        <p className="text-center text-sm text-muted mt-5">
          <button onClick={() => switchMode('signin')} className="text-accent font-medium hover:underline cursor-pointer">
            Back to sign in
          </button>
        </p>
      ) : (
        <p className="text-center text-sm text-muted mt-5">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="text-accent font-medium hover:underline cursor-pointer">
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      )}

      <Link to="/" className="text-center text-xs text-faint hover:text-muted mt-6">Continue without an account →</Link>
    </div>
  )
}
