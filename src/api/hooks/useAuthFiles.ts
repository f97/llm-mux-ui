/**
 * Authentication files React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { authFilesApi, vertexApi } from '../endpoints'

/**
 * Authentication files hooks
 */
export const useAuthFiles = () =>
  useQuery({
    queryKey: queryKeys.authFilesList(),
    queryFn: () => authFilesApi.list(),
  })

export const useUploadAuthFile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => authFilesApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authFilesList() })
    },
  })
}

export const useUploadAuthFileJson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; content: Record<string, unknown> }) =>
      authFilesApi.uploadJson(data.name, data.content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authFilesList() })
    },
  })
}

export const useDeleteAuthFile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => authFilesApi.deleteByName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authFilesList() })
    },
  })
}

export const useDeleteAllAuthFiles = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authFilesApi.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authFilesList() })
    },
  })
}

export const useDownloadAuthFile = (name: string, enabled = false) =>
  useQuery({
    queryKey: queryKeys.authFileDownload(name),
    queryFn: () => authFilesApi.download(name),
    enabled,
  })

/**
 * Vertex AI import hooks
 */
export const useImportVertex = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { file: File; location?: string }) =>
      vertexApi.import(data.file, data.location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authFilesList() })
    },
  })
}
