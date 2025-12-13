import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { useUsageStats } from '../api/hooks/useUsage'
import { BarChart, DonutChart } from '../components/charts'
import { ChartSkeleton, DonutSkeleton, TableSkeleton } from '../components/features/analytics/ChartSkeleton'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icon'
import { getChartColor, getProviderConfig } from '../lib/providers'
import { formatNumber } from '../lib/utils'

export const Route = createFileRoute('/analytics')({
  component: AnalyticsPage,
})

type TimePeriod = 'hour' | 'day'

function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('day')

  // Fetch usage data
  const { data: usageData, isLoading, error, refetch } = useUsageStats()

  // Calculate stats from usage data
  const stats = useMemo(() => {
    if (!usageData?.usage) {
      return {
        totalRequests: 0,
        successRate: 0,
        totalTokens: 0,
        failedRequests: 0,
      }
    }

    const { total_requests, success_count, total_tokens, failure_count } = usageData.usage
    const successRate = total_requests > 0 ? (success_count / total_requests) * 100 : 0

    return {
      totalRequests: total_requests,
      successRate,
      totalTokens: total_tokens,
      failedRequests: failure_count || 0,
    }
  }, [usageData])

  // Get chart data based on selected period
  const requestsChartData = useMemo(() => {
    if (!usageData?.usage) return {}
    return timePeriod === 'hour'
      ? usageData.usage.requests_by_hour || {}
      : usageData.usage.requests_by_day || {}
  }, [usageData, timePeriod])

  // Calculate tokens by provider for donut chart
  const tokensByProvider = useMemo(() => {
    if (!usageData?.usage?.apis) return []

    const providerTokens: Array<{ label: string; value: number; color?: string }> = []

    for (const [providerKey, apiUsage] of Object.entries(usageData.usage.apis)) {
      if (apiUsage.total_tokens > 0) {
        const config = getProviderConfig(providerKey)
        providerTokens.push({
          label: config.name,
          value: apiUsage.total_tokens,
          color: config.color,
        })
      }
    }

    // Sort by value descending
    providerTokens.sort((a, b) => b.value - a.value)

    // If more than 5 providers, aggregate the rest into "Others"
    if (providerTokens.length > 5) {
      const top4 = providerTokens.slice(0, 4)
      const othersTotal = providerTokens.slice(4).reduce((sum, p) => sum + p.value, 0)
      return [
        ...top4,
        { label: 'Others', value: othersTotal, color: '#6b7280' },
      ]
    }

    return providerTokens
  }, [usageData])

  // Calculate tokens by model for table
  const modelStats = useMemo(() => {
    if (!usageData?.usage?.apis) return []

    const models: Array<{
      name: string
      provider: string
      providerDisplayName: string
      requests: number
      tokens: number
      failedRequests: number
    }> = []

    for (const [providerKey, apiUsage] of Object.entries(usageData.usage.apis)) {
      if (!apiUsage.models) continue

      const providerConfig = getProviderConfig(providerKey)

      for (const [modelName, modelUsage] of Object.entries(apiUsage.models)) {
        const failedRequests = modelUsage.details?.filter(d => d.failed).length || 0

        models.push({
          name: modelName,
          provider: providerKey,
          providerDisplayName: providerConfig.name,
          requests: modelUsage.total_requests || 0,
          tokens: modelUsage.total_tokens || 0,
          failedRequests,
        })
      }
    }

    // Sort by requests descending
    return models.sort((a, b) => b.requests - a.requests).slice(0, 10)
  }, [usageData])

  // Calculate requests by provider for distribution chart
  const requestsByProvider = useMemo(() => {
    if (!usageData?.usage?.apis) return []

    const providerRequests: Array<{ label: string; value: number; color?: string }> = []

    for (const [providerKey, apiUsage] of Object.entries(usageData.usage.apis)) {
      if (apiUsage.total_requests > 0) {
        const config = getProviderConfig(providerKey)
        providerRequests.push({
          label: config.name,
          value: apiUsage.total_requests,
          color: config.color,
        })
      }
    }

    providerRequests.sort((a, b) => b.value - a.value)

    if (providerRequests.length > 5) {
      const top4 = providerRequests.slice(0, 4)
      const othersTotal = providerRequests.slice(4).reduce((sum, p) => sum + p.value, 0)
      return [
        ...top4,
        { label: 'Others', value: othersTotal, color: '#6b7280' },
      ]
    }

    return providerRequests
  }, [usageData])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-(--text-primary)">
            Usage Statistics
          </h2>
          <p className="text-(--text-secondary) mt-1 text-sm">
            Monitor traffic, token usage, and performance across your LLM gateways.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-0.5 bg-(--bg-hover) rounded-lg border border-(--border-color)/50">
            <button
              type="button"
              onClick={() => setTimePeriod('hour')}
              className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                timePeriod === 'hour'
                  ? 'text-(--text-primary)'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              {timePeriod === 'hour' && (
                <motion.span
                  layoutId="analytics-period-pill"
                  className="absolute inset-0 bg-(--bg-card) shadow-sm border border-(--border-color)/50 rounded-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">24 Hours</span>
            </button>
            <button
              type="button"
              onClick={() => setTimePeriod('day')}
              className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                timePeriod === 'day'
                  ? 'text-(--text-primary)'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              {timePeriod === 'day' && (
                <motion.span
                  layoutId="analytics-period-pill"
                  className="absolute inset-0 bg-(--bg-card) shadow-sm border border-(--border-color)/50 rounded-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">7 Days</span>
            </button>
          </div>
          <Button variant="secondary" onClick={() => refetch()}>
            <Icon name="refresh" size="sm" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 border-l-4 border-(--danger-text) bg-(--danger-bg)">
          <div className="flex items-start gap-3">
            <Icon name="error" className="text-(--danger-text) mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-(--danger-text)">
                Failed to load analytics data
              </p>
              <p className="text-xs text-(--text-secondary) mt-1">
                {error.message || 'An error occurred while fetching data'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs font-medium text-(--danger-text) hover:underline"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStatCard
          label="Total Requests"
          value={formatNumber(stats.totalRequests)}
          icon="data_usage"
          isLoading={isLoading}
        />
        <AnalyticsStatCard
          label="Success Rate"
          value={stats.successRate > 0 ? `${stats.successRate.toFixed(1)}%` : '0%'}
          icon="check_circle"
          isLoading={isLoading}
          highlight={stats.successRate >= 99}
        />
        <AnalyticsStatCard
          label="Total Tokens"
          value={formatNumber(stats.totalTokens)}
          icon="token"
          isLoading={isLoading}
        />
        <AnalyticsStatCard
          label="Failed Requests"
          value={formatNumber(stats.failedRequests)}
          icon="error_outline"
          isLoading={isLoading}
          variant={stats.failedRequests > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests by Time Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-base font-semibold text-(--text-primary) mb-6">
            Requests {timePeriod === 'hour' ? 'by Hour' : 'by Day'}
          </h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : Object.keys(requestsChartData).length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-(--text-tertiary)">
                <Icon name="bar_chart" size="xl" className="mb-2" />
                <p className="text-sm">No request data available</p>
              </div>
            </div>
          ) : (
            <BarChart data={requestsChartData} />
          )}
        </Card>

        {/* Tokens by Provider Donut */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-(--text-primary) mb-4">
            Tokens by Provider
          </h3>
          {isLoading ? (
             <DonutSkeleton />
          ) : tokensByProvider.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-(--text-tertiary)">
                <Icon name="donut_large" size="xl" className="mb-2" />
                <p className="text-sm">No token data available</p>
              </div>
            </div>
          ) : (
            <DonutChart
              data={tokensByProvider}
              centerValue={formatNumber(stats.totalTokens)}
              centerLabel="Total"
              size="sm"
            />
          )}
        </Card>
      </div>

      {/* Provider Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Provider */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-(--text-primary) mb-4">
            Requests by Provider
          </h3>
          {isLoading ? (
            <div className="space-y-4">
               {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                     <div className="flex justify-between mb-2">
                        <div className="h-3 w-24 bg-(--bg-hover) rounded" />
                        <div className="h-3 w-12 bg-(--bg-hover) rounded" />
                     </div>
                     <div className="h-2 w-full bg-(--bg-hover) rounded-full" />
                  </div>
               ))}
            </div>
          ) : requestsByProvider.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center text-(--text-tertiary)">
                <Icon name="pie_chart" size="xl" className="mb-2" />
                <p className="text-sm">No request data available</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {requestsByProvider.map((provider, index) => {
                const percentage = stats.totalRequests > 0
                  ? (provider.value / stats.totalRequests) * 100
                  : 0
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-(--text-secondary) flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: provider.color || getChartColor(index) }}
                        />
                        {provider.label}
                      </span>
                      <span className="text-(--text-primary) font-medium font-mono">
                        {formatNumber(provider.value)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-(--bg-hover) rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: provider.color || getChartColor(index),
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Success/Failure Distribution */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-(--text-primary) mb-4">
            Request Success Rate
          </h3>
          {isLoading ? (
            <DonutSkeleton size="h-48" />
          ) : stats.totalRequests === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center text-(--text-tertiary)">
                <Icon name="check_circle" size="xl" className="mb-2" />
                <p className="text-sm">No request data available</p>
              </div>
            </div>
          ) : (
            <DonutChart
              data={[
                { label: 'Successful', value: stats.totalRequests - stats.failedRequests, color: '#10b981' },
                { label: 'Failed', value: stats.failedRequests, color: '#ef4444' },
              ]}
              centerValue={`${stats.successRate.toFixed(1)}%`}
              centerLabel="Success"
              size="sm"
            />
          )}
        </Card>
      </div>

      {/* Model Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-(--text-primary)">
            Top Models by Usage
          </h3>
          <Link to="/models">
            <Button variant="secondary" size="sm">
              View All Models
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : modelStats.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center text-(--text-tertiary)">
              <Icon name="model_training" size="xl" className="mb-2" />
              <p className="text-sm">No model usage data available</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-(--text-secondary) border-b border-(--border-color)">
                  <th className="pb-3 font-medium">Model</th>
                  <th className="pb-3 font-medium">Provider</th>
                  <th className="pb-3 font-medium text-right">Requests</th>
                  <th className="pb-3 font-medium text-right">Tokens</th>
                  <th className="pb-3 font-medium text-right">Failed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border-color)">
                {modelStats.map((model, index) => {
                  const config = getProviderConfig(model.provider)
                  return (
                    <tr key={index} className="hover:bg-(--bg-hover) transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-8 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: config.bgColor, color: config.color }}
                          >
                            {model.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-(--text-primary) font-medium truncate max-w-[200px]" title={model.name}>
                            {model.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-(--text-secondary)">{model.providerDisplayName}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-(--text-primary) font-mono">{formatNumber(model.requests)}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-(--text-primary) font-mono">{formatNumber(model.tokens)}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={model.failedRequests > 0 ? 'text-(--danger-text) font-mono' : 'text-(--text-tertiary) font-mono'}>
                          {model.failedRequests}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

interface AnalyticsStatCardProps {
  label: string
  value: string
  icon: string
  isLoading?: boolean
  highlight?: boolean
  variant?: 'default' | 'danger'
}

function AnalyticsStatCard({ label, value, icon, isLoading, highlight, variant = 'default' }: AnalyticsStatCardProps) {
  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-24 bg-(--bg-hover) rounded animate-pulse" />
          <div className="p-2 rounded-lg bg-(--bg-hover)">
            <Icon name={icon} size="md" className="text-(--text-tertiary)" />
          </div>
        </div>
        <div className="h-8 w-32 bg-(--bg-hover) rounded animate-pulse" />
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-(--text-secondary)">{label}</p>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-(--success-bg)' : variant === 'danger' ? 'bg-(--danger-bg)' : 'bg-(--bg-hover)'}`}>
          <Icon
            name={icon}
            size="md"
            className={highlight ? 'text-(--success-text)' : variant === 'danger' ? 'text-(--danger-text)' : 'text-(--text-tertiary)'}
          />
        </div>
      </div>
      <span className={`text-3xl font-semibold tracking-tight ${variant === 'danger' && value !== '0' ? 'text-(--danger-text)' : 'text-(--text-primary)'}`}>
        {value}
      </span>
    </Card>
  )
}
