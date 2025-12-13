import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ApiSetupScreen } from '../components/features/settings/ApiSetupScreen'
import { useApiConfigContext } from '../context/ApiConfigContext'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { isConfigured, saveConfig, testConnection } = useApiConfigContext()

  // If not configured, show the mandatory setup screen
  if (!isConfigured) {
    return (
      <ApiSetupScreen
        onComplete={saveConfig}
        onTest={testConnection}
      />
    )
  }

  // Once configured, show the normal app layout
  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden antialiased">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--bg-card) focus:border focus:border-(--border-color) focus:rounded-md focus:text-(--text-primary)"
        >
          Skip to main content
        </a>

        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main
          id="main-content"
          className="flex-1 flex flex-col h-full overflow-hidden relative bg-(--bg-body)"
        >
          {/* Header */}
          <Header />

          {/* Page content - simple fade in on route change */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
