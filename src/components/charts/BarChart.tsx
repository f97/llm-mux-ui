import { useId, useMemo } from 'react'

export interface BarChartProps {
  data: Record<string, number> // label -> value
  title?: string
  className?: string
  formatValue?: (value: number) => string
  color?: string
  showValues?: boolean
}

export function BarChart({
  data,
  title,
  className = '',
  formatValue = defaultFormatValue,
  color = 'rgb(99, 102, 241)',
  showValues = false,
}: BarChartProps) {
  const gradientId = useId()

  const chartData = useMemo(() => {
    const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b))

    if (entries.length === 0) {
      return { bars: [], maxValue: 0, labels: [] }
    }

    const values = entries.map(([, value]) => value)
    const maxValue = Math.max(...values, 1)

    const bars = entries.map(([label, value]) => ({
      label: formatLabel(label),
      originalLabel: label,
      value,
      percentage: (value / maxValue) * 100,
    }))
    
    const labels = bars.map(b => b.label)

    return { bars, maxValue, labels }
  }, [data])

  if (chartData.bars.length === 0) {
    return (
      <div className={`h-64 flex items-center justify-center ${className}`}>
        <div className="text-center text-(--text-tertiary)">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    )
  }

  // Layout constants
  // We calculate width dynamically based on 100% width in SVG

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium text-(--text-secondary) mb-3">{title}</h4>
      )}
      
      {/* 
        ROBUST LAYOUT FIX:
        Use CSS Grid to ensure Y-Axis and Chart Area share exact same height.
        - Rows: [1fr] for chart content, [auto] for X-axis labels
        - Cols: [3rem] for Y-axis labels, [1fr] for graph
      */}
      <div className="grid grid-cols-[3rem_1fr] grid-rows-[1fr_auto] h-64 gap-x-2">
        
        {/* Cell 1,1: Y-axis labels */}
        <div className="relative w-full h-full border-r border-transparent">
           {/* Inner wrapper with padding to align 0% and 100% perfectly with graph stroke */}
          <div className="absolute top-2 bottom-2 left-0 right-0">
             {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
              <span
                key={ratio}
                className="absolute right-0 text-xs text-(--text-tertiary) select-none transform -translate-y-1/2"
                style={{ top: `${(1 - ratio) * 100}%` }}
              >
                {formatValue(chartData.maxValue * ratio)}
              </span>
            ))}
          </div>
        </div>

        {/* Cell 1,2: Chart Area */}
        <div className="relative w-full h-full min-w-0">
          {/* Same padding as Y-axis wrapper to ensure alignment */}
          <div className="absolute top-2 bottom-2 left-0 right-0">
             {/* Grid Lines */}
             <div className="absolute inset-0 w-full h-full pointer-events-none">
                {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                  <div 
                    key={ratio} 
                    className="absolute left-0 w-full h-px bg-(--border-color)/40 dashed"
                    style={{ top: `${(1 - ratio) * 100}%` }}
                  />
                ))}
             </div>

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
              role="img"
              aria-label={title || 'Bar chart'}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Bars */}
              {chartData.bars.map((bar, index) => {
                const totalBars = chartData.bars.length
                // Calculate bar width and position as percentages
                // Gap is 20% of slot width, Bar is 80%
                const slotWidth = 100 / totalBars
                const barWidth = slotWidth * 0.7
                const gap = slotWidth * 0.15 // side gap
                const x = (index * slotWidth) + gap
                const barHeight = bar.percentage // 0 to 100
                const y = 100 - barHeight

                return (
                  <g key={bar.label}>
                    <rect
                      x={`${x}%`}
                      y={`${y}%`}
                      width={`${barWidth}%`}
                      height={`${barHeight}%`}
                      fill={`url(#${gradientId})`}
                      rx="2" // slight rounded corners
                      className="transition-opacity hover:opacity-80 cursor-pointer"
                    >
                      <title>{`${bar.label}: ${formatValue(bar.value)}`}</title>
                    </rect>
                    
                    {/* Value text above bar (optional) */}
                    {showValues && bar.value > 0 && (
                      // Note: SVG text scaling is tricky here. 
                      // Better to rely on tooltips or use foreignObject if really needed.
                      // For now, let's skip on-chart text to keep it clean, or use simple title hover.
                      null
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Cell 2,2: X-axis labels (Spans only the graph column) */}
        <div className="col-start-2 relative h-6 mt-2 w-full select-none">
          {chartData.bars.map((bar, index) => {
            const total = chartData.bars.length
            const slotWidth = 100 / total
            const centerPercent = (index * slotWidth) + (slotWidth / 2)
            
            // Smart hiding logic
            const showLabel = total <= 10 || index % Math.ceil(total / 7) === 0
            
            if (!showLabel) return null

            return (
              <span
                key={bar.label}
                className="absolute top-0 text-[10px] sm:text-xs text-(--text-tertiary) whitespace-nowrap -translate-x-1/2"
                style={{ left: `${centerPercent}%` }}
              >
                {bar.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Helper to format labels (time/date)
function formatLabel(key: string): string {
  // If it's a date string (YYYY-MM-DD)
  if (key.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = new Date(key)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  // If it's an hour string (HH)
  if (key.match(/^\d{1,2}$/)) {
    const hour = parseInt(key, 10)
    if (hour === 0) return '12am'
    if (hour === 12) return '12pm'
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`
  }

  // If it's a datetime string
  if (key.includes('T') || key.includes(' ')) {
    const date = new Date(key)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return key.length > 8 ? key.substring(0, 8) : key
}

// Default number formatter
function defaultFormatValue(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return Math.round(value).toString()
}
