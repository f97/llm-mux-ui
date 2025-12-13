/**
 * Settings React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import {
  debugApi,
  loggingToFileApi,
  usageStatisticsEnabledApi,
  proxyUrlApi,
  switchProjectApi,
  switchPreviewModelApi,
  requestLogApi,
  wsAuthApi,
  requestRetryApi,
  maxRetryIntervalApi,
} from '../endpoints'

// Helper to handle API errors that indicate "disabled" features
// Returns error message as part of data instead of throwing
async function safeSettingFetch<T extends object>(fetchFn: () => Promise<T>, defaultValue: T): Promise<T & { error?: string }> {
  try {
    const result = await fetchFn()
    return result as T & { error?: string }
  } catch (err) {
    if (err instanceof Error && (err.message.includes('disabled') || err.message.includes('not enabled'))) {
      return { ...defaultValue, error: err.message }
    }
    throw err
  }
}

/**
 * Debug mode hooks
 */
export const useDebug = () =>
  useQuery({
    queryKey: queryKeys.debug(),
    queryFn: () => debugApi.get(),
  })

export const useUpdateDebug = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: boolean) => debugApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.debug() })
      const previous = queryClient.getQueryData(queryKeys.debug())
      queryClient.setQueryData(queryKeys.debug(), { debug: value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.debug(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.debug() })
    },
  })
}

/**
 * Logging to file hooks
 */
export const useLoggingToFile = () =>
  useQuery({
    queryKey: queryKeys.loggingToFile(),
    queryFn: () => safeSettingFetch(loggingToFileApi.get, { 'logging-to-file': false }),
  })

export const useUpdateLoggingToFile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: boolean) => loggingToFileApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.loggingToFile() })
      const previous = queryClient.getQueryData(queryKeys.loggingToFile())
      queryClient.setQueryData(queryKeys.loggingToFile(), { 'logging-to-file': value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.loggingToFile(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loggingToFile() })
    },
  })
}

/**
 * Usage statistics enabled hooks
 */
export const useUsageStatisticsEnabled = () =>
  useQuery({
    queryKey: queryKeys.usageStatisticsEnabled(),
    queryFn: () => safeSettingFetch(usageStatisticsEnabledApi.get, { 'usage-statistics-enabled': false }),
  })

export const useUpdateUsageStatisticsEnabled = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: boolean) => usageStatisticsEnabledApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.usageStatisticsEnabled() })
      const previous = queryClient.getQueryData(queryKeys.usageStatisticsEnabled())
      queryClient.setQueryData(queryKeys.usageStatisticsEnabled(), {
        'usage-statistics-enabled': value,
      })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.usageStatisticsEnabled(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usageStatisticsEnabled() })
    },
  })
}

/**
 * Proxy URL hooks
 */
export const useProxyUrl = () =>
  useQuery({
    queryKey: queryKeys.proxyUrl(),
    queryFn: () => proxyUrlApi.get(),
  })

export const useUpdateProxyUrl = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: string) => proxyUrlApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.proxyUrl() })
      const previous = queryClient.getQueryData(queryKeys.proxyUrl())
      queryClient.setQueryData(queryKeys.proxyUrl(), { 'proxy-url': value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.proxyUrl(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proxyUrl() })
    },
  })
}

export const useDeleteProxyUrl = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => proxyUrlApi.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proxyUrl() })
    },
  })
}

/**
 * Switch project hooks
 */
export const useSwitchProject = () =>
  useQuery({
    queryKey: queryKeys.switchProject(),
    queryFn: () => switchProjectApi.get(),
  })

export const useUpdateSwitchProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: boolean) => switchProjectApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.switchProject() })
      const previous = queryClient.getQueryData(queryKeys.switchProject())
      queryClient.setQueryData(queryKeys.switchProject(), { 'switch-project': value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.switchProject(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.switchProject() })
    },
  })
}

/**
 * Switch preview model hooks
 */
export const useSwitchPreviewModel = () =>
  useQuery({
    queryKey: queryKeys.switchPreviewModel(),
    queryFn: () => switchPreviewModelApi.get(),
  })

export const useUpdateSwitchPreviewModel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: boolean) => switchPreviewModelApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.switchPreviewModel() })
      const previous = queryClient.getQueryData(queryKeys.switchPreviewModel())
      queryClient.setQueryData(queryKeys.switchPreviewModel(), {
        'switch-preview-model': value,
      })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.switchPreviewModel(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.switchPreviewModel() })
    },
  })
}

/**
 * Request log hooks
 */
export const useRequestLog = () =>
  useQuery({
    queryKey: queryKeys.requestLog(),
    queryFn: () => safeSettingFetch(requestLogApi.get, { 'request-log': false }),
  })

export const useUpdateRequestLog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: boolean) => requestLogApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.requestLog() })
      const previous = queryClient.getQueryData(queryKeys.requestLog())
      queryClient.setQueryData(queryKeys.requestLog(), { 'request-log': value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.requestLog(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestLog() })
    },
  })
}

/**
 * WebSocket authentication hooks
 */
export const useWsAuth = () =>
  useQuery({
    queryKey: queryKeys.wsAuth(),
    queryFn: () => wsAuthApi.get(),
  })

export const useUpdateWsAuth = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: boolean) => wsAuthApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wsAuth() })
      const previous = queryClient.getQueryData(queryKeys.wsAuth())
      queryClient.setQueryData(queryKeys.wsAuth(), { 'ws-auth': value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.wsAuth(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wsAuth() })
    },
  })
}

/**
 * Request retry hooks
 */
export const useRequestRetry = () =>
  useQuery({
    queryKey: queryKeys.requestRetry(),
    queryFn: () => requestRetryApi.get(),
  })

export const useUpdateRequestRetry = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: number) => requestRetryApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.requestRetry() })
      const previous = queryClient.getQueryData(queryKeys.requestRetry())
      queryClient.setQueryData(queryKeys.requestRetry(), { 'request-retry': value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.requestRetry(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestRetry() })
    },
  })
}

/**
 * Max retry interval hooks
 */
export const useMaxRetryInterval = () =>
  useQuery({
    queryKey: queryKeys.maxRetryInterval(),
    queryFn: () => maxRetryIntervalApi.get(),
  })

export const useUpdateMaxRetryInterval = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: number) => maxRetryIntervalApi.update({ value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.maxRetryInterval() })
      const previous = queryClient.getQueryData(queryKeys.maxRetryInterval())
      queryClient.setQueryData(queryKeys.maxRetryInterval(), { 'max-retry-interval': value })
      return { previous }
    },
    onError: (_err, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.maxRetryInterval(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maxRetryInterval() })
    },
  })
}
