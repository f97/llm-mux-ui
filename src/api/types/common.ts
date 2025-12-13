/**
 * Common API types shared across all endpoints
 */

/**
 * Standard API error response
 */
export interface ApiError {
  error: string
  message?: string
  statusCode?: number
}

/**
 * Standard success response
 */
export interface StatusOkResponse {
  status: 'ok'
}

/**
 * Authentication configuration for API client
 */
export interface AuthConfig {
  bearerToken?: string
  managementKey?: string
}

/**
 * Generic setting update request
 */
export interface SettingUpdateRequest<T> {
  value: T
}
