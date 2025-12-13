/**
 * OAuth authentication types
 *
 * Unified OAuth API types for browser-based OAuth flows and device authorization flows.
 */

// ============================================================================
// Provider Types
// ============================================================================

/**
 * OAuth providers using browser-based authorization flow
 */
export type OAuthProvider =
  | 'claude'
  | 'codex'
  | 'gemini'
  | 'gemini-cli'
  | 'antigravity'
  | 'iflow'

/**
 * Providers using device authorization flow (RFC 8628)
 */
export type DeviceFlowProvider = 'qwen' | 'copilot'

/**
 * All supported OAuth providers
 */
export type AllOAuthProvider = OAuthProvider | DeviceFlowProvider

/**
 * OAuth flow lifecycle status
 */
export type OAuthFlowStatus = 'pending' | 'completed' | 'failed' | 'expired' | 'cancelled'

// ============================================================================
// OAuth API Types
// ============================================================================

/**
 * POST /oauth/start request
 */
export interface OAuthStartRequest {
  provider: AllOAuthProvider
  project_id?: string
}

/**
 * POST /oauth/start response
 */
export interface OAuthStartResponse {
  status: 'ok'
  flow_type?: 'oauth' | 'device' // Unified flow type
  
  // OAuth Flow Fields
  auth_url?: string
  code_verifier?: string
  
  // Device Flow Fields
  user_code?: string
  verification_url?: string
  verification_url_complete?: string
  expires_in?: number
  interval?: number
  
  // Common Fields
  state: string
  id: string
}

/**
 * GET /oauth/status/:state response
 */
export interface OAuthStatusResponse {
  status: OAuthFlowStatus
  state: string
  provider: string
  mode?: 'webui' | 'cli'
  error?: string
}

/**
 * POST /oauth/cancel/:state response
 */
export interface OAuthCancelResponse {
  status: 'ok'
}

// ============================================================================
// Device Flow Types
// ============================================================================

/**
 * POST /oauth/device-start request
 */
export interface DeviceFlowStartRequest {
  provider: DeviceFlowProvider
}

/**
 * POST /oauth/device-start response
 */
export interface DeviceFlowStartResponse {
  status: 'ok'
  user_code: string
  verification_url: string
  verification_url_complete: string
  state: string
  expires_in: number
  interval: number
}

// ============================================================================
// PostMessage Types
// ============================================================================

/**
 * OAuth callback message from popup window
 */
export interface OAuthCallbackMessage {
  type: 'oauth-callback'
  provider: string
  state: string
  status: 'success' | 'error'
  error?: string
}

// ============================================================================
// Error Types
// ============================================================================

export type OAuthErrorCode =
  | 'INVALID_PROVIDER'
  | 'STATE_NOT_FOUND'
  | 'CALLBACK_FAILED'
  | 'TOKEN_EXCHANGE_FAILED'
  | 'USER_DENIED'
  | 'TIMEOUT'

// ============================================================================
// iFlow Types
// ============================================================================

export interface IFlowAuthRequest {
  cookie: string
}

export interface IFlowAuthResponse {
  status: string
  saved_path: string
  email: string
  expired: string
  type: string
}
