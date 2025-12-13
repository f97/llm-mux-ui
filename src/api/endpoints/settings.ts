/**
 * Settings API endpoints
 */

import { apiClient } from '../client'
import type {
  DebugResponse,
  LoggingToFileResponse,
  UsageStatisticsEnabledResponse,
  ProxyUrlResponse,
  SwitchProjectResponse,
  SwitchPreviewModelResponse,
  RequestLogResponse,
  WsAuthResponse,
  RequestRetryResponse,
  MaxRetryIntervalResponse,
  SettingUpdateRequest,
  StatusOkResponse,
} from '../types'

/**
 * Debug mode endpoints
 */
export const debugApi = {
  get: () => apiClient.get<DebugResponse>('/debug'),
  update: (data: SettingUpdateRequest<boolean>) =>
    apiClient.put<StatusOkResponse>('/debug', data),
}

/**
 * Logging to file endpoints
 */
export const loggingToFileApi = {
  get: () => apiClient.get<LoggingToFileResponse>('/logging-to-file'),
  update: (data: SettingUpdateRequest<boolean>) =>
    apiClient.put<StatusOkResponse>('/logging-to-file', data),
}

/**
 * Usage statistics enabled endpoints
 */
export const usageStatisticsEnabledApi = {
  get: () => apiClient.get<UsageStatisticsEnabledResponse>('/usage-statistics-enabled'),
  update: (data: SettingUpdateRequest<boolean>) =>
    apiClient.put<StatusOkResponse>('/usage-statistics-enabled', data),
}

/**
 * Proxy URL endpoints
 */
export const proxyUrlApi = {
  get: () => apiClient.get<ProxyUrlResponse>('/proxy-url'),
  update: (data: SettingUpdateRequest<string>) =>
    apiClient.put<StatusOkResponse>('/proxy-url', data),
  delete: () => apiClient.delete<StatusOkResponse>('/proxy-url'),
}

/**
 * Switch project endpoints
 */
export const switchProjectApi = {
  get: () => apiClient.get<SwitchProjectResponse>('/quota-exceeded/switch-project'),
  update: (data: SettingUpdateRequest<boolean>) =>
    apiClient.put<StatusOkResponse>('/quota-exceeded/switch-project', data),
}

/**
 * Switch preview model endpoints
 */
export const switchPreviewModelApi = {
  get: () => apiClient.get<SwitchPreviewModelResponse>('/quota-exceeded/switch-preview-model'),
  update: (data: SettingUpdateRequest<boolean>) =>
    apiClient.put<StatusOkResponse>('/quota-exceeded/switch-preview-model', data),
}

/**
 * Request log endpoints
 */
export const requestLogApi = {
  get: () => apiClient.get<RequestLogResponse>('/request-log'),
  update: (data: SettingUpdateRequest<boolean>) =>
    apiClient.put<StatusOkResponse>('/request-log', data),
}

/**
 * WebSocket authentication endpoints
 */
export const wsAuthApi = {
  get: () => apiClient.get<WsAuthResponse>('/ws-auth'),
  update: (data: SettingUpdateRequest<boolean>) =>
    apiClient.put<StatusOkResponse>('/ws-auth', data),
}

/**
 * Request retry endpoints
 */
export const requestRetryApi = {
  get: () => apiClient.get<RequestRetryResponse>('/request-retry'),
  update: (data: SettingUpdateRequest<number>) =>
    apiClient.put<StatusOkResponse>('/request-retry', data),
}

/**
 * Max retry interval endpoints
 */
export const maxRetryIntervalApi = {
  get: () => apiClient.get<MaxRetryIntervalResponse>('/max-retry-interval'),
  update: (data: SettingUpdateRequest<number>) =>
    apiClient.put<StatusOkResponse>('/max-retry-interval', data),
}
