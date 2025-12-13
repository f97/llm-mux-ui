/**
 * Authentication files types
 */

/**
 * Authentication file metadata
 */
export interface AuthFile {
  id: string
  auth_index?: number
  name: string
  type: string
  provider: string
  label?: string
  status: string
  status_message?: string
  disabled?: boolean
  unavailable?: boolean
  runtime_only?: boolean
  source: 'file' | 'memory'
  size?: number
  email?: string
  account_type?: string
  account?: string
  created_at?: string
  modtime?: string
  updated_at?: string
  last_refresh?: string
  path?: string
}

/**
 * List auth files response
 */
export interface AuthFilesResponse {
  files: AuthFile[]
}

/**
 * Delete auth files response
 */
export interface DeleteAuthFilesResponse {
  status: string
  deleted: number
}

/**
 * Vertex import response
 */
export interface VertexImportResponse {
  status: string
  'auth-file': string
  project_id: string
  email: string
  location: string
}

/**
 * Upload auth file request (multipart)
 */
export interface UploadAuthFileRequest {
  file: File
}

/**
 * Upload auth file request (JSON)
 */
export interface UploadAuthFileJsonRequest {
  name: string
  content: Record<string, unknown>
}

/**
 * Vertex import request
 */
export interface VertexImportRequest {
  file: File
  location?: string
}
