import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { ToastContainer, type Toast, type ToastVariant } from '../components/ui/Toast'

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, variant: ToastVariant = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = { id, message, variant, duration }

    setToasts((prev) => [...prev, toast])
  }, [])

  const success = useCallback((message: string, duration = 5000) => {
    showToast(message, 'success', duration)
  }, [showToast])

  const error = useCallback((message: string, duration = 7000) => {
    showToast(message, 'error', duration)
  }, [showToast])

  const warning = useCallback((message: string, duration = 6000) => {
    showToast(message, 'warning', duration)
  }, [showToast])

  const info = useCallback((message: string, duration = 5000) => {
    showToast(message, 'info', duration)
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
