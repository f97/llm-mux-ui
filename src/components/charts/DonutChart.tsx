import { useMemo } from 'react'
import { getChartColor } from '../../lib/providers'

export interface DonutChartDataItem {
  label: string
  value: number
  color?: string
}

export interface DonutChartProps {
  data: DonutChartDataItem[]
  title?: string
  centerLabel?: string
  centerValue?: string
  className?: string
  formatValue?: (value: number) => string
  showLegend?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function DonutChart({
  data,
  title,
  centerLabel,
  centerValue,
  className = '',
  formatValue = defaultFormatValue,
  showLegend = true,
  size = 'md',
}: DonutChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) {
      return { segments: [], total: 0 }
    }

    const total = data.reduce((sum, item) => sum + item.value, 0)

    if (total === 0) {
      return { segments: [], total: 0 }
    }

    // Sort by value descending
    const sorted = [...data].sort((a, b) => b.value - a.value)

    // Calculate percentages and angles
    let currentAngle = 0
    const segments = sorted.map((item, index) => {
      const percentage = (item.value / total) * 100
      const angle = (item.value / total) * 360
      const startAngle = currentAngle
      currentAngle += angle

      return {
        ...item,
        color: item.color || getChartColor(index),
        percentage,
        startAngle,
        endAngle: currentAngle,
      }
    })

    return { segments, total }
  }, [data])

  if (chartData.segments.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center text-(--text-tertiary)">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    )
  }

  // Create conic gradient string
  const gradientStops = chartData.segments.map((segment) => {
    return `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`
  }).join(', ')

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  }

  const innerSizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
  }

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium text-(--text-secondary) mb-4">{title}</h4>
      )}

      <div className="flex flex-col items-center gap-6">
        {/* Donut */}
        <div className="relative">
          <div
            className={`${sizeClasses[size]} rounded-full`}
            style={{
              background: `conic-gradient(${gradientStops})`,
            }}
            role="img"
            aria-label={title || 'Donut chart showing data distribution'}
          />
          {/* Center hole */}
          <div
            className={`${innerSizeClasses[size]} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--bg-card) flex flex-col items-center justify-center`}
          >
            {centerValue && (
              <span className="text-2xl font-bold text-(--text-primary)">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-xs text-(--text-secondary)">
                {centerLabel}
              </span>
            )}
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="w-full space-y-2">
            {chartData.segments.map((segment) => (
              <div key={segment.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm text-(--text-secondary) truncate">
                    {segment.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium text-(--text-primary)">
                    {formatValue(segment.value)}
                  </span>
                  <span className="text-xs text-(--text-tertiary) w-12 text-right">
                    {segment.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Compact donut for inline display (no legend)
export function CompactDonut({
  data,
  size = 64,
  strokeWidth = 8,
  className = '',
}: {
  data: DonutChartDataItem[]
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const chartData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) return { segments: [], total: 0 }

    const sorted = [...data].sort((a, b) => b.value - a.value)
    let currentPercentage = 0

    const segments = sorted.map((item, index) => {
      const percentage = (item.value / total) * 100
      const start = currentPercentage
      currentPercentage += percentage

      return {
        ...item,
        color: item.color || getChartColor(index),
        percentage,
        dashArray: `${percentage} ${100 - percentage}`,
        dashOffset: 25 - start, // SVG circle starts at 3 o'clock, offset to start at 12
      }
    })

    return { segments, total }
  }, [data])

  if (chartData.segments.length === 0) {
    return null
  }

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <svg width={size} height={size} className={className} role="img" aria-label="Compact donut chart">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border-color)"
        strokeWidth={strokeWidth}
      />
      {/* Data segments */}
      {chartData.segments.map((segment) => (
        <circle
          key={segment.label}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={segment.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${(segment.percentage / 100) * circumference} ${circumference}`}
          strokeDashoffset={((segment.dashOffset) / 100) * circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all"
        >
          <title>{`${segment.label}: ${segment.percentage.toFixed(1)}%`}</title>
        </circle>
      ))}
    </svg>
  )
}

// Default number formatter
function defaultFormatValue(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toLocaleString()
}
