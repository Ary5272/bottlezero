import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './state/ThemeContext'
import { AuthProvider } from './state/AuthContext'
import { AppProvider } from './state/AppContext'
import { ToastProvider } from './state/ToastContext'
import { ReminderProvider } from './state/ReminderContext'
import { TourProvider } from './state/TourContext'
import './lib/pwa'
import { initNativeStatusBar } from './lib/native'
import './index.css'
import App from './App.jsx'

initNativeStatusBar()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <ReminderProvider>
                <TourProvider>
                  <App />
                </TourProvider>
              </ReminderProvider>
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD && !window.Capacitor) {
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
