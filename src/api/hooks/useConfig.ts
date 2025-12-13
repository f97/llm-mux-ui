/**
 * Configuration React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { configApi } from '../endpoints'

/**
 * Configuration JSON hook
 */
export const useConfigJson = () =>
  useQuery({
    queryKey: queryKeys.configJson(),
    queryFn: () => configApi.getJson(),
  })

/**
 * Configuration YAML hook
 */
export const useConfigYaml = () =>
  useQuery({
    queryKey: queryKeys.configYaml(),
    queryFn: () => configApi.getYaml(),
  })

/**
 * Update configuration YAML
 */
export const useUpdateConfigYaml = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (yaml: string) => configApi.updateYaml(yaml),
    onSuccess: () => {
      // Invalidate all config-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.config })
      // Also invalidate settings since they might have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.settings })
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys })
    },
  })
}

/**
 * Latest version hook
 */
export const useLatestVersion = () =>
  useQuery({
    queryKey: queryKeys.latestVersion(),
    queryFn: () => configApi.getLatestVersion(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
