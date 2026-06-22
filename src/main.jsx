import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './state/ThemeContext'
import { AuthProvider } from './state/AuthContext'
import { AppProvider } from './state/AppContext'
import { ToastProvider } from './state/ToastContext'
import { ReminderProvider } from './state/ReminderContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <ReminderProvider>
                <App />
              </ReminderProvider>
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
