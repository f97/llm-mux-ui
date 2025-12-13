import { useId, useMemo } from 'react'

export interface TrafficChartProps {
  data: Record<string, number> // hour/day -> count
  title?: string
  className?: string
}

export function TrafficChart({ data, title, className = '' }: TrafficChartProps) {
  const gradientId = useId()

  const chartData = useMemo(() => {
    const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b))

    if (entries.length === 0) {
      return { points: [], maxValue: 0, labels: [] }
    }

    const values = entries.map(([, value]) => value)
    const maxValue = Math.max(...values, 1)

    // Create labels
    const labels = entries.map(([key]) => formatLabel(key))

    return { points: entries, maxValue, labels }
  }, [data])

  const points = useMemo(() => {
    if (chartData.points.length === 0) return []
    return chartData.points.map(([, value], index) => {
      // x: 0 to 100
      const x = (index / (chartData.points.length - 1 || 1)) * 100
      // y: 0 to 100 (inverted for SVG)
      const y = 100 - (value / chartData.maxValue) * 100
      return { x, y, value }
    })
  }, [chartData])

  const linePath = useMemo(() => {
    if (points.length === 0) return ''
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

    // Start
    let path = `M ${points[0].x} ${points[0].y}`

    // Bezier curves
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]
      const next = points[i + 1]
      const controlPointX = (current.x + next.x) / 2

      path += ` C ${controlPointX} ${current.y}, ${controlPointX} ${next.y}, ${next.x} ${next.y}`
    }

    return path
  }, [points])

  const areaPath = useMemo(() => {
    if (points.length === 0) return ''
    return `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`
  }, [linePath, points])

  // Render Empty State
  if (chartData.points.length === 0) {
    return (
      <div className={`h-64 flex items-center justify-center ${className}`}>
        <div className="text-center text-(--text-tertiary)">
          <p className="text-sm">No traffic data available</p>
        </div>
      </div>
    )
  }

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
                {formatNumber(chartData.maxValue * ratio)}
              </span>
            ))}
          </div>
        </div>

        {/* Cell 1,2: Main Chart Area */}
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

            {/* SVG Graph */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
              role="img"
              aria-label={title || 'Traffic chart'}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              <path
                d={areaPath}
                fill={`url(#${gradientId})`}
                className="transition-all duration-300 ease-in-out"
              />

              <path
                d={linePath}
                fill="none"
                stroke="rgb(99, 102, 241)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-in-out"
              />
              
               {points.map((point, index) => (
                <circle
                  key={point.x}
                  cx={point.x}
                  cy={point.y}
                  r="0"
                  className="stroke-[rgb(99,102,241)] stroke-2 fill-white opacity-0 hover:opacity-100 hover:r-[4px] transition-all cursor-crosshair"
                >
                   <title>{`${chartData.labels[index]}: ${point.value.toLocaleString()} requests`}</title>
                </circle>
              ))}
            </svg>
          </div>
        </div>

        {/* Cell 2,2: X-axis labels (Spans only the graph column) */}
        {/* Placed in separate grid row to not affect graph height */}
        <div className="col-start-2 relative h-6 mt-2 w-full select-none">
          {chartData.labels.map((label, index) => {
            if (!label) return null
            
            const total = chartData.labels.length
            const step = Math.ceil(total / 7)
            const show = index === 0 || index === total - 1 || index % step === 0
            
            if (!show) return null

            const leftPercent = (index / (total - 1 || 1)) * 100
            
            let translateX = '-translate-x-1/2'
            if (index === 0) translateX = '-translate-x-0'
            if (index === total - 1) translateX = '-translate-x-full'

            return (
              <span
                key={label}
                className={`absolute top-0 text-[10px] sm:text-xs text-(--text-tertiary) whitespace-nowrap ${translateX}`}
                style={{ left: `${leftPercent}%` }}
              >
                {label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatLabel(key: string): string {
  if (key.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = new Date(key)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  if (key.match(/^\d{1,2}$/)) {
    const hour = parseInt(key, 10)
    return `${hour}:00`
  }
  if (key.includes('T') || key.includes(' ')) {
    const date = new Date(key)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  return key
}

function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return Math.round(value).toString()
}
