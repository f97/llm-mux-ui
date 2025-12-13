import { useMemo } from 'react'

import { Badge } from '../../ui/Badge'
import { Icon } from '../../ui/Icon'

export interface ActivityTableProps {
  logs: string[]
  isLoading?: boolean
}

interface ParsedLog {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  raw: string
}

export function ActivityTable({ logs, isLoading }: ActivityTableProps) {
  const parsedLogs = useMemo(() => {
    return logs.slice(0, 10).map(parseLogLine)
  }, [logs])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-start gap-4 py-3 border-b border-(--border-color)">
            <div className="h-4 w-16 bg-(--bg-hover) rounded" />
            <div className="h-4 w-12 bg-(--bg-hover) rounded" />
            <div className="flex-1 h-4 bg-(--bg-hover) rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (parsedLogs.length === 0) {
    return (
      <div className="py-12 text-center text-(--text-tertiary)">
        <Icon name="history" className="text-4xl mb-2 mx-auto" />
        <p className="text-sm">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full divide-y divide-(--border-color)">
        {parsedLogs.map((log, index) => (
          <div
            key={index}
            className="flex items-start gap-4 py-3 hover:bg-(--bg-hover) transition-colors group"
          >
            {/* Timestamp */}
            <div className="flex-shrink-0 w-20 text-xs text-(--text-tertiary) font-mono">
              {log.timestamp}
            </div>

            {/* Log Level Badge */}
            <div className="flex-shrink-0">
              <LogLevelBadge level={log.level} />
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-(--text-primary) break-words">
                {log.message}
              </p>
            </div>

            {/* Expand icon */}
            <button
              className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-(--bg-card) text-(--text-secondary) hover:text-(--text-primary)"
              title="View full log"
            >
              <Icon name="open_in_new" size="sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Log level badge component
function LogLevelBadge({ level }: { level: ParsedLog['level'] }) {
  const config = {
    info: { variant: 'default' as const, icon: 'info', label: 'INFO' },
    warn: { variant: 'warning' as const, icon: 'warning', label: 'WARN' },
    error: { variant: 'danger' as const, icon: 'error', label: 'ERROR' },
    debug: { variant: 'info' as const, icon: 'bug_report', label: 'DEBUG' },
  }

  const { variant, label } = config[level]

  return (
    <Badge variant={variant} className="text-[10px] font-bold px-2">
      {label}
    </Badge>
  )
}

// Parse log line to extract timestamp, level, and message
function parseLogLine(logLine: string): ParsedLog {
  // Default values
  let timestamp = 'N/A'
  let level: ParsedLog['level'] = 'info'
  let message = logLine

  try {
    // Try to parse common log formats
    // Format 1: [2024-01-15T10:30:45Z] INFO: Message here
    const iso8601Match = logLine.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[Z]?)\]\s*(INFO|WARN|ERROR|DEBUG)?:?\s*(.+)/)
    if (iso8601Match) {
      timestamp = new Date(iso8601Match[1]).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
      level = (iso8601Match[2]?.toLowerCase() as ParsedLog['level']) || 'info'
      message = iso8601Match[3]
      return { timestamp, level, message, raw: logLine }
    }

    // Format 2: 2024-01-15 10:30:45 INFO Message here
    const dateTimeMatch = logLine.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s*(INFO|WARN|ERROR|DEBUG)?\s+(.+)/)
    if (dateTimeMatch) {
      timestamp = new Date(dateTimeMatch[1]).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
      level = (dateTimeMatch[2]?.toLowerCase() as ParsedLog['level']) || 'info'
      message = dateTimeMatch[3]
      return { timestamp, level, message, raw: logLine }
    }

    // Format 3: Just check for log level keywords
    const levelMatch = logLine.match(/\b(INFO|WARN|ERROR|DEBUG)\b/i)
    if (levelMatch) {
      level = levelMatch[1].toLowerCase() as ParsedLog['level']
    }

    // Try to extract timestamp from anywhere in the line
    const timeMatch = logLine.match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/)
    if (timeMatch) {
      timestamp = timeMatch[1]
    }

    // Check if message contains error/warning keywords
    if (!levelMatch) {
      if (logLine.toLowerCase().includes('error') || logLine.toLowerCase().includes('fail')) {
        level = 'error'
      } else if (logLine.toLowerCase().includes('warn')) {
        level = 'warn'
      } else if (logLine.toLowerCase().includes('debug')) {
        level = 'debug'
      }
    }
  } catch (error) {
    // If parsing fails, return defaults
    console.error('Error parsing log line:', error)
  }

  return { timestamp, level, message, raw: logLine }
}

// Export for use in other components
export { parseLogLine }
export type { ParsedLog }
