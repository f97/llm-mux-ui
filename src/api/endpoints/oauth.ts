/**
 * OAuth authentication endpoints - Unified API
 */

import { apiClient } from '../client'
import type {
  OAuthStartRequest,
  OAuthStartResponse,
  OAuthStatusResponse,
  OAuthCancelResponse,
  IFlowAuthRequest,
  IFlowAuthResponse,
} from '../types'

/**
 * Unified OAuth API endpoints
 */
export const oauthApi = {
  /**
   * Start OAuth flow
   * POST /oauth/start
   */
  start: (data: OAuthStartRequest) =>
    apiClient.post<OAuthStartResponse>('/oauth/start', data),

  /**
   * Get OAuth flow status
   * GET /oauth/status/:state
   */
  getStatus: (state: string) =>
    apiClient.get<OAuthStatusResponse>(`/oauth/status/${state}`),

  /**
   * Cancel OAuth flow
   * POST /oauth/cancel/:state
   */
  cancel: (state: string) =>
    apiClient.post<OAuthCancelResponse>(`/oauth/cancel/${state}`),
}

/**
 * iFlow cookie authentication
 */
export const iflowAuthApi = {
  /**
   * Authenticate with iFlow cookie
   */
  authenticateWithCookie: (data: IFlowAuthRequest) =>
    apiClient.post<IFlowAuthResponse>('/iflow-auth-url', data),
}
