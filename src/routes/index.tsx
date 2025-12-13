import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { useAuthFiles } from '../api/hooks/useAuthFiles'
import { useServerLogs } from '../api/hooks/useLogs'
import { useUsageStats } from '../api/hooks/useUsage'
import { TrafficChart } from '../components/charts/TrafficChart'
import { ActivityTable } from '../components/features/overview/ActivityTable'
import { ProviderStatusCard } from '../components/features/overview/ProviderStatusCard'
import { useDashboardStats } from '../components/features/overview/useDashboardStats'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icon'

export const Route = createFileRoute('/')({
  component: OverviewPage,
})

function OverviewPage() {
  const [chartPeriod, setChartPeriod] = useState<'hour' | 'day'>('hour')

  // Fetch data with auto-refresh
  const { data: usageData, isLoading: usageLoading, error: usageError, refetch: refetchUsage } = useUsageStats()
  const { data: authData, isLoading: authLoading, error: authError, refetch: refetchAuth } = useAuthFiles()
  const { data: logsData, isLoading: logsLoading, refetch: refetchLogs } = useServerLogs(
    { limit: 50 },
    true
  )

  // Use custom hook for dashboard logic
  const { stats, getChartData, topProviders } = useDashboardStats(usageData, authData)
  
  const chartData = useMemo(() => getChartData(chartPeriod), [getChartData, chartPeriod])

  // Handle manual refresh
  const handleRefreshAll = () => {
    refetchUsage()
    refetchAuth()
    refetchLogs()
  }

  // Format last update time
  const lastUpdate = useMemo(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-(--text-primary)">
            Overview
          </h2>
          <p className="text-(--text-secondary) mt-1 text-sm">
            Real-time usage metrics and system health.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-medium text-(--text-tertiary) uppercase tracking-wider">
            Last updated: {lastUpdate}
          </span>
          <button
            type="button"
            onClick={handleRefreshAll}
            className="p-1.5 hover:bg-(--bg-hover) rounded-md text-(--text-secondary) hover:text-(--text-primary) transition-colors border border-transparent hover:border-(--border-color)"
          >
            <Icon name="refresh" size="sm" />
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {(usageError || authError) && (
        <Card className="p-4 border-l-4 border-(--danger-text) bg-(--danger-bg)">
          <div className="flex items-start gap-3">
            <Icon name="error" className="text-(--danger-text) mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-(--danger-text)">
                Failed to load data
              </p>
              <p className="text-xs text-(--text-secondary) mt-1">
                {usageError?.message || authError?.message || 'An error occurred while fetching data'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefreshAll}
              className="text-xs font-medium text-(--danger-text) hover:underline"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="data_usage"
          label="Total Requests"
          value={formatNumber(stats.totalRequests)}
          isLoading={usageLoading}
        />
        <StatCard
          icon="check_circle"
          label="Success Rate"
          value={stats.successRate > 0 ? `${stats.successRate.toFixed(1)}%` : '0%'}
          isLoading={usageLoading}
        />
        <StatCard
          icon="hub"
          label="Active Providers"
          value={stats.activeProviders.toString()}
          suffix={`/${authData?.files?.length || 0}`}
          badge={stats.activeProviders > 0 ? 'Stable' : 'None'}
          isLoading={authLoading}
        />
        <StatCard
          icon="token"
          label="Total Tokens"
          value={formatNumber(stats.totalTokens)}
          isLoading={usageLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Volume Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-(--text-primary)">
              Traffic Volume
            </h3>
            <div className="flex gap-1 p-0.5 bg-(--bg-hover) rounded-lg border border-(--border-color)/50">
              <button
                type="button"
                onClick={() => setChartPeriod('hour')}
                className={`relative px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartPeriod === 'hour'
                    ? 'text-(--text-primary)'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
              >
                {chartPeriod === 'hour' && (
                  <motion.span
                    layoutId="traffic-period-pill"
                    className="absolute inset-0 bg-(--bg-card) shadow-sm border border-(--border-color)/50 rounded-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">24 Hours</span>
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('day')}
                className={`relative px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartPeriod === 'day'
                    ? 'text-(--text-primary)'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
              >
                {chartPeriod === 'day' && (
                  <motion.span
                    layoutId="traffic-period-pill"
                    className="absolute inset-0 bg-(--bg-card) shadow-sm border border-(--border-color)/50 rounded-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">7 Days</span>
              </button>
            </div>
          </div>
          {usageLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-(--text-tertiary)">
                <Icon name="cached" className="text-4xl mb-2 animate-spin" />
                <p className="text-sm">Loading chart data...</p>
              </div>
            </div>
          ) : (
            <TrafficChart data={chartData} />
          )}
        </Card>

        {/* Provider Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-(--text-primary)">
              Provider Status
            </h3>
            <Link
              to="/providers"
              className="text-(--text-secondary) text-xs font-medium hover:text-(--text-primary) transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {authLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-(--bg-hover)" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-(--bg-hover) rounded w-24" />
                        <div className="h-3 bg-(--bg-hover) rounded w-32" />
                      </div>
                    </div>
                    <div className="w-full h-px bg-(--border-color) mt-4" />
                  </div>
                ))}
              </>
            ) : topProviders.length > 0 ? (
              topProviders.map((provider) => (
                <ProviderStatusCard
                  key={provider.id}
                  provider={provider}
                  onRefresh={refetchAuth}
                />
              ))
            ) : (
              <div className="py-8 text-center text-(--text-tertiary)">
                <Icon name="cloud_off" className="text-3xl mb-2" />
                <p className="text-sm">No providers configured</p>
                <Link
                  to="/providers"
                  className="text-xs text-(--text-secondary) hover:text-(--text-primary) mt-2 inline-block"
                >
                  Add provider
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="p-6 border-b border-(--border-color) flex items-center justify-between">
          <h3 className="text-base font-semibold text-(--text-primary)">
            Recent Activity
          </h3>
          <Link
            to="/logs"
            className="text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors"
          >
            View All Logs
          </Link>
        </div>
        <div className="p-6">
          <ActivityTable logs={logsData?.lines || []} isLoading={logsLoading} />
        </div>
      </Card>
    </div>
  )
}

// Stat Card Component
interface StatCardProps {
  icon: string
  label: string
  value: string
  suffix?: string
  trend?: string
  trendUp?: boolean
  badge?: string
  isLoading?: boolean
}

function StatCard({ icon, label, value, suffix, trend, trendUp, badge, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-md bg-(--bg-hover) text-(--text-secondary)">
            <Icon name={icon} size="lg" className="opacity-50" />
          </div>
          <div className="h-6 w-12 bg-(--bg-hover) rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-(--bg-hover) rounded animate-pulse" />
          <div className="h-9 w-32 bg-(--bg-hover) rounded animate-pulse" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-md bg-(--bg-hover) text-(--text-secondary)">
          <Icon name={icon} size="lg" />
        </div>
        {trend && (
          <span
            className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp
                ? 'text-(--success-text) bg-(--success-bg)'
                : 'text-(--danger-text) bg-(--danger-bg)'
            }`}
          >
            <Icon name={trendUp ? 'trending_up' : 'trending_down'} size="sm" className="mr-0.5" />
            {trend}
          </span>
        )}
        {badge && (
          <span className="flex items-center text-(--text-secondary) text-xs font-semibold bg-(--bg-hover) px-2 py-0.5 rounded-full border border-(--border-color)/50">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-(--text-secondary) text-sm font-medium">{label}</p>
        <p className="text-3xl font-semibold text-(--text-primary) tracking-tight">
          {value}
          {suffix && <span className="text-(--text-tertiary) text-xl font-normal">{suffix}</span>}
        </p>
      </div>
    </Card>
  )
}

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
