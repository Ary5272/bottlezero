let deferredPrompt = null

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
  })
}

export function getInstallPrompt() {
  return deferredPrompt
}

export async function triggerInstall() {
  if (!deferredPrompt) return 'unavailable'
  deferredPrompt.prompt()
  const choice = await deferredPrompt.userChoice
  deferredPrompt = null
  return choice?.outcome === 'accepted' ? 'installed' : 'dismissed'
}

export function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}
