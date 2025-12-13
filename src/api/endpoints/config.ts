/**
 * Configuration endpoints
 */

import { apiClient } from '../client'
import type { Config, LatestVersionResponse, ConfigUpdateResponse } from '../types'

/**
 * Configuration endpoints
 */
export const configApi = {
  /**
   * Get current configuration (JSON)
   */
  getJson: () => apiClient.get<Config>('/config'),

  /**
   * Get raw config.yaml file
   */
  getYaml: () => apiClient.get<string>('/config.yaml'),

  /**
   * Replace config.yaml file
   */
  updateYaml: (yaml: string) =>
    apiClient.put<ConfigUpdateResponse>('/config.yaml', yaml, undefined, 'application/yaml'),

  /**
   * Get latest version from GitHub
   */
  getLatestVersion: () => apiClient.get<LatestVersionResponse>('/latest-version'),
}
