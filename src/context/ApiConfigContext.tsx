import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { apiClient } from '../api/client'
import type { AuthConfig } from '../api/types/common'

export interface ApiConfig {
  baseUrl: string
  managementKey: string
}

interface ApiConfigContextValue {
  config: ApiConfig | null
  isConfigured: boolean
  isConnecting: boolean
  saveConfig: (config: ApiConfig) => void
  clearConfig: () => void
  testConnection: (config: ApiConfig) => Promise<boolean>
}

const ApiConfigContext = createContext<ApiConfigContextValue | undefined>(undefined)

const STORAGE_KEY = 'llmmux_api_config'
const DEFAULT_BASE_URL = 'http://localhost:8318/v0/management'

/**
 * Load API configuration from localStorage
 */
function loadConfig(): ApiConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as ApiConfig
  } catch (error) {
    console.error('Failed to load API config:', error)
    return null
  }
}

/**
 * Apply configuration to the API client
 */
function applyConfigToClient(config: ApiConfig | null): void {
  if (!config) {
    apiClient.setAuth({})
    return
  }

  const auth: AuthConfig = {
    managementKey: config.managementKey,
  }
  apiClient.setAuth(auth)
  apiClient.setBaseUrl(config.baseUrl)
}

interface ApiConfigProviderProps {
  children: ReactNode
}

export function ApiConfigProvider({ children }: ApiConfigProviderProps) {
  const [config, setConfig] = useState<ApiConfig | null>(() => loadConfig())
  const [isConfigured, setIsConfigured] = useState(() => {
    const loaded = loadConfig()
    return loaded !== null && loaded.managementKey !== ''
  })
  const [isConnecting, setIsConnecting] = useState(false)

  // Apply config on mount and when it changes
  useEffect(() => {
    applyConfigToClient(config)
    setIsConfigured(config !== null && config.managementKey !== '')
  }, [config])

  /**
   * Save API configuration
   */
  const saveConfig = (newConfig: ApiConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
      setConfig(newConfig)
      applyConfigToClient(newConfig)
    } catch (error) {
      console.error('Failed to save API config:', error)
      throw error
    }
  }

  /**
   * Clear API configuration
   */
  const clearConfig = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setConfig(null)
      applyConfigToClient(null)
    } catch (error) {
      console.error('Failed to clear API config:', error)
    }
  }

  /**
   * Test API connection with given credentials
   */
  const testConnection = async (testConfig: ApiConfig): Promise<boolean> => {
    setIsConnecting(true)
    try {
      const testAuth: AuthConfig = {
        managementKey: testConfig.managementKey,
      }

      const response = await fetch(`${testConfig.baseUrl}/debug`, {
        method: 'GET',
        headers: {
          'X-Management-Key': testAuth.managementKey || '',
        },
      })

      return response.ok
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  const value: ApiConfigContextValue = {
    config,
    isConfigured,
    isConnecting,
    saveConfig,
    clearConfig,
    testConnection,
  }

  return <ApiConfigContext.Provider value={value}>{children}</ApiConfigContext.Provider>
}

export function useApiConfigContext() {
  const context = useContext(ApiConfigContext)
  if (context === undefined) {
    throw new Error('useApiConfigContext must be used within ApiConfigProvider')
  }
  return context
}

export { DEFAULT_BASE_URL }
