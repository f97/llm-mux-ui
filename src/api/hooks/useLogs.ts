/**
 * Logs React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { logsApi, errorLogsApi } from '../endpoints'
import type { LogsQueryParams } from '../types'

/**
 * Server logs hook with auto-refresh
 */
export const useServerLogs = (params?: LogsQueryParams, autoRefresh = true) =>
  useQuery({
    queryKey: queryKeys.serverLogs(params?.after, params?.limit),
    queryFn: () => logsApi.get(params),
    refetchInterval: autoRefresh ? 15000 : false, // Auto-refresh every 15 seconds
  })

/**
 * Clear server logs mutation
 */
export const useClearLogs = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logsApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.logs })
    },
  })
}

/**
 * Error log files hook
 */
export const useErrorLogFiles = () =>
  useQuery({
    queryKey: queryKeys.errorLogFiles(),
    queryFn: () => errorLogsApi.list(),
  })

/**
 * Download error log file hook
 */
export const useDownloadErrorLog = (name: string, enabled = false) =>
  useQuery({
    queryKey: queryKeys.errorLog(name),
    queryFn: () => errorLogsApi.download(name),
    enabled,
  })
