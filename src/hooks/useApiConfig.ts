import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api/client'
import type { AuthConfig } from '../api/types/common'

export interface ApiConfig {
  baseUrl: string
  managementKey: string
}

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
 * Save API configuration to localStorage
 */
function saveConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save API config:', error)
    throw error
  }
}

/**
 * Clear API configuration from localStorage
 */
function clearConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear API config:', error)
  }
}

/**
 * Apply configuration to the API client
 */
function applyConfigToClient(config: ApiConfig | null): void {
  if (!config) {
    // Clear auth if no config
    apiClient.setAuth({})
    return
  }

  // Apply auth to client
  const auth: AuthConfig = {
    managementKey: config.managementKey,
  }
  apiClient.setAuth(auth)

  // Set base URL
  apiClient.setBaseUrl(config.baseUrl)
}

/**
 * Hook for managing API configuration
 */
export function useApiConfig() {
  const [config, setConfig] = useState<ApiConfig | null>(() => loadConfig())
  const [isConfigured, setIsConfigured] = useState(() => {
    const loaded = loadConfig()
    return loaded !== null && loaded.managementKey !== ''
  })

  // Apply config on mount and when it changes
  useEffect(() => {
    applyConfigToClient(config)
    setIsConfigured(config !== null && config.managementKey !== '')
  }, [config])

  /**
   * Update and save API configuration
   */
  const updateConfig = useCallback((newConfig: ApiConfig) => {
    saveConfig(newConfig)
    setConfig(newConfig)
    applyConfigToClient(newConfig)
  }, [])

  /**
   * Clear API configuration
   */
  const resetConfig = useCallback(() => {
    clearConfig()
    setConfig(null)
    applyConfigToClient(null)
  }, [])

  /**
   * Test API connection with given credentials
   */
  const testConnection = useCallback(async (testConfig: ApiConfig): Promise<boolean> => {
    try {
      // Create a temporary client with test config
      const testAuth: AuthConfig = {
        managementKey: testConfig.managementKey,
      }

      // Try a simple GET request to verify connection
      // We'll use the debug endpoint or any simple endpoint
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
    }
  }, [])

  return {
    config,
    isConfigured,
    updateConfig,
    resetConfig,
    testConnection,
    defaultBaseUrl: DEFAULT_BASE_URL,
  }
}

/**
 * Initialize API configuration on app start
 * Call this in main.tsx before rendering
 */
export function initializeApiConfig(): void {
  const config = loadConfig()
  applyConfigToClient(config)
}
