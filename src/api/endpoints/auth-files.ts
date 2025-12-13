/**
 * Authentication files endpoints
 */

import { apiClient } from '../client'
import type {
  AuthFilesResponse,
  DeleteAuthFilesResponse,
  VertexImportResponse,
  StatusOkResponse,
} from '../types'

/**
 * Authentication files endpoints
 */
export const authFilesApi = {
  /**
   * List all authentication files
   */
  list: () => apiClient.get<AuthFilesResponse>('/auth-files'),

  /**
   * Upload authentication file (multipart)
   */
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<StatusOkResponse>('/auth-files', formData)
  },

  /**
   * Upload authentication file (JSON)
   */
  uploadJson: (name: string, content: Record<string, unknown>) => {
    return apiClient.post<StatusOkResponse>('/auth-files', content, { name })
  },

  /**
   * Delete authentication file by name
   */
  deleteByName: (name: string) =>
    apiClient.delete<DeleteAuthFilesResponse>('/auth-files', { name }),

  /**
   * Delete all authentication files
   */
  deleteAll: () => apiClient.delete<DeleteAuthFilesResponse>('/auth-files', { all: 'true' }),

  /**
   * Download authentication file
   */
  download: (name: string) =>
    apiClient.get<Record<string, unknown>>('/auth-files/download', { name }),
}

/**
 * Vertex AI import endpoints
 */
export const vertexApi = {
  /**
   * Import Vertex AI service account credential
   */
  import: (file: File, location?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (location) {
      formData.append('location', location)
    }
    return apiClient.post<VertexImportResponse>('/vertex/import', formData)
  },
}
