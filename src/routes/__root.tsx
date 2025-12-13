import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
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
    <div className="h-screen flex overflow-hidden antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-(--bg-body)">
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
  )
}
