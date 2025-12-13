/**
 * OAuth Security Utilities
 */

const ALLOWED_OAUTH_HOSTS = [
  'accounts.google.com',
  'console.anthropic.com',
  'github.com',
  'login.microsoftonline.com',
  'auth.openai.com',
  'chat.qwen.ai',
  'localhost',
  '127.0.0.1',
]

/**
 * OAuth state manager with CSRF protection
 */
export class OAuthStateManager {
  private static readonly STORAGE_KEY = 'oauth_pending_states'
  private static readonly STATE_TTL_MS = 10 * 60 * 1000 // 10 minutes

  static store(state: string, provider: string): void {
    const states = this.getPendingStates()
    states[state] = { provider, timestamp: Date.now() }
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(states))
  }

  static validate(state: string, provider: string): boolean {
    const states = this.getPendingStates()
    const stored = states[state]

    if (!stored || stored.provider !== provider) return false
    if (Date.now() - stored.timestamp > this.STATE_TTL_MS) {
      this.clear(state)
      return false
    }

    this.clear(state)
    return true
  }

  static clear(state: string): void {
    const states = this.getPendingStates()
    delete states[state]
    if (Object.keys(states).length === 0) {
      sessionStorage.removeItem(this.STORAGE_KEY)
    } else {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(states))
    }
  }

  static clearAll(): void {
    sessionStorage.removeItem(this.STORAGE_KEY)
  }

  static getPendingStates(): Record<string, { provider: string; timestamp: number }> {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }
}

/**
 * Validate OAuth URL against whitelist
 */
export function validateOAuthUrl(url: string): boolean {
  if (!url) return false
  try {
    const { hostname } = new URL(url)
    return ALLOWED_OAUTH_HOSTS.includes(hostname)
  } catch {
    return false
  }
}

/**
 * Sanitize OAuth error messages
 */
export function sanitizeOAuthError(error: string): string {
  if (!error) return 'OAuth authentication failed'
  return error
    .replace(/token[=:]\s*[^\s,;)]+/gi, 'token=***')
    .replace(/(?:client_)?secret[=:]\s*[^\s,;)]+/gi, 'secret=***')
    .replace(/https?:\/\/[^\s)]+/g, '[URL]')
    .replace(/\b[a-f0-9]{32,}\b/gi, '***')
}
