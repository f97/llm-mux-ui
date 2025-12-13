/**
 * Logs API types
 */

/**
 * Server logs response
 */
export interface LogsResponse {
  lines: string[]
  'line-count': number
  'latest-timestamp': number
}

/**
 * Clear logs response
 */
export interface ClearLogsResponse {
  success: boolean
  message: string
  removed: number
}

/**
 * Error log file metadata
 */
export interface ErrorLogFile {
  name: string
  size: number
  modified: number
}

/**
 * Error log files response
 */
export interface ErrorLogFilesResponse {
  files: ErrorLogFile[]
}

/**
 * Logs query parameters
 */
export interface LogsQueryParams {
  after?: number
  limit?: number
}
