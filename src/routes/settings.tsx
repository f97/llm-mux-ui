import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ApiConfigModal } from '../components/features/settings/ApiConfigModal'
import { useApiConfigContext, DEFAULT_BASE_URL } from '../context/ApiConfigContext'
import { useToast } from '../context/ToastContext'
import {
  useDebug,
  useUpdateDebug,
  useLoggingToFile,
  useUpdateLoggingToFile,
  useUsageStatisticsEnabled,
  useUpdateUsageStatisticsEnabled,
  useRequestLog,
  useUpdateRequestLog,
  useWsAuth,
  useUpdateWsAuth,
  useProxyUrl,
  useUpdateProxyUrl,
  useDeleteProxyUrl,
  useRequestRetry,
  useUpdateRequestRetry,
  useMaxRetryInterval,
  useUpdateMaxRetryInterval,
  useSwitchProject,
  useUpdateSwitchProject,
  useSwitchPreviewModel,
  useUpdateSwitchPreviewModel,
} from '../api/hooks/useSettings'
import { useLatestVersion } from '../api/hooks/useConfig'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { config, isConfigured, saveConfig, clearConfig, testConnection } = useApiConfigContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const toast = useToast()

  // Settings queries - include isError to handle API errors
  const { data: debugData, isLoading: debugLoading, isError: debugError } = useDebug()
  const { data: loggingData, isLoading: loggingLoading, isError: loggingError } = useLoggingToFile()
  const { data: usageStatsData, isLoading: usageStatsLoading, isError: usageStatsError } = useUsageStatisticsEnabled()
  const { data: requestLogData, isLoading: requestLogLoading, isError: requestLogError } = useRequestLog()
  const { data: wsAuthData, isLoading: wsAuthLoading, isError: wsAuthError } = useWsAuth()
  const { data: proxyData, isLoading: proxyLoading } = useProxyUrl()
  const { data: retryData, isLoading: retryLoading } = useRequestRetry()
  const { data: maxIntervalData, isLoading: maxIntervalLoading } = useMaxRetryInterval()
  const { data: switchProjectData, isLoading: switchProjectLoading, isError: switchProjectError } = useSwitchProject()
  const { data: switchPreviewData, isLoading: switchPreviewLoading, isError: switchPreviewError } = useSwitchPreviewModel()
  const { data: versionData } = useLatestVersion()

  // Helper to extract error from API response (API may return 200 with error field)
  const getApiError = (data: unknown): string | undefined => {
    if (data && typeof data === 'object' && 'error' in data) {
      return (data as { error: string }).error
    }
    return undefined
  }

  // Settings mutations
  const updateDebug = useUpdateDebug()
  const updateLogging = useUpdateLoggingToFile()
  const updateUsageStats = useUpdateUsageStatisticsEnabled()
  const updateRequestLog = useUpdateRequestLog()
  const updateWsAuth = useUpdateWsAuth()
  const updateProxyUrl = useUpdateProxyUrl()
  const deleteProxyUrl = useDeleteProxyUrl()
  const updateRetry = useUpdateRequestRetry()
  const updateMaxInterval = useUpdateMaxRetryInterval()
  const updateSwitchProject = useUpdateSwitchProject()
  const updateSwitchPreview = useUpdateSwitchPreviewModel()

  const maskKey = (key: string) => {
    if (key.length <= 8) return '********'
    return `${key.slice(0, 4)}****${key.slice(-4)}`
  }

  // Handle proxy URL update
  const handleProxyUpdate = async (value: string) => {
    try {
      if (value.trim() === '') {
        await deleteProxyUrl.mutateAsync()
        toast.success('Proxy URL removed')
      } else {
        await updateProxyUrl.mutateAsync(value)
        toast.success('Proxy URL updated')
      }
    } catch (err) {
      toast.error(`Failed to update proxy URL: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Handle retry count update
  const handleRetryUpdate = async (value: string) => {
    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue < 0) {
      toast.error('Please enter a valid number')
      return
    }
    try {
      await updateRetry.mutateAsync(numValue)
      toast.success('Retry count updated')
    } catch (err) {
      toast.error(`Failed to update retry count: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Handle max interval update
  const handleMaxIntervalUpdate = async (value: string) => {
    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue < 1) {
      toast.error('Please enter a valid number (minimum 1)')
      return
    }
    try {
      await updateMaxInterval.mutateAsync(numValue)
      toast.success('Max retry interval updated')
    } catch (err) {
      toast.error(`Failed to update max retry interval: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-(--text-primary)">
            Settings
          </h2>
          <p className="text-(--text-secondary) mt-1 text-sm">
            Configure server behavior, logging, and connection settings.
          </p>
        </div>
        {versionData?.['latest-version'] && (
          <div className="text-xs text-(--text-tertiary)">
            Latest version: {versionData['latest-version']}
          </div>
        )}
      </div>

      {/* API Configuration */}
      <Card>
        <div className="p-6 border-b border-(--border-color)">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-(--text-primary)">
                API Connection
              </h3>
              {isConfigured ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <Badge variant="warning">Not Configured</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
                <Icon name="settings" size="sm" />
                Reconfigure
              </Button>
              {isConfigured && (
                <Button variant="danger" size="sm" onClick={clearConfig}>
                  <Icon name="power_settings_new" size="sm" />
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {isConfigured && config ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-(--text-secondary) mb-1">Base URL</p>
                  <p className="text-sm font-mono text-(--text-primary) bg-(--bg-hover) px-3 py-2 rounded-lg border border-(--border-color)">
                    {config.baseUrl}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-(--text-secondary) mb-1">Management Key</p>
                  <p className="text-sm font-mono text-(--text-primary) bg-(--bg-hover) px-3 py-2 rounded-lg border border-(--border-color)">
                    {maskKey(config.managementKey)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
                  <Icon name="check_circle" size="sm" className="text-(--success-text)" />
                  Connected and authenticated
                </div>
              </div>
              <div className="pt-2 border-t border-(--border-color)">
                <p className="text-xs text-(--text-secondary)">
                  <Icon name="info" size="sm" className="inline mr-1" />
                  To reconnect or change credentials, click "Reconfigure" above.
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-(--warning-bg) border border-(--warning-text)/20 rounded-lg">
              <Icon name="warning" size="sm" className="text-(--warning-text) mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-(--text-primary) mb-1">
                  API configuration required
                </p>
                <p className="text-xs text-(--text-secondary) mb-3">
                  You need to configure your API credentials to use this application.
                </p>
                <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                  <Icon name="settings" size="sm" />
                  Configure Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* API Configuration Modal */}
      <ApiConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentConfig={config}
        defaultBaseUrl={DEFAULT_BASE_URL}
        onSave={saveConfig}
        onTest={testConnection}
      />

      {/* General Settings */}
      <Card>
        <div className="p-6 border-b border-(--border-color)">
          <h3 className="text-base font-semibold text-(--text-primary)">
            General Settings
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <SettingToggle
            label="Debug Mode"
            description="Enable verbose logging for debugging purposes"
            checked={debugData?.debug ?? false}
            isLoading={debugLoading}
            isError={debugError}
            error={getApiError(debugData)}
            onChange={(value) => updateDebug.mutateAsync(value).catch((err) => {
              toast.error(`Failed to update debug mode: ${err.message}`)
            })}
            isPending={updateDebug.isPending}
          />
          <SettingToggle
            label="Logging to File"
            description="Write logs to file instead of stdout"
            checked={loggingData?.['logging-to-file'] ?? false}
            isLoading={loggingLoading}
            isError={loggingError}
            error={getApiError(loggingData)}
            onChange={(value) => updateLogging.mutateAsync(value).catch((err) => {
              toast.error(`Failed to update logging setting: ${err.message}`)
            })}
            isPending={updateLogging.isPending}
          />
          <SettingToggle
            label="Usage Statistics"
            description="Track and store usage statistics"
            checked={usageStatsData?.['usage-statistics-enabled'] ?? false}
            isLoading={usageStatsLoading}
            isError={usageStatsError}
            error={getApiError(usageStatsData)}
            onChange={(value) => updateUsageStats.mutateAsync(value).catch((err) => {
              toast.error(`Failed to update usage statistics setting: ${err.message}`)
            })}
            isPending={updateUsageStats.isPending}
          />
          <SettingToggle
            label="Request Logging"
            description="Log detailed request/response data"
            checked={requestLogData?.['request-log'] ?? false}
            isLoading={requestLogLoading}
            isError={requestLogError}
            error={getApiError(requestLogData)}
            onChange={(value) => updateRequestLog.mutateAsync(value).catch((err) => {
              toast.error(`Failed to update request logging setting: ${err.message}`)
            })}
            isPending={updateRequestLog.isPending}
          />
          <SettingToggle
            label="WebSocket Authentication"
            description="Require authentication for WebSocket connections"
            checked={wsAuthData?.['ws-auth'] ?? false}
            isLoading={wsAuthLoading}
            isError={wsAuthError}
            error={getApiError(wsAuthData)}
            onChange={(value) => updateWsAuth.mutateAsync(value).catch((err) => {
              toast.error(`Failed to update WebSocket auth setting: ${err.message}`)
            })}
            isPending={updateWsAuth.isPending}
          />
        </div>
      </Card>

      {/* Connection Settings */}
      <Card>
        <div className="p-6 border-b border-(--border-color)">
          <h3 className="text-base font-semibold text-(--text-primary)">
            Connection Settings
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <SettingInput
            label="Proxy URL"
            description="HTTP proxy for outgoing requests (optional)"
            placeholder="http://proxy.example.com:8080"
            value={proxyData?.['proxy-url'] ?? ''}
            isLoading={proxyLoading}
            onSave={handleProxyUpdate}
            isPending={updateProxyUrl.isPending || deleteProxyUrl.isPending}
          />
          <SettingInput
            label="Request Retry Count"
            description="Number of retries for failed requests"
            type="number"
            value={String(retryData?.['request-retry'] ?? 3)}
            isLoading={retryLoading}
            onSave={handleRetryUpdate}
            isPending={updateRetry.isPending}
          />
          <SettingInput
            label="Max Retry Interval"
            description="Maximum wait time between retries (seconds)"
            type="number"
            value={String(maxIntervalData?.['max-retry-interval'] ?? 30)}
            isLoading={maxIntervalLoading}
            onSave={handleMaxIntervalUpdate}
            isPending={updateMaxInterval.isPending}
          />
        </div>
      </Card>

      {/* Quota Settings */}
      <Card>
        <div className="p-6 border-b border-(--border-color)">
          <h3 className="text-base font-semibold text-(--text-primary)">
            Quota Exceeded Behavior
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <SettingToggle
            label="Auto Switch Project"
            description="Automatically switch to another project when quota is exceeded"
            checked={switchProjectData?.['switch-project'] ?? false}
            isLoading={switchProjectLoading}
            isError={switchProjectError}
            error={getApiError(switchProjectData)}
            onChange={(value) => updateSwitchProject.mutateAsync(value).catch((err) => {
              toast.error(`Failed to update switch project setting: ${err.message}`)
            })}
            isPending={updateSwitchProject.isPending}
          />
          <SettingToggle
            label="Use Preview Models"
            description="Fall back to preview models when quota is exceeded"
            checked={switchPreviewData?.['switch-preview-model'] ?? false}
            isLoading={switchPreviewLoading}
            isError={switchPreviewError}
            error={getApiError(switchPreviewData)}
            onChange={(value) => updateSwitchPreview.mutateAsync(value).catch((err) => {
              toast.error(`Failed to update switch preview model setting: ${err.message}`)
            })}
            isPending={updateSwitchPreview.isPending}
          />
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-(--danger-text)/30">
        <div className="p-6 border-b border-(--danger-text)/30">
          <h3 className="text-base font-semibold text-(--danger-text)">
            Danger Zone
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-(--text-primary)">Reset Configuration</p>
              <p className="text-xs text-(--text-secondary)">
                Reset all settings to default values
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowResetModal(true)}>
              <Icon name="restart_alt" size="sm" />
              Reset
            </Button>
          </div>
          <div className="w-full h-px bg-(--border-color)" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-(--text-primary)">Clear All Data</p>
              <p className="text-xs text-(--text-secondary)">
                Remove all cached data and statistics
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowClearModal(true)}>
              <Icon name="delete_forever" size="sm" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Configuration"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-(--text-secondary)">
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {
              toast.info('Reset functionality requires backend implementation')
              setShowResetModal(false)
            }}>
              <Icon name="restart_alt" size="sm" />
              Reset Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Data Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Data"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-(--text-secondary)">
            Are you sure you want to clear all cached data and statistics? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {
              toast.info('Clear data functionality requires backend implementation')
              setShowClearModal(false)
            }}>
              <Icon name="delete_forever" size="sm" />
              Clear Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

interface SettingToggleProps {
  label: string
  description: string
  checked: boolean
  isLoading?: boolean
  onChange: (value: boolean) => void
  isPending?: boolean
  error?: string // Error message from API (e.g., "logging to file disabled")
  isError?: boolean
}

function SettingToggle({ label, description, checked, isLoading, onChange, isPending, error, isError }: SettingToggleProps) {
  // Check if feature is disabled (not a real error, just unavailable)
  const isDisabledFeature = error?.includes('disabled') || error?.includes('not enabled')
  // Real errors that should show warning
  const hasRealError = (isError || !!error) && !isDisabledFeature

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-(--text-primary)">{label}</p>
        <p className="text-xs text-(--text-secondary)">{description}</p>
        {isDisabledFeature && (
          <p className="text-xs text-(--text-tertiary) mt-1">
            Feature not available
          </p>
        )}
        {hasRealError && (
          <p className="text-xs text-(--warning-text) mt-1">
            <Icon name="warning" size="sm" className="inline mr-1" />
            {error || 'Unable to fetch setting'}
          </p>
        )}
      </div>
      {isLoading ? (
        <div className="w-9 h-5 bg-(--bg-hover) rounded-full animate-pulse" />
      ) : (
        <button
          onClick={() => onChange(!checked)}
          disabled={isPending || isDisabledFeature || hasRealError}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out
            ${checked ? 'bg-(--success-text)' : 'bg-(--text-tertiary)'}
            ${isPending || isDisabledFeature || hasRealError ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          role="switch"
          aria-checked={checked}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
              ${checked ? 'translate-x-4' : 'translate-x-0.5'}
              mt-0.5
            `}
          />
        </button>
      )}
    </div>
  )
}

interface SettingInputProps {
  label: string
  description: string
  placeholder?: string
  type?: string
  value: string
  isLoading?: boolean
  onSave: (value: string) => void
  isPending?: boolean
}

function SettingInput({ label, description, placeholder, type = 'text', value, isLoading, onSave, isPending }: SettingInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isDirty, setIsDirty] = useState(false)

  // Update local value when prop changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
    setIsDirty(e.target.value !== value)
  }

  const handleSave = () => {
    if (isDirty) {
      onSave(localValue)
      setIsDirty(false)
    }
  }

  const handleReset = () => {
    setLocalValue(value)
    setIsDirty(false)
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-(--text-primary)">{label}</p>
        <p className="text-xs text-(--text-secondary)">{description}</p>
      </div>
      <div className="flex gap-2 max-w-md">
        {isLoading ? (
          <div className="flex-1 h-9 bg-(--bg-hover) rounded-lg animate-pulse" />
        ) : (
          <Input
            type={type}
            placeholder={placeholder}
            value={localValue}
            onChange={handleChange}
            className="flex-1"
          />
        )}
        {isDirty && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                <Icon name="progress_activity" size="sm" className="animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
