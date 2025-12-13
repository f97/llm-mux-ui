/**
 * Settings API types
 */

/**
 * Debug mode response
 */
export interface DebugResponse {
  debug: boolean
}

/**
 * Logging to file response
 */
export interface LoggingToFileResponse {
  'logging-to-file': boolean
}

/**
 * Usage statistics enabled response
 */
export interface UsageStatisticsEnabledResponse {
  'usage-statistics-enabled': boolean
}

/**
 * Proxy URL response
 */
export interface ProxyUrlResponse {
  'proxy-url': string
}

/**
 * Switch project setting response
 */
export interface SwitchProjectResponse {
  'switch-project': boolean
}

/**
 * Switch preview model setting response
 */
export interface SwitchPreviewModelResponse {
  'switch-preview-model': boolean
}

/**
 * Request log response
 */
export interface RequestLogResponse {
  'request-log': boolean
}

/**
 * WebSocket authentication response
 */
export interface WsAuthResponse {
  'ws-auth': boolean
}

/**
 * Request retry count response
 */
export interface RequestRetryResponse {
  'request-retry': number
}

/**
 * Max retry interval response
 */
export interface MaxRetryIntervalResponse {
  'max-retry-interval': number
}

/**
 * Aggregated settings for UI display
 */
export interface AllSettings {
  debug: boolean
  'logging-to-file': boolean
  'usage-statistics-enabled': boolean
  'proxy-url': string
  'switch-project': boolean
  'switch-preview-model': boolean
  'request-log': boolean
  'ws-auth': boolean
  'request-retry': number
  'max-retry-interval': number
}
