/**
 * OAuth Error Categorization Utility
 */

export type OAuthErrorType = 'network' | 'auth_denied' | 'popup_blocked' | 'timeout' | 'expired' | 'unknown'

export interface CategorizedError {
  type: OAuthErrorType
  title: string
  message: string
  icon: string
  canRetry: boolean
}

export function categorizeOAuthError(error: string | Error): CategorizedError {
  const errorStr = error instanceof Error ? error.message : error
  const lowerError = errorStr.toLowerCase()

  if (lowerError.includes('fetch') || lowerError.includes('network') || lowerError.includes('connection')) {
    return {
      type: 'network',
      title: 'Connection Error',
      message: 'Unable to connect. Check your internet.',
      icon: 'wifi_off',
      canRetry: true
    }
  }

  if (lowerError.includes('denied') || lowerError.includes('rejected') || lowerError.includes('cancel')) {
    return {
      type: 'auth_denied',
      title: 'Authorization Denied',
      message: 'You cancelled the authorization.',
      icon: 'block',
      canRetry: true
    }
  }

  if (lowerError.includes('popup') || lowerError.includes('blocked')) {
    return {
      type: 'popup_blocked',
      title: 'Popup Blocked',
      message: 'Please allow popups for this site.',
      icon: 'open_in_new_off',
      canRetry: true
    }
  }

  if (lowerError.includes('timeout')) {
    return {
      type: 'timeout',
      title: 'Request Timeout',
      message: 'The request took too long.',
      icon: 'timer_off',
      canRetry: true
    }
  }

  if (lowerError.includes('expired')) {
    return {
      type: 'expired',
      title: 'Code Expired',
      message: 'Authorization code has expired.',
      icon: 'schedule',
      canRetry: true
    }
  }

  return {
    type: 'unknown',
    title: 'Authentication Failed',
    message: errorStr || 'An unexpected error occurred.',
    icon: 'error',
    canRetry: true
  }
}
