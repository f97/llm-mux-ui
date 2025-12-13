import { useState } from 'react'
import { type AuthFile } from '../../../api/types'
import { cn } from '../../../lib/cn'
import { Icon } from '../../ui/Icon'
import { Modal, ModalFooter } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { getProviderConfig } from '../../../lib/providers'
import { useProviderCard } from './useProviderCard'

interface ProviderCardProps {
  provider: AuthFile
  usage?: {
    total_requests: number
    total_tokens: number
  }
  onRefresh?: () => void
  onDisconnect?: () => void
  onToggleDisabled?: () => void
  isRefreshing?: boolean
}

const formatTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

export function ProviderCard({ provider, usage, onRefresh, onDisconnect, onToggleDisabled, isRefreshing = false }: ProviderCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const { 
    displayName, 
    isProviderOn, 
    hasError, 
    getBadgeClasses, 
    getBadgeText, 
    shouldShowPulse 
  } = useProviderCard({ provider, usage });

  const providerConfig = getProviderConfig(provider.source || '')
  const brandColor = providerConfig.color

  // Toggle handler
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleDisabled?.()
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    onDisconnect?.()
    setIsDeleteModalOpen(false)
  }

  return (
    <>
      <div 
        className={cn(
          'group relative flex flex-col rounded-xl border border-(--border-color) bg-(--bg-card) p-5 transition-all',
          provider.disabled ? 'opacity-75' : 'hover:shadow-sm'
        )}
        style={{
          '--brand-color': brandColor
        } as React.CSSProperties}
      >
        {/* Hover Border Effect using pseudo-element or direct style if supported, 
            but for cleanliness we'll stick to a colored top border or simple hover border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--brand-color)] pointer-events-none transition-colors opacity-10" />

        {/* 1. Header: Logo + Name + Status */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div 
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border border-(--border-color) overflow-hidden transition-colors",
                !providerConfig.logoUrl && "font-bold text-(--text-tertiary)"
              )}
              style={{ backgroundColor: `${brandColor}10` }}
            >
              {providerConfig.logoUrl ? (
                <img 
                  src={providerConfig.logoUrl} 
                  alt={displayName} 
                  className="h-6 w-6 object-contain"
                  onError={(e) => {
                    // Fallback if image fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-(--bg-hover)', 'font-bold', 'text-(--text-tertiary)');
                    e.currentTarget.parentElement!.innerText = displayName.charAt(0);
                  }}
                />
              ) : (
                <span style={{ color: brandColor }}>{displayName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-(--text-primary)">{displayName}</h3>
              <p className="text-xs text-(--text-secondary) truncate max-w-[150px]" title={provider.email || provider.label || provider.name}>
                {provider.email || provider.label || provider.name}
              </p>
            </div>
          </div>

          {/* Compact animated badge */}
          <div className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border',
            getBadgeClasses()
          )}>
            {shouldShowPulse ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--success-text)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--success-text)' }}></span>
              </span>
            ) : (
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  hasError ? "[color:var(--danger-text)]" : "[color:var(--text-secondary)]"
                )} style={{ backgroundColor: hasError ? 'var(--danger-text)' : 'var(--text-secondary)' }}></span>
              </span>
            )}
            {getBadgeText()}
          </div>
        </div>

        {/* Error/Status message */}
        {provider.status_message && (provider.status === 'error' || provider.unavailable) && (
          <div className="bg-(--danger-bg) p-2 rounded-md border border-(--danger-text)/20 mb-4">
            <p className="text-xs text-(--danger-text) font-medium flex items-center gap-1">
              <Icon name="error" size="sm" /> {provider.status_message}
            </p>
          </div>
        )}

        {/* Warning for disabled state */}
        {provider.disabled && (
          <div className="bg-(--warning-bg) p-2 rounded-md border border-(--warning-text)/20 mb-4">
            <p className="text-xs text-(--warning-text) font-medium flex items-center gap-1">
              <Icon name="info" size="sm" /> Provider is disabled and won't be used
            </p>
          </div>
        )}

        {/* 2. HERO STATS (Always show, with placeholder if no data) */}
        <div className="mb-6 grid grid-cols-2 gap-8 border-l-2 border-(--border-color) pl-6 ml-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-(--text-secondary) font-medium">Requests</p>
            {usage ? (
              <p className="mt-1 text-3xl font-mono font-bold text-(--text-primary) tracking-tighter">
                {formatNumber(usage.total_requests || 0)}
              </p>
            ) : (
              <p className="mt-1 text-xl font-mono text-(--text-tertiary)">—</p>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-(--text-secondary) font-medium">Tokens</p>
            {usage ? (
              <p className="mt-1 text-3xl font-mono font-bold text-(--text-primary) tracking-tighter">
                {formatNumber(usage.total_tokens || 0)}
              </p>
            ) : (
              <p className="mt-1 text-xl font-mono text-(--text-tertiary)">—</p>
            )}
          </div>
        </div>

        {/* 3. Footer Meta (Compact row) */}
        <div className="mt-auto flex items-center gap-4 border-t border-(--border-color)/50 pt-4 text-[10px] text-(--text-secondary) font-mono">
          <div className="flex items-center gap-1">
            <span className="uppercase">Source:</span>
            <span className="text-(--text-primary) capitalize">{provider.source || 'file'}</span>
          </div>
          <div className="h-3 w-px bg-(--border-color)"></div>
          <div>Updated {formatTime(provider.updated_at)}</div>
          {provider.created_at && (
            <>
              <div className="h-3 w-px bg-(--border-color)"></div>
              <div>Created {formatTime(provider.created_at)}</div>
            </>
          )}
        </div>

        {/* 4. Action Bar (Single line) */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={provider.disabled || isRefreshing}
            className={cn(
              'flex-1 rounded-md bg-(--bg-hover) py-2 text-xs font-medium transition-colors border border-(--border-color)',
              provider.disabled || isRefreshing
                ? 'text-(--text-tertiary) cursor-not-allowed'
                : 'text-(--text-primary) hover:bg-(--border-hover) hover:text-(--text-primary)'
            )}
          >
            {isRefreshing ? (
              <>
                <Icon name="progress_activity" size="sm" className="inline mr-1 animate-spin" />
                Refreshing...
              </>
            ) : provider.status === 'expired' ? (
              <>
                <Icon name="key" size="sm" className="inline mr-1" />
                Reconnect
              </>
            ) : (
              <>
                <Icon name="refresh" size="sm" className="inline mr-1" />
                Refresh
              </>
            )}
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-(--border-color)">
            {/* Toggle with proper colors */}
            {onToggleDisabled && (
              <button
                type="button"
                onClick={handleToggle}
                className={cn(
                  'h-5 w-9 rounded-full p-0.5 cursor-pointer transition-colors relative',
                  !isProviderOn && 'bg-(--text-tertiary)'
                )}
                style={{ 
                  backgroundColor: isProviderOn ? brandColor : undefined 
                }}
                title={isProviderOn ? 'Disable provider' : 'Enable provider'}
                aria-label={isProviderOn ? 'Disable provider' : 'Enable provider'}
                aria-checked={isProviderOn}
                role="switch"
              >
                <div className={cn(
                  'h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform',
                  isProviderOn ? 'translate-x-4' : 'translate-x-0'
                )} />
              </button>
            )}

            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-2 text-(--text-secondary) hover:text-(--danger-text) transition-colors"
              title="Remove provider"
            >
              <Icon name="delete" size="sm" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Disconnect Provider"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-(--warning-bg) p-4 rounded-lg border border-(--warning-text)/20">
            <Icon name="warning" className="text-(--warning-text)" size="lg" />
            <div className="text-sm text-(--text-primary)">
              <p className="font-semibold text-(--warning-text) mb-1">Warning</p>
              Are you sure you want to disconnect <strong>{displayName}</strong>? This action cannot be undone.
            </div>
          </div>
          
          <p className="text-sm text-(--text-secondary)">
            This will remove the API key and configuration from your local storage. Usage history might be preserved if you reconnect later.
          </p>

          <ModalFooter className="px-0 pb-0 pt-4 border-0">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Disconnect
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </>
  )
}
