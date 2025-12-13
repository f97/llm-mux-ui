/**
 * Logs endpoints
 */

import { apiClient } from '../client'
import type {
  LogsResponse,
  ClearLogsResponse,
  ErrorLogFilesResponse,
  LogsQueryParams,
} from '../types'

/**
 * Server logs endpoints
 */
export const logsApi = {
  /**
   * Get server logs
   */
  get: (params?: LogsQueryParams) =>
    apiClient.get<LogsResponse>(
      '/logs',
      params as Record<string, string | number | boolean | undefined>
    ),

  /**
   * Clear all server logs
   */
  clear: () => apiClient.delete<ClearLogsResponse>('/logs'),
}

/**
 * Error logs endpoints
 */
export const errorLogsApi = {
  /**
   * List error log files
   */
  list: () => apiClient.get<ErrorLogFilesResponse>('/request-error-logs'),

  /**
   * Download specific error log file
   */
  download: (name: string) => apiClient.get<Blob>(`/request-error-logs/${name}`),
}
