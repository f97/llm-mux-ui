/**
 * Query key factory for React Query
 *
 * Hierarchical query keys for efficient cache invalidation and organization
 */

export const queryKeys = {
  // Settings keys
  settings: ['settings'] as const,
  debug: () => [...queryKeys.settings, 'debug'] as const,
  loggingToFile: () => [...queryKeys.settings, 'logging-to-file'] as const,
  usageStatisticsEnabled: () => [...queryKeys.settings, 'usage-statistics-enabled'] as const,
  proxyUrl: () => [...queryKeys.settings, 'proxy-url'] as const,
  switchProject: () => [...queryKeys.settings, 'switch-project'] as const,
  switchPreviewModel: () => [...queryKeys.settings, 'switch-preview-model'] as const,
  requestLog: () => [...queryKeys.settings, 'request-log'] as const,
  wsAuth: () => [...queryKeys.settings, 'ws-auth'] as const,
  requestRetry: () => [...queryKeys.settings, 'request-retry'] as const,
  maxRetryInterval: () => [...queryKeys.settings, 'max-retry-interval'] as const,

  // API Keys
  apiKeys: ['api-keys'] as const,
  accessKeys: () => [...queryKeys.apiKeys, 'access'] as const,
  geminiKeys: () => [...queryKeys.apiKeys, 'gemini'] as const,
  claudeKeys: () => [...queryKeys.apiKeys, 'claude'] as const,
  codexKeys: () => [...queryKeys.apiKeys, 'codex'] as const,
  openaiCompatibility: () => [...queryKeys.apiKeys, 'openai-compatibility'] as const,
  oauthExcludedModels: () => [...queryKeys.apiKeys, 'oauth-excluded-models'] as const,

  // Auth Files
  authFiles: ['auth-files'] as const,
  authFilesList: () => [...queryKeys.authFiles, 'list'] as const,
  authFileDownload: (name: string) => [...queryKeys.authFiles, 'download', name] as const,

  // OAuth
  oauth: ['oauth'] as const,
  oauthUrl: (provider: string) => [...queryKeys.oauth, 'url', provider] as const,
  oauthStatus: (state: string) => [...queryKeys.oauth, 'status', state] as const,

  // Usage
  usage: ['usage'] as const,
  usageStats: () => [...queryKeys.usage, 'stats'] as const,

  // Logs
  logs: ['logs'] as const,
  serverLogs: (after?: number, limit?: number) =>
    [...queryKeys.logs, 'server', { after, limit }] as const,
  errorLogFiles: () => [...queryKeys.logs, 'error-files'] as const,
  errorLog: (name: string) => [...queryKeys.logs, 'error', name] as const,

  // Config
  config: ['config'] as const,
  configJson: () => [...queryKeys.config, 'json'] as const,
  configYaml: () => [...queryKeys.config, 'yaml'] as const,
  latestVersion: () => [...queryKeys.config, 'latest-version'] as const,
} as const
