import { Link, useRouterState } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
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

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-72 bg-(--bg-surface) border-r border-(--border-color) z-50 md:hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-(--border-color)">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-(--accent-primary) text-(--accent-primary-fg) flex items-center justify-center">
                  <Icon name="hub" size="md" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-(--text-primary)">LLM-Mux</h1>
                  <p className="text-xs text-(--text-secondary)">Gateway Admin</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-(--bg-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                aria-label="Close menu"
              >
                <Icon name="close" size="lg" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = currentPath === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-[48px]',
                      isActive
                        ? 'bg-(--accent-subtle) text-(--text-primary) border border-(--border-color)'
                        : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)'
                    )}
                  >
                    <Icon name={item.icon} size="lg" filled={isActive} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-(--border-color)">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="size-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--text-primary) truncate">Admin</p>
                  <p className="text-xs text-(--text-secondary) truncate">admin@llm-mux.io</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
