/**
 * Usage statistics React Query hooks
 */

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { usageApi } from '../endpoints'

/**
 * Usage statistics hook with auto-refresh
 */
export const useUsageStats = (autoRefresh = true) =>
  useQuery({
    queryKey: queryKeys.usageStats(),
    queryFn: () => usageApi.getStats(),
    refetchInterval: autoRefresh ? 30000 : false, // Auto-refresh every 30 seconds
  })
