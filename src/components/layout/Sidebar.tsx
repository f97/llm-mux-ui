import { Link, useRouterState } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'

interface NavItem {
  path: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { path: '/', label: 'Overview', icon: 'dashboard' },
  { path: '/analytics', label: 'Analytics', icon: 'analytics' },
  { path: '/models', label: 'Models', icon: 'view_module' },
  { path: '/providers', label: 'Providers', icon: 'dns' },
  { path: '/logs', label: 'Logs', icon: 'receipt_long' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
]

export function Sidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <aside className="w-64 h-full flex flex-col border-r border-(--border-color) bg-(--bg-surface) z-20 hidden md:flex transition-colors duration-200">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-8 rounded-lg bg-(--accent-primary) text-(--accent-primary-fg) flex items-center justify-center shadow-sm">
          <Icon name="hub" size="md" />
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-none tracking-tight text-(--text-primary)">
            LLM-Mux
          </h1>
          <p className="text-xs text-(--text-secondary) mt-1">Gateway Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = currentPath === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              preload="intent"
              className={cn(
                'relative flex items-center gap-3 px-3 py-2 rounded-md outline-none focus:outline-none focus-visible:ring-0',
                !isActive && 'hover:bg-(--bg-hover)'
              )}
            >
              {/* Animated background indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 bg-(--accent-subtle) border border-(--border-color)/50 rounded-md"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
              <motion.span
                className="relative z-10 flex items-center gap-3"
                initial={false}
                animate={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                transition={{ duration: 0.15 }}
              >
                <motion.span
                  className="flex items-center justify-center"
                  initial={false}
                  animate={{ scale: isActive ? 1 : 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Icon name={item.icon} size="lg" filled={isActive} />
                </motion.span>
                <span className="text-sm font-medium leading-none">{item.label}</span>
              </motion.span>
            </Link>
          )
        })}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-(--border-color)">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-(--bg-hover) transition-colors cursor-pointer group">
          <div className="size-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700" />
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-medium text-(--text-primary) truncate">Admin</p>
            <p className="text-xs text-(--text-secondary) truncate">admin@llm-mux.io</p>
          </div>
          <Icon
            name="unfold_more"
            size="sm"
            className="text-(--text-secondary) group-hover:text-(--text-primary)"
          />
        </div>
      </div>
    </aside>
  )
}
