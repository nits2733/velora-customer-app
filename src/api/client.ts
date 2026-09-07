// Relative — same-origin in dev (proxied to the backend by vite.config.ts's
// server.proxy) and in production (behind a reverse proxy that routes /api).
const BASE_URL = ''

let accessToken: string | null = null
let refreshToken: string | null = null

// Called by AuthContext when a token refresh fails, so it can clear the
// user's session state in sync with this module's tokens being cleared.
let onSessionExpired: (() => void) | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

export function setRefreshToken(token: string | null) {
  refreshToken = token
}

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler
}

type AuthTokenResponse = { accessToken: string; refreshToken: string }

let refreshInFlight: Promise<AuthTokenResponse> | null = null

// De-duplicates concurrent refresh attempts (several requests can 401 at
// once) — everyone awaits the same in-flight refresh call.
function refreshTokens(): Promise<AuthTokenResponse> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(res => {
        if (!res.ok) throw new Error('refresh failed')
        return res.json() as Promise<AuthTokenResponse>
      })
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        query.set(k, String(v))
      }
    })
  }
  const queryString = query.toString()
  return `${BASE_URL}${path}${queryString ? `?${queryString}` : ''}`
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return doRequest<T>(path, options, /* allowRefresh */ true)
}

async function doRequest<T>(path: string, options: RequestOptions, allowRefresh: boolean): Promise<T> {
  const { method = 'GET', body, headers = {}, params } = options

  const reqHeaders: Record<string, string> = {
    ...headers,
  }

  if (accessToken) {
    reqHeaders['Authorization'] = `Bearer ${accessToken}`
  }

  if (body && !(body instanceof FormData)) {
    reqHeaders['Content-Type'] = 'application/json'
  }

  const res = await fetch(buildUrl(path, params), {
    method,
    headers: reqHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && allowRefresh && refreshToken && !path.startsWith('/api/auth/')) {
    try {
      const tokens = await refreshTokens()
      accessToken = tokens.accessToken
      refreshToken = tokens.refreshToken
      return doRequest<T>(path, options, /* allowRefresh */ false)
    } catch {
      accessToken = null
      refreshToken = null
      onSessionExpired?.()
      throw new ApiError(401, 'Session expired')
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let message = text || res.statusText
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed.message === 'string') message = parsed.message
    } catch {
      // Body wasn't JSON — fall back to the raw text/status already set above.
    }
    throw new ApiError(res.status, message)
  }

  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json()
  }

  return undefined as T
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

// Convenience methods
export const api = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),

  upload: <T>(path: string, file: File, folder?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<T>(
      path,
      { method: 'POST', body: formData, params: folder ? { folder } : undefined }
    )
  },
}
