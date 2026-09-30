/**
 * Minimal, dependency-free REST client.
 *
 * Every network call made by the application goes through `request()` so that
 * base URL resolution, timeouts and error normalisation live in one place.
 */

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/env.js'

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {{ status?: number, code?: string, cause?: unknown }} [options]
   */
  constructor(message, options = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status ?? 0
    this.code = options.code ?? 'REQUEST_FAILED'
    this.cause = options.cause
  }
}

/** Build an absolute URL from the configured base URL and a path. */
export function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  const base = API_BASE_URL || ''
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Perform a request with an AbortController-based timeout.
 * @param {string} path
 * @param {RequestInit & { timeoutMs?: number }} [init]
 * @returns {Promise<any>}
 */
export async function request(path, init = {}) {
  const { timeoutMs = REQUEST_TIMEOUT_MS, signal, ...rest } = init
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new DOMException('Timeout', 'TimeoutError')), timeoutMs)

  // Allow an externally supplied signal to cancel the request too.
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason)
    else signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true })
  }

  try {
    const response = await fetch(buildUrl(path), { ...rest, signal: controller.signal })

    if (!response.ok) {
      throw new ApiError(await readErrorMessage(response), {
        status: response.status,
        code: response.status === 404 ? 'NOT_FOUND' : 'HTTP_ERROR',
      })
    }

    if (response.status === 204) return null
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
      throw new ApiError('The request took too long. Please try again.', {
        code: 'TIMEOUT',
        cause: error,
      })
    }
    throw new ApiError('Could not reach the captioning service.', {
      code: 'NETWORK_ERROR',
      cause: error,
    })
  } finally {
    clearTimeout(timer)
  }
}

async function readErrorMessage(response) {
  try {
    const data = await response.json()
    return data?.detail || data?.message || `Request failed with status ${response.status}`
  } catch {
    return `Request failed with status ${response.status}`
  }
}
