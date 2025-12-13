import { useRouterState } from '@tanstack/react-router'
import { Icon } from '../ui/Icon'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/models': 'Models',
  '/providers': 'Providers',
  '/logs': 'Logs',
  '/settings': 'Settings',
}

export function Header() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const title = routeTitles[currentPath] || 'Dashboard'

  return (
    <header className="h-16 border-b border-(--border-color) flex items-center justify-between px-6 bg-(--bg-body)/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-(--text-secondary) font-medium hover:text-(--text-primary) cursor-pointer transition-colors">
          Home
        </span>
        <span className="text-(--text-tertiary)">/</span>
        <span className="text-(--text-primary) font-medium">{title}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors">
          <Icon name="notifications" size="lg" />
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-(--bg-body)" />
        </button>

        <div className="h-4 w-px bg-(--border-color)" />

        {/* Documentation link */}
        <a
          href="#"
          className="text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors"
        >
          Documentation
        </a>
      </div>
    </header>
  )
}
