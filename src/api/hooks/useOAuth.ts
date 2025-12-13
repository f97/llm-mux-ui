/**
 * OAuth React Query Hooks - Unified API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { queryKeys } from '../queryKeys'
import { oauthApi, iflowAuthApi } from '../endpoints'
import {
  createOAuthMessageHandler,
  openOAuthPopup,
  monitorPopupClose,
} from '../../lib/oauth-message-handler'
import { OAuthStateManager, validateOAuthUrl, sanitizeOAuthError } from '../../lib/oauth-security'
import type {
  OAuthStartRequest,
  OAuthProvider,
  IFlowAuthRequest,
} from '../types'

// ============================================================================
// OAuth Start/Cancel Mutations
// ============================================================================

export function useOAuthStart() {
  return useMutation({
    mutationFn: (data: OAuthStartRequest) => oauthApi.start(data),
  })
}

export function useOAuthCancel() {
  return useMutation({
    mutationFn: (state: string) => oauthApi.cancel(state),
  })
}

export function useDeviceFlowStart() {
  return useMutation({
    mutationFn: (data: OAuthStartRequest) => oauthApi.start(data),
  })
}

// ============================================================================
// OAuth Status with PostMessage Integration
// ============================================================================

export function useOAuthStatus(
  state: string | null,
  options: {
    enabled?: boolean
    onSuccess?: (provider: string) => void
    onError?: (provider: string, error: string) => void
    pollingInterval?: number
  } = {}
) {
  const { enabled = false, onSuccess, onError, pollingInterval = 2000 } = options
  const [messageReceived, setMessageReceived] = useState(false)

  // PostMessage listener
  useEffect(() => {
    if (!state || !enabled) return

    return createOAuthMessageHandler({
      expectedState: state,
      onSuccess: (provider) => {
        setMessageReceived(true)
        onSuccess?.(provider)
      },
      onError: (provider, error) => {
        setMessageReceived(true)
        onError?.(provider, sanitizeOAuthError(error))
      },
    })
  }, [state, enabled, onSuccess, onError])

  // Server polling as fallback
  const query = useQuery({
    queryKey: queryKeys.oauthStatus(state || ''),
    queryFn: () => oauthApi.getStatus(state!),
    enabled: enabled && !!state && !messageReceived,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status && status !== 'pending') return false
      return pollingInterval
    },
    gcTime: 0,
  })

  // Handle polling completion
  useEffect(() => {
    if (!query.data || messageReceived) return
    const { status, provider, error } = query.data

    if (status === 'completed') {
      onSuccess?.(provider)
    } else if (status === 'failed' || status === 'expired' || status === 'cancelled') {
      onError?.(provider, sanitizeOAuthError(error || `OAuth ${status}`))
    }
  }, [query.data, messageReceived, onSuccess, onError])

  return { ...query, messageReceived }
}

// ============================================================================
// Device Flow Status
// ============================================================================

export function useDeviceFlowStatus(
  state: string | null,
  interval: number,
  enabled: boolean,
  options: {
    onSuccess?: (provider: string) => void
    onError?: (provider: string, error: string) => void
  } = {}
) {
  const { onSuccess, onError } = options

  const query = useQuery({
    queryKey: queryKeys.oauthStatus(state || ''),
    queryFn: () => oauthApi.getStatus(state!),
    enabled: enabled && !!state,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status && status !== 'pending') return false
      return interval * 1000
    },
    gcTime: 0,
  })

  useEffect(() => {
    if (!query.data) return
    const { status, provider, error } = query.data

    if (status === 'completed') {
      onSuccess?.(provider)
    } else if (status === 'failed' || status === 'expired' || status === 'cancelled') {
      onError?.(provider, error || `Device flow ${status}`)
    }
  }, [query.data, onSuccess, onError])

  return query
}

// ============================================================================
// Complete OAuth Flow Hook
// ============================================================================

export interface OAuthFlowState {
  isLoading: boolean
  error: string | null
  state: string | null
  startFlow: (provider: OAuthProvider, projectId?: string) => Promise<void>
  cancelFlow: () => void
}

export function useOAuthFlow(options: {
  onSuccess?: (provider: string) => void
  onError?: (provider: string, error: string) => void
} = {}): OAuthFlowState {
  const { onSuccess, onError } = options
  const queryClient = useQueryClient()

  const [state, setState] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentProvider, setCurrentProvider] = useState<string | null>(null)
  const popupRef = useRef<Window | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const startMutation = useOAuthStart()
  const cancelMutation = useOAuthCancel()

  const cleanup = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    popupRef.current = null
    setState(null)
    setCurrentProvider(null)
  }, [])

  const handleSuccess = useCallback((provider: string) => {
    popupRef.current?.close()
    queryClient.invalidateQueries({ queryKey: queryKeys.authFilesList() })
    OAuthStateManager.clearAll()
    cleanup()
    onSuccess?.(provider)
  }, [cleanup, onSuccess, queryClient])

  const handleError = useCallback((provider: string, err: string) => {
    popupRef.current?.close()
    setError(err)
    cleanup()
    onError?.(provider, err)
  }, [cleanup, onError])

  // Setup listeners when state changes
  useEffect(() => {
    if (!state || !popupRef.current || !currentProvider) return

    const messageCleanup = createOAuthMessageHandler({
      expectedState: state,
      onSuccess: handleSuccess,
      onError: handleError,
    })

    const popupCleanup = monitorPopupClose(popupRef.current, () => {
      if (state) {
        cancelMutation.mutate(state)
        cleanup()
      }
    })

    cleanupRef.current = () => {
      messageCleanup()
      popupCleanup()
    }

    return cleanupRef.current
  }, [state, currentProvider, handleSuccess, handleError, cancelMutation, cleanup])

  // Polling fallback
  useOAuthStatus(state, {
    enabled: !!state && !!popupRef.current,
    onSuccess: handleSuccess,
    onError: handleError,
  })

  const startFlow = useCallback(async (provider: OAuthProvider, projectId?: string) => {
    setError(null)
    cleanup()

    try {
      const response = await startMutation.mutateAsync({
        provider,
        project_id: projectId,
      })

      if (response.flow_type === 'device') {
        throw new Error('Device flow not supported in popup mode')
      }

      if (!response.auth_url || !validateOAuthUrl(response.auth_url)) {
        throw new Error('Invalid OAuth URL')
      }

      OAuthStateManager.store(response.state, provider)
      setCurrentProvider(provider)

      const popup = openOAuthPopup(response.auth_url)
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups.')
      }

      popupRef.current = popup
      setState(response.state)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start OAuth'
      setError(msg)
      onError?.(provider, msg)
    }
  }, [startMutation, cleanup, onError])

  const cancelFlow = useCallback(() => {
    if (state) cancelMutation.mutate(state)
    popupRef.current?.close()
    cleanup()
  }, [state, cancelMutation, cleanup])

  return {
    isLoading: startMutation.isPending || !!state,
    error,
    state,
    startFlow,
    cancelFlow,
  }
}

// ============================================================================
// iFlow Authentication
// ============================================================================

export function useIFlowAuth() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IFlowAuthRequest) => iflowAuthApi.authenticateWithCookie(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authFilesList() })
    },
  })
}
