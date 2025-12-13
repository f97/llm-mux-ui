/**
 * Usage statistics endpoints
 */

import { apiClient } from '../client'
import type { UsageResponse } from '../types'

/**
 * Usage statistics endpoints
 */
export const usageApi = {
  /**
   * Get usage statistics
   */
  getStats: () => apiClient.get<UsageResponse>('/usage'),
}
