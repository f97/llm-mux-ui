/**
 * Base API client for llm-mux Management API
 */

import type { AuthConfig, ApiError } from './types/common'

/**
 * Custom API error class
 */
export class ApiClientError extends Error {
  statusCode: number
  error: string

  constructor(statusCode: number, error: string, message?: string) {
    super(message || error)
    this.name = 'ApiClientError'
    this.statusCode = statusCode
    this.error = error
  }
}

/**
 * API Client configuration
 */
export interface ApiClientConfig {
  baseUrl?: string
  auth?: AuthConfig
}

/**
 * Base API client for making HTTP requests
 */
export class ApiClient {
  private baseUrl: string
  private auth?: AuthConfig

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl =
      config.baseUrl ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:8318/v0/management'
    this.auth = config.auth
  }

  /**
   * Set authentication credentials
   */
  setAuth(auth: AuthConfig) {
    this.auth = auth
  }

  /**
   * Set base URL
   */
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    if (!this.auth) {
      return {}
    }

    if (this.auth.bearerToken) {
      return {
        Authorization: `Bearer ${this.auth.bearerToken}`,
      }
    }

    if (this.auth.managementKey) {
      return {
        'X-Management-Key': this.auth.managementKey,
      }
    }

    return {}
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    // Ensure baseUrl ends with / and endpoint doesn't start with /
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`
    const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = new URL(path, base)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    // Handle non-JSON responses (e.g., binary files, YAML)
    if (contentType && !contentType.includes('application/json')) {
      if (contentType.includes('application/octet-stream')) {
        return (await response.blob()) as T
      }
      if (contentType.includes('application/yaml') || contentType.includes('text/yaml')) {
        return (await response.text()) as T
      }
      return (await response.text()) as T
    }

    // Parse JSON response
    const data = await response.json()

    if (!response.ok) {
      const error: ApiError = data
      throw new ApiClientError(
        response.status,
        error.error || 'Unknown error',
        error.message
      )
    }

    // Handle error responses that come with 200 status (e.g., "logging to file disabled")
    // These are not thrown as errors but returned with the error field
    // The calling code should handle this case
    return data
  }

  /**
   * Make GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    })

    return this.handleResponse<T>(response)
  }

  /**
   * Make POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params)

    const isFormData = body instanceof FormData
    const headers: Record<string, string> = {
      ...this.getAuthHeaders(),
    }

    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    })

    return this.handleResponse<T>(response)
  }

  /**
   * Make PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>,
    contentType?: string
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params)

    const headers: Record<string, string> = {
      ...this.getAuthHeaders(),
      'Content-Type': contentType || 'application/json',
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: contentType === 'application/yaml' ? (body as string) : JSON.stringify(body),
    })

    return this.handleResponse<T>(response)
  }

  /**
   * Make PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params)

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return this.handleResponse<T>(response)
  }

  /**
   * Make DELETE request
   */
  async delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params)

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    })

    return this.handleResponse<T>(response)
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient()
