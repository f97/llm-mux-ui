/**
 * OAuth PostMessage Handler
 */

import type { OAuthCallbackMessage } from '../api/types'

const ALLOWED_ORIGINS = new Set([
  'http://localhost:8318',
  'http://localhost:54545', // claude
  'http://localhost:1455',  // codex
  'http://localhost:8085',  // gemini
  'http://localhost:51121', // antigravity
  'http://localhost:11451', // iflow
  typeof window !== 'undefined' ? window.location.origin : '',
])

export function isOAuthCallbackMessage(data: unknown): data is OAuthCallbackMessage {
  if (typeof data !== 'object' || data === null) return false
  const msg = data as Record<string, unknown>
  return (
    msg.type === 'oauth-callback' &&
    typeof msg.provider === 'string' &&
    typeof msg.state === 'string' &&
    (msg.status === 'success' || msg.status === 'error')
  )
}

export function addAllowedOrigin(origin: string): void {
  if (origin) ALLOWED_ORIGINS.add(origin)
}

export interface OAuthMessageHandlerOptions {
  expectedState: string
  onSuccess: (provider: string) => void
  onError: (provider: string, error: string) => void
}

/**
 * Create OAuth message handler with origin validation
 */
export function createOAuthMessageHandler(
  options: OAuthMessageHandlerOptions
): () => void {
  const { expectedState, onSuccess, onError } = options

  const handler = (event: MessageEvent): void => {
    if (!ALLOWED_ORIGINS.has(event.origin)) return
    if (!isOAuthCallbackMessage(event.data)) return
    if (event.data.state !== expectedState) return

    if (event.data.status === 'success') {
      onSuccess(event.data.provider)
    } else {
      onError(event.data.provider, event.data.error || 'Unknown error')
    }
  }

  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}

/**
 * Open OAuth popup window
 */
export function openOAuthPopup(url: string): Window | null {
  const width = 600
  const height = 700
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2
  return window.open(
    url,
    'oauth-popup',
    `width=${width},height=${height},left=${left},top=${top},popup=yes,scrollbars=yes,resizable=yes`
  )
}

/**
 * Monitor popup window close
 */
export function monitorPopupClose(popup: Window, onClose: () => void): () => void {
  const interval = setInterval(() => {
    if (popup.closed) {
      clearInterval(interval)
      onClose()
    }
  }, 500)
  return () => clearInterval(interval)
}
