import { useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { MobileNav } from './MobileNav'

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <>
      <header className="h-16 border-b border-(--border-color) flex items-center justify-between px-4 md:px-6 bg-(--bg-body)/80 backdrop-blur-sm sticky top-0 z-10">
        {/* Mobile menu button + Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-(--bg-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            aria-label="Open menu"
          >
            <Icon name="menu" size="lg" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-(--text-secondary) font-medium hover:text-(--text-primary) cursor-pointer transition-colors hidden sm:inline">
              Home
            </span>
            <span className="text-(--text-tertiary) hidden sm:inline">/</span>
            <span className="text-(--text-primary) font-medium">{title}</span>
          </div>
        </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Notifications"
        >
          <Icon name="notifications" size="lg" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border border-(--bg-body)" aria-hidden="true" />
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

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  )
}
