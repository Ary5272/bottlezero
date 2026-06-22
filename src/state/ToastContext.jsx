import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react'
import Icon from '../components/Icon'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, opts = {}) => {
    const id = ++idRef.current
    const entry = { id, message, icon: opts.icon, actionLabel: opts.actionLabel, onAction: opts.onAction }
    setToasts(prev => [...prev, entry])
    const duration = opts.duration ?? (opts.actionLabel ? 5000 : 2600)
    setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed left-0 right-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-sm bg-toast text-toast-fg rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 toast-in"
          >
            {t.icon && <Icon name={t.icon} size={18} className="text-accent shrink-0" />}
            <span className="flex-1 text-sm font-medium">{t.message}</span>
            {t.actionLabel && (
              <button
                onClick={() => { t.onAction?.(); dismiss(t.id) }}
                className="text-sm font-semibold text-accent hover:underline cursor-pointer shrink-0"
              >
                {t.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
