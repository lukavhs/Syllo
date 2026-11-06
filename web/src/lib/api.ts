/**
 * The one place that talks HTTP to the API. Everything else calls `apiRequest()`,
 * so the base URL, the auth header and error handling are written exactly once.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ───────────── Token storage ─────────────

const TOKEN_KEY = 'syllo.token'

/**
 * localStorage survives reloads, which is why we use it. Access can throw (private
 * browsing, blocked storage), so every call is wrapped; the app then just acts signed out.
 */
export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // storage unavailable: the session lasts until the tab closes
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // nothing to clear
    }
  },
}

// ───────────── Errors ─────────────

export class ApiError extends Error {
  /** HTTP status; 0 means the request never reached the server. */
  readonly status: number
  /** Per-field validation messages, e.g. { password: 'Must be longer…' }. */
  readonly fieldErrors: Record<string, string>

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

/**
 * Nest's ValidationPipe answers 400 with { message: ["password must be longer than…", …] }.
 * Each message starts with the field name, so we split it off to show the error under that field.
 */
function toApiError(status: number, body: unknown): ApiError {
  const raw = (body as { message?: unknown } | null)?.message
  if (Array.isArray(raw)) {
    const fieldErrors: Record<string, string> = {}
    for (const msg of raw) {
      if (typeof msg !== 'string') continue
      const [field, ...rest] = msg.split(' ')
      const text = rest.join(' ')
      fieldErrors[field] ??= text.charAt(0).toUpperCase() + text.slice(1)
    }
    return new ApiError('Please fix the highlighted fields.', status, fieldErrors)
  }
  return new ApiError(typeof raw === 'string' ? raw : 'Something went wrong. Please try again.', status)
}

// ───────────── Requests ─────────────

let onUnauthorized: (() => void) | null = null

/** The session registers a callback here so an expired token signs the user out everywhere. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const token = tokenStore.get()
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0)
  }

  const data: unknown = res.status === 204 ? null : await res.json().catch(() => null)

  if (!res.ok) {
    // A 401 while we HAD a token means it expired or was revoked. (A 401 from the
    // login form itself, with no token, is just "wrong password" and must not sign out.)
    if (res.status === 401 && token) onUnauthorized?.()
    throw toApiError(res.status, data)
  }

  // We trust the API's response shape here; T is what the endpoint is documented to return.
  return data as T
}
