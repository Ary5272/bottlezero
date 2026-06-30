const CANVAS = { light: '#f7f8f7', dark: '#0d1210' }

export function initNativeStatusBar() {
  if (!window.Capacitor?.isNativePlatform?.()) return

  import('@capacitor/status-bar')
    .then(({ StatusBar, Style }) => {
      const apply = () => {
        const dark = document.documentElement.classList.contains('dark')
        StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {})
        StatusBar.setBackgroundColor({ color: dark ? CANVAS.dark : CANVAS.light }).catch(() => {})
        StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {})
      }
      apply()
      new MutationObserver(apply).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })
    })
    .catch(() => {})
}
