/**
 * API Keys types
 */

/**
 * Access API keys list response
 */
export interface ApiKeysResponse {
  'api-keys': string[]
}

/**
 * API keys update request
 */
export interface ApiKeysUpdateRequest {
  items?: string[]
}

/**
 * API key patch request
 */
export interface ApiKeyPatchRequest {
  old?: string
  new?: string
  index?: number
  value?: string
}

/**
 * Gemini API key configuration
 */
export interface GeminiKey {
  'api-key': string
  'base-url'?: string
  'proxy-url'?: string
  headers?: Record<string, string>
  'excluded-models'?: string[]
}

/**
 * Gemini API keys response
 */
export interface GeminiKeysResponse {
  'gemini-api-key': GeminiKey[]
}

/**
 * Gemini keys update request
 */
export interface GeminiKeysUpdateRequest {
  items?: GeminiKey[]
}

/**
 * Gemini key patch request
 */
export interface GeminiKeyPatchRequest {
  index?: number
  match?: string
  value: GeminiKey
}

/**
 * Model configuration (used in Claude keys)
 */
export interface ModelConfig {
  name: string
  alias?: string
}

/**
 * Claude API key configuration
 */
export interface ClaudeKey {
  'api-key': string
  'base-url'?: string
  'proxy-url'?: string
  headers?: Record<string, string>
  'excluded-models'?: string[]
  models?: ModelConfig[]
}

/**
 * Claude API keys response
 */
export interface ClaudeKeysResponse {
  'claude-api-key': ClaudeKey[]
}

/**
 * Claude keys update request
 */
export interface ClaudeKeysUpdateRequest {
  items?: ClaudeKey[]
}

/**
 * Claude key patch request
 */
export interface ClaudeKeyPatchRequest {
  index?: number
  match?: string
  value: ClaudeKey
}

/**
 * Codex API key configuration
 */
export interface CodexKey {
  'api-key': string
  'base-url'?: string
  'proxy-url'?: string
  headers?: Record<string, string>
  'excluded-models'?: string[]
}

/**
 * Codex API keys response
 */
export interface CodexKeysResponse {
  'codex-api-key': CodexKey[]
}

/**
 * Codex keys update request
 */
export interface CodexKeysUpdateRequest {
  items?: CodexKey[]
}

/**
 * Codex key patch request
 */
export interface CodexKeyPatchRequest {
  index?: number
  match?: string
  value: CodexKey
}

/**
 * API key entry for OpenAI compatibility
 */
export interface ApiKeyEntry {
  'api-key': string
  'proxy-url'?: string
}

/**
 * OpenAI compatibility configuration
 */
export interface OpenAICompatibility {
  name: string
  'base-url': string
  'api-key-entries'?: ApiKeyEntry[]
  models?: ModelConfig[]
  headers?: Record<string, string>
}

/**
 * OpenAI compatibility response
 */
export interface OpenAICompatibilityResponse {
  'openai-compatibility': OpenAICompatibility[]
}

/**
 * OpenAI compatibility update request
 */
export interface OpenAICompatibilityUpdateRequest {
  items?: OpenAICompatibility[]
}

/**
 * OpenAI compatibility patch request
 */
export interface OpenAICompatibilityPatchRequest {
  name?: string
  index?: number
  value: OpenAICompatibility
}

/**
 * OAuth excluded models response
 */
export interface OAuthExcludedModelsResponse {
  'oauth-excluded-models': Record<string, string[]>
}

/**
 * OAuth excluded models update request
 */
export interface OAuthExcludedModelsUpdateRequest {
  items?: Record<string, string[]>
}

/**
 * OAuth excluded models patch request
 */
export interface OAuthExcludedModelsPatchRequest {
  provider: string
  models?: string[]
}
