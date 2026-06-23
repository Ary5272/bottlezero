import { useState } from 'react'
import Icon from './Icon'
import { getInstallPrompt, triggerInstall, isIOS } from '../lib/pwa'

export default function InstallModal({ onClose }) {
  const [busy, setBusy] = useState(false)
  const canPrompt = !!getInstallPrompt()
  const ios = isIOS()

  async function handleInstall() {
    setBusy(true)
    await triggerInstall()
    setBusy(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[210] bg-black/40 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface rounded-3xl border border-line shadow-float p-6 flex flex-col items-center text-center gap-4 sheet-up">
        <span className="grid place-items-center w-16 h-16 rounded-[20px] bg-accent text-white shadow-[0_10px_30px_-8px_rgba(14,159,110,0.5)]">
          <Icon name="droplet" size={32} stroke={2.2} />
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-ink">Add BottleZero to your home screen</h2>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">
            Install it like a real app — a home-screen icon, fullscreen, and works offline.
          </p>
        </div>

        {ios ? (
          <div className="w-full bg-canvas border border-line rounded-2xl p-3.5 text-left flex flex-col gap-2">
            <Step n="1">Tap the <strong className="text-ink">Share</strong> button <Icon name="share" size={14} className="inline align-[-2px] text-accent" /> in Safari's toolbar.</Step>
            <Step n="2">Scroll down and tap <strong className="text-ink">Add to Home Screen</strong>.</Step>
            <Step n="3">Tap <strong className="text-ink">Add</strong> — done!</Step>
          </div>
        ) : canPrompt ? (
          <button
            onClick={handleInstall}
            disabled={busy}
            className="w-full bg-accent text-white py-3 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {busy ? 'Installing…' : 'Add to Home Screen'}
          </button>
        ) : (
          <div className="w-full bg-canvas border border-line rounded-2xl p-3.5 text-left">
            <p className="text-[13px] text-muted">
              Open your browser menu and choose <strong className="text-ink">Install app</strong> or
              <strong className="text-ink"> Add to Home Screen</strong>.
            </p>
          </div>
        )}

        <button onClick={onClose} className="text-sm font-medium text-muted hover:text-ink cursor-pointer">
          Maybe later
        </button>
      </div>
    </div>
  )
}

function Step({ n, children }) {
  return (
    <p className="text-[13px] text-muted flex gap-2">
      <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold">{n}</span>
      <span>{children}</span>
    </p>
  )
}
