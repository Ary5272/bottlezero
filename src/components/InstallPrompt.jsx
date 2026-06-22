import { useEffect, useState } from 'react'
import Icon from './Icon'
import { load, save } from '../lib/storage'

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (load('install_dismissed', false)) return
    if (window.matchMedia?.('(display-mode: standalone)').matches) return

    function onPrompt(e) {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  function dismiss() {
    setShow(false)
    save('install_dismissed', true)
  }

  async function install() {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    dismiss()
  }

  if (!show) return null

  return (
    <div className="fixed left-0 right-0 bottom-20 z-[90] px-4 flex justify-center">
      <div className="w-full max-w-sm bg-surface border border-line rounded-2xl shadow-lg p-3.5 flex items-center gap-3 toast-in">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-white shrink-0">
          <Icon name="droplet" size={20} stroke={2.2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink leading-tight">Install BottleZero</p>
          <p className="text-xs text-faint">Add it to your home screen for one-tap access.</p>
        </div>
        <button onClick={install} className="shrink-0 bg-accent text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-accent-dark cursor-pointer">
          Install
        </button>
        <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-faint hover:text-muted cursor-pointer">
          <Icon name="plus" size={18} className="rotate-45" />
        </button>
      </div>
    </div>
  )
}
