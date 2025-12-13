/**
 * Usage statistics types
 */

/**
 * Token breakdown details
 */
export interface TokenDetails {
  input_tokens: number
  output_tokens: number
  reasoning_tokens: number
  cached_tokens: number
  total_tokens: number
}

/**
 * Individual request detail from the API
 */
export interface RequestDetail {
  timestamp: string
  source: string  // email/account identifier
  auth_index: number
  tokens: TokenDetails
  failed: boolean
}

/**
 * Model usage statistics with per-request details
 */
export interface ModelUsage {
  total_requests: number
  total_tokens: number
  details?: RequestDetail[]  // Optional, may not always be present
}

/**
 * API usage statistics (per provider)
 */
export interface ApiUsage {
  total_requests: number
  total_tokens: number
  models: Record<string, ModelUsage>
}

/**
 * Usage statistics data
 */
export interface UsageStatistics {
  total_requests: number
  success_count: number
  failure_count: number
  total_tokens: number
  apis: Record<string, ApiUsage>
  requests_by_day: Record<string, number>
  requests_by_hour: Record<string, number>
  tokens_by_day: Record<string, number>
  tokens_by_hour: Record<string, number>
}

/**
 * Usage response
 */
export interface UsageResponse {
  usage: UsageStatistics
  failed_requests: number
}
