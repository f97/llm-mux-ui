import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Icon } from '../../ui/Icon'
import type { ApiConfig } from '../../../context/ApiConfigContext'

interface SetupWizardProps {
  defaultBaseUrl: string
  onComplete: (config: ApiConfig) => void
  onTest: (config: ApiConfig) => Promise<boolean>
}

type TestState = 'idle' | 'testing' | 'success' | 'error'

export function SetupWizard({ defaultBaseUrl, onComplete, onTest }: SetupWizardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [baseUrl, setBaseUrl] = useState(defaultBaseUrl)
  const [managementKey, setManagementKey] = useState('')
  const [testState, setTestState] = useState<TestState>('idle')
  const [showPassword, setShowPassword] = useState(false)
  const [hasSeenWizard, setHasSeenWizard] = useState(false)

  // Check if user has seen the wizard before
  useEffect(() => {
    const seen = localStorage.getItem('llmmux_setup_wizard_seen')
    if (!seen) {
      setIsOpen(true)
    } else {
      setHasSeenWizard(true)
    }
  }, [])

  const handleSkip = () => {
    localStorage.setItem('llmmux_setup_wizard_seen', 'true')
    setIsOpen(false)
    setHasSeenWizard(true)
  }

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

  const handleComplete = () => {
    if (!managementKey.trim()) {
      return
    }

    const config: ApiConfig = {
      baseUrl: baseUrl.trim(),
      managementKey: managementKey.trim(),
    }

    localStorage.setItem('llmmux_setup_wizard_seen', 'true')
    onComplete(config)
    setIsOpen(false)
    setHasSeenWizard(true)
  }

  const isValid = managementKey.trim() !== '' && baseUrl.trim() !== ''

  if (hasSeenWizard) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      title="Welcome to LLM-MUX"
      size="lg"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-(--accent-primary)/10 rounded-full flex items-center justify-center">
            <Icon name="rocket_launch" className="text-(--accent-primary)" />
          </div>
          <h3 className="text-lg font-semibold text-(--text-primary)">
            Let's Get Started
          </h3>
          <p className="text-sm text-(--text-secondary) max-w-md mx-auto">
            To use LLM-MUX, you need to configure your API connection. This only takes a minute.
          </p>
        </div>

        {/* Configuration Form */}
        <div className="space-y-4 bg-(--bg-hover) p-6 rounded-lg border border-(--border-color)">
          {/* Base URL */}
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
              The URL where your llm-mux management API is running
            </p>
          </div>

          {/* Management Key */}
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

          {/* Test Connection */}
          <div className="space-y-2 pt-2">
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
                  Connection successful! You're ready to go.
                </span>
              </div>
            )}

            {testState === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-(--danger-bg) border border-(--danger-text)/20 rounded-lg">
                <Icon name="error" size="sm" className="text-(--danger-text)" />
                <span className="text-sm text-(--danger-text)">
                  Connection failed. Please check your credentials.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="flex items-start gap-3 p-4 bg-(--accent-subtle) border border-(--border-color) rounded-lg">
          <Icon name="help" size="sm" className="text-(--text-tertiary) mt-0.5" />
          <div className="text-xs text-(--text-secondary)">
            <p className="font-medium text-(--text-primary) mb-1">
              Where to find your credentials:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your llm-mux server configuration file</li>
              <li>The management key is configured in your server settings</li>
              <li>Default port is 8318 for the management API</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <ModalFooter className="-mx-6 -mb-4">
        <Button variant="ghost" onClick={handleSkip}>
          Skip for now
        </Button>
        <Button
          variant="primary"
          onClick={handleComplete}
          disabled={!isValid}
        >
          <Icon name="check" size="sm" />
          Complete Setup
        </Button>
      </ModalFooter>
    </Modal>
  )
}
