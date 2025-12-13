import { useEffect } from 'react'

import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

const variantConfig: Record<ToastVariant, {
  icon: string
  iconColor: string
  borderColor: string
}> = {
  success: {
    icon: 'check_circle',
    iconColor: 'text-(--success-text)',
    borderColor: 'border-l-(--success-text)',
  },
  error: {
    icon: 'error',
    iconColor: 'text-(--danger-text)',
    borderColor: 'border-l-(--danger-text)',
  },
  warning: {
    icon: 'warning',
    iconColor: 'text-(--warning-text)',
    borderColor: 'border-l-(--warning-text)',
  },
  info: {
    icon: 'info',
    iconColor: 'text-(--text-secondary)',
    borderColor: 'border-l-(--text-secondary)',
  },
}

export function ToastItem({ toast, onClose }: ToastItemProps) {
  const { icon, iconColor, borderColor } = variantConfig[toast.variant]

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={cn(
        // Base styles - dark theme card
        'flex items-center gap-3 px-4 py-3 rounded-lg',
        'bg-(--bg-card) border border-(--border-color)',
        // Left accent border
        'border-l-4',
        borderColor,
        // Shadow and animation
        'shadow-lg shadow-black/20',
        'animate-in slide-in-from-top-2 fade-in duration-200'
      )}
      role="alert"
    >
      <Icon name={icon} size="sm" className={iconColor} />
      <p className="text-sm text-(--text-primary) flex-1 truncate">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="p-1 text-(--text-tertiary) hover:text-(--text-primary) hover:bg-(--bg-hover) rounded transition-colors shrink-0"
        aria-label="Close notification"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}
