/**
 * Configuration types
 */

import type { ClaudeKey, CodexKey, GeminiKey, OpenAICompatibility } from './api-keys'

/**
 * Full server configuration
 */
export interface Config {
  port?: number
  'auth-dir'?: string
  debug?: boolean
  'logging-to-file'?: boolean
  'usage-statistics-enabled'?: boolean
  'proxy-url'?: string
  'request-retry'?: number
  'max-retry-interval'?: number
  'ws-auth'?: boolean
  'request-log'?: boolean
  'gemini-api-key'?: GeminiKey[]
  'claude-api-key'?: ClaudeKey[]
  'codex-api-key'?: CodexKey[]
  'openai-compatibility'?: OpenAICompatibility[]
  [key: string]: unknown // Allow additional config fields
}

/**
 * Latest version response
 */
export interface LatestVersionResponse {
  'latest-version': string
}

/**
 * Config update response
 */
export interface ConfigUpdateResponse {
  ok: boolean
  changed: string[]
}
