/**
 * API Keys endpoints
 */

import { apiClient } from '../client'
import type {
  ApiKeysResponse,
  ApiKeyPatchRequest,
  GeminiKeysResponse,
  GeminiKey,
  GeminiKeyPatchRequest,
  ClaudeKeysResponse,
  ClaudeKey,
  ClaudeKeyPatchRequest,
  CodexKeysResponse,
  CodexKey,
  CodexKeyPatchRequest,
  OpenAICompatibilityResponse,
  OpenAICompatibility,
  OpenAICompatibilityPatchRequest,
  OAuthExcludedModelsResponse,
  OAuthExcludedModelsPatchRequest,
  StatusOkResponse,
} from '../types'

/**
 * Access API keys endpoints
 */
export const apiKeysApi = {
  get: () => apiClient.get<ApiKeysResponse>('/api-keys'),
  replaceAll: (keys: string[]) => apiClient.put<StatusOkResponse>('/api-keys', keys),
  update: (data: ApiKeyPatchRequest) => apiClient.patch<StatusOkResponse>('/api-keys', data),
  delete: (params: { index?: number; value?: string }) =>
    apiClient.delete<StatusOkResponse>('/api-keys', params),
}

/**
 * Gemini API keys endpoints
 */
export const geminiKeysApi = {
  get: () => apiClient.get<GeminiKeysResponse>('/gemini-api-key'),
  replaceAll: (keys: GeminiKey[]) =>
    apiClient.put<StatusOkResponse>('/gemini-api-key', keys),
  update: (data: GeminiKeyPatchRequest) =>
    apiClient.patch<StatusOkResponse>('/gemini-api-key', data),
  delete: (params: { 'api-key'?: string; index?: number }) =>
    apiClient.delete<StatusOkResponse>('/gemini-api-key', params as Record<string, string | number>),
}

/**
 * Claude API keys endpoints
 */
export const claudeKeysApi = {
  get: () => apiClient.get<ClaudeKeysResponse>('/claude-api-key'),
  replaceAll: (keys: ClaudeKey[]) =>
    apiClient.put<StatusOkResponse>('/claude-api-key', keys),
  update: (data: ClaudeKeyPatchRequest) =>
    apiClient.patch<StatusOkResponse>('/claude-api-key', data),
  delete: (params: { 'api-key'?: string; index?: number }) =>
    apiClient.delete<StatusOkResponse>('/claude-api-key', params as Record<string, string | number>),
}

/**
 * Codex API keys endpoints
 */
export const codexKeysApi = {
  get: () => apiClient.get<CodexKeysResponse>('/codex-api-key'),
  replaceAll: (keys: CodexKey[]) =>
    apiClient.put<StatusOkResponse>('/codex-api-key', keys),
  update: (data: CodexKeyPatchRequest) =>
    apiClient.patch<StatusOkResponse>('/codex-api-key', data),
  delete: (params: { 'api-key'?: string; index?: number }) =>
    apiClient.delete<StatusOkResponse>('/codex-api-key', params as Record<string, string | number>),
}

/**
 * OpenAI compatibility endpoints
 */
export const openaiCompatibilityApi = {
  get: () => apiClient.get<OpenAICompatibilityResponse>('/openai-compatibility'),
  replaceAll: (configs: OpenAICompatibility[]) =>
    apiClient.put<StatusOkResponse>('/openai-compatibility', configs),
  update: (data: OpenAICompatibilityPatchRequest) =>
    apiClient.patch<StatusOkResponse>('/openai-compatibility', data),
  delete: (params: { name?: string; index?: number }) =>
    apiClient.delete<StatusOkResponse>('/openai-compatibility', params),
}

/**
 * OAuth excluded models endpoints
 */
export const oauthExcludedModelsApi = {
  get: () => apiClient.get<OAuthExcludedModelsResponse>('/oauth-excluded-models'),
  replaceAll: (models: Record<string, string[]>) =>
    apiClient.put<StatusOkResponse>('/oauth-excluded-models', models),
  update: (data: OAuthExcludedModelsPatchRequest) =>
    apiClient.patch<StatusOkResponse>('/oauth-excluded-models', data),
  delete: (provider: string) =>
    apiClient.delete<StatusOkResponse>('/oauth-excluded-models', { provider }),
}
