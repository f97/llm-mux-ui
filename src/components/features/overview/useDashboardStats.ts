import { useMemo } from 'react'
import { type UsageResponse } from '../../../api/types/usage'
import { type AuthFilesResponse } from '../../../api/types/auth-files'

export function useDashboardStats(
  usageData: UsageResponse | undefined,
  authData: AuthFilesResponse | undefined
) {
  // Calculate stats from usage data
  const stats = useMemo(() => {
    if (!usageData?.usage) {
      return {
        totalRequests: 0,
        successRate: 0,
        totalTokens: 0,
        activeProviders: 0,
      }
    }

    const { total_requests, success_count, total_tokens } = usageData.usage
    const successRate = total_requests > 0 ? (success_count / total_requests) * 100 : 0

    return {
      totalRequests: total_requests,
      successRate,
      totalTokens: total_tokens,
      activeProviders: authData?.files?.filter((f) =>
        (f.status === 'ok' || f.status === 'active' || f.status === 'connected') && !f.disabled && !f.unavailable
      ).length || 0,
    }
  }, [usageData, authData])

  // Get chart data
  const getChartData = (period: 'hour' | 'day') => {
    if (!usageData?.usage) return {}
    return period === 'hour'
      ? usageData.usage.requests_by_hour || {}
      : usageData.usage.requests_by_day || {}
  }

  // Filter providers to show (limit to 4 most recent)
  const topProviders = useMemo(() => {
    if (!authData?.files) return []
    return authData.files
      .filter((f) => !f.runtime_only)
      .sort((a, b) => {
        // Sort by status (ok first), then by last_refresh
        if (a.status === 'ok' && b.status !== 'ok') return -1
        if (a.status !== 'ok' && b.status === 'ok') return 1
        return (b.last_refresh || '').localeCompare(a.last_refresh || '')
      })
      .slice(0, 4)
  }, [authData])

  return {
    stats,
    getChartData,
    topProviders
  }
}
