/**
 * API Keys React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import {
  apiKeysApi,
  geminiKeysApi,
  claudeKeysApi,
  codexKeysApi,
  openaiCompatibilityApi,
  oauthExcludedModelsApi,
} from '../endpoints'
import type {
  ApiKeyPatchRequest,
  GeminiKey,
  GeminiKeyPatchRequest,
  ClaudeKey,
  ClaudeKeyPatchRequest,
  CodexKey,
  CodexKeyPatchRequest,
  OpenAICompatibility,
  OpenAICompatibilityPatchRequest,
  OAuthExcludedModelsPatchRequest,
} from '../types'

/**
 * Access API keys hooks
 */
export const useApiKeys = () =>
  useQuery({
    queryKey: queryKeys.accessKeys(),
    queryFn: () => apiKeysApi.get(),
  })

export const useReplaceApiKeys = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keys: string[]) => apiKeysApi.replaceAll(keys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accessKeys() })
    },
  })
}

export const useUpdateApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ApiKeyPatchRequest) => apiKeysApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accessKeys() })
    },
  })
}

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { index?: number; value?: string }) => apiKeysApi.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accessKeys() })
    },
  })
}

/**
 * Gemini API keys hooks
 */
export const useGeminiKeys = () =>
  useQuery({
    queryKey: queryKeys.geminiKeys(),
    queryFn: () => geminiKeysApi.get(),
  })

export const useReplaceGeminiKeys = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keys: GeminiKey[]) => geminiKeysApi.replaceAll(keys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.geminiKeys() })
    },
  })
}

export const useUpdateGeminiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GeminiKeyPatchRequest) => geminiKeysApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.geminiKeys() })
    },
  })
}

export const useDeleteGeminiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { 'api-key'?: string; index?: number }) =>
      geminiKeysApi.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.geminiKeys() })
    },
  })
}

/**
 * Claude API keys hooks
 */
export const useClaudeKeys = () =>
  useQuery({
    queryKey: queryKeys.claudeKeys(),
    queryFn: () => claudeKeysApi.get(),
  })

export const useReplaceClaudeKeys = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keys: ClaudeKey[]) => claudeKeysApi.replaceAll(keys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claudeKeys() })
    },
  })
}

export const useUpdateClaudeKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ClaudeKeyPatchRequest) => claudeKeysApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claudeKeys() })
    },
  })
}

export const useDeleteClaudeKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { 'api-key'?: string; index?: number }) =>
      claudeKeysApi.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claudeKeys() })
    },
  })
}

/**
 * Codex API keys hooks
 */
export const useCodexKeys = () =>
  useQuery({
    queryKey: queryKeys.codexKeys(),
    queryFn: () => codexKeysApi.get(),
  })

export const useReplaceCodexKeys = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keys: CodexKey[]) => codexKeysApi.replaceAll(keys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.codexKeys() })
    },
  })
}

export const useUpdateCodexKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CodexKeyPatchRequest) => codexKeysApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.codexKeys() })
    },
  })
}

export const useDeleteCodexKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { 'api-key'?: string; index?: number }) =>
      codexKeysApi.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.codexKeys() })
    },
  })
}

/**
 * OpenAI compatibility hooks
 */
export const useOpenAICompatibility = () =>
  useQuery({
    queryKey: queryKeys.openaiCompatibility(),
    queryFn: () => openaiCompatibilityApi.get(),
  })

export const useReplaceOpenAICompatibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (configs: OpenAICompatibility[]) =>
      openaiCompatibilityApi.replaceAll(configs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openaiCompatibility() })
    },
  })
}

export const useUpdateOpenAICompatibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OpenAICompatibilityPatchRequest) =>
      openaiCompatibilityApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openaiCompatibility() })
    },
  })
}

export const useDeleteOpenAICompatibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { name?: string; index?: number }) =>
      openaiCompatibilityApi.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openaiCompatibility() })
    },
  })
}

/**
 * OAuth excluded models hooks
 */
export const useOAuthExcludedModels = () =>
  useQuery({
    queryKey: queryKeys.oauthExcludedModels(),
    queryFn: () => oauthExcludedModelsApi.get(),
  })

export const useReplaceOAuthExcludedModels = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (models: Record<string, string[]>) =>
      oauthExcludedModelsApi.replaceAll(models),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.oauthExcludedModels() })
    },
  })
}

export const useUpdateOAuthExcludedModels = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OAuthExcludedModelsPatchRequest) =>
      oauthExcludedModelsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.oauthExcludedModels() })
    },
  })
}

export const useDeleteOAuthExcludedModels = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (provider: string) => oauthExcludedModelsApi.delete(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.oauthExcludedModels() })
    },
  })
}
