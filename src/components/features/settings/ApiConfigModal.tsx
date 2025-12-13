import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Icon } from '../../ui/Icon'
import type { ApiConfig } from '../../../context/ApiConfigContext'

interface ApiConfigModalProps {
  isOpen: boolean
  onClose: () => void
  currentConfig: ApiConfig | null
  defaultBaseUrl: string
  onSave: (config: ApiConfig) => void
  onTest: (config: ApiConfig) => Promise<boolean>
}

type TestState = 'idle' | 'testing' | 'success' | 'error'

export function ApiConfigModal({
  isOpen,
  onClose,
  currentConfig,
  defaultBaseUrl,
  onSave,
  onTest,
}: ApiConfigModalProps) {
  const [baseUrl, setBaseUrl] = useState(currentConfig?.baseUrl || defaultBaseUrl)
  const [managementKey, setManagementKey] = useState(currentConfig?.managementKey || '')
  const [testState, setTestState] = useState<TestState>('idle')
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Reset form when modal opens with current config
  useEffect(() => {
    if (isOpen) {
      setBaseUrl(currentConfig?.baseUrl || defaultBaseUrl)
      setManagementKey(currentConfig?.managementKey || '')
      setTestState('idle')
      setIsSaving(false)
      setShowPassword(false)
    }
  }, [isOpen, currentConfig, defaultBaseUrl])

  const handleTestConnection = async () => {
    if (!managementKey.trim()) {
      setTestState('error')
      return
    }

    setTestState('testing')

    const testConfig: ApiConfig = {
      baseUrl: baseUrl.trim(),
      managementKey: managementKey.trim(),
    }

    const success = await onTest(testConfig)
    setTestState(success ? 'success' : 'error')
  }

  const handleSave = async () => {
    if (!managementKey.trim()) {
      return
    }

    setIsSaving(true)

    try {
      const config: ApiConfig = {
        baseUrl: baseUrl.trim(),
        managementKey: managementKey.trim(),
      }

      onSave(config)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  const isValid = managementKey.trim() !== '' && baseUrl.trim() !== ''

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="API Configuration" size="md">
      <div className="space-y-4">
        {/* Description */}
        <p className="text-sm text-(--text-secondary)">
          Configure the connection to your llm-mux management API. You'll need a management key
          to authenticate requests.
        </p>

        {/* Base URL Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-(--text-primary)">
            Base URL
          </label>
          <Input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder={defaultBaseUrl}
            icon="link"
            iconPosition="left"
          />
          <p className="text-xs text-(--text-secondary)">
            The base URL of your llm-mux management API
          </p>
        </div>

        {/* Management Key Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-(--text-primary)">
            Management Key
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={managementKey}
              onChange={(e) => setManagementKey(e.target.value)}
              placeholder="Enter your management key"
              icon="key"
              iconPosition="left"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="sm" />
            </button>
          </div>
          <p className="text-xs text-(--text-secondary)">
            Your X-Management-Key for API authentication
          </p>
        </div>

        {/* Test Connection Button */}
        <div className="space-y-2">
          <Button
            variant="secondary"
            onClick={handleTestConnection}
            disabled={!isValid || testState === 'testing'}
            className="w-full"
          >
            {testState === 'testing' ? (
              <>
                <Icon name="sync" className="animate-spin" size="sm" />
                Testing Connection...
              </>
            ) : (
              <>
                <Icon name="wifi" size="sm" />
                Test Connection
              </>
            )}
          </Button>

          {/* Test Result */}
          {testState === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-(--success-bg) border border-(--success-text)/20 rounded-lg">
              <Icon name="check_circle" size="sm" className="text-(--success-text)" />
              <span className="text-sm text-(--success-text)">
                Connection successful!
              </span>
            </div>
          )}

          {testState === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-(--danger-bg) border border-(--danger-text)/20 rounded-lg">
              <Icon name="error" size="sm" className="text-(--danger-text)" />
              <span className="text-sm text-(--danger-text)">
                Connection failed. Please check your credentials and try again.
              </span>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-3 bg-(--accent-subtle) border border-(--border-color) rounded-lg">
          <Icon name="info" size="sm" className="text-(--text-tertiary) mt-0.5" />
          <div className="text-xs text-(--text-secondary)">
            <p className="font-medium text-(--text-primary) mb-1">
              Where to find your credentials:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your llm-mux server configuration</li>
              <li>Management key is set via X-Management-Key header</li>
              <li>Default port is 8318 for the management API</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!isValid || isSaving}
        >
          {isSaving ? (
            <>
              <Icon name="sync" className="animate-spin" size="sm" />
              Saving...
            </>
          ) : (
            <>
              <Icon name="save" size="sm" />
              Save Configuration
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
