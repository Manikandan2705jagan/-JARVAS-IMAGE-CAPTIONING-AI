/**
 * Caption service — the single boundary between the UI and the AI backend.
 *
 * Contract (FastAPI / Flask):
 *   POST {VITE_API_BASE_URL}/api/caption
 *   Content-Type: multipart/form-data
 *   image: <File>
 *
 *   200 -> { caption: string, confidence: number,
 *           objects?: string[], scene?: string, tokens?: number }
 *
 * No model logic lives in the React application. When no backend is reachable
 * the service transparently falls back to a clearly-labelled Demo Mode.
 */

import { CAPTION_ENDPOINT, DEMO_MODE } from '../config/env.js'
import { ApiError, request } from './apiClient.js'
import { createDemoResult } from './demoCaptions.js'

/** Thrown for user-fixable problems (bad file type/size, empty result...). */
export class CaptionError extends Error {
  constructor(message, code = 'CAPTION_FAILED') {
    super(message)
    this.name = 'CaptionError'
    this.code = code
  }
}

/**
 * Generate a caption for an image.
 *
 * @param {File} file
 * @param {object} [options]
 * @param {number} [options.variant] Regeneration counter.
 * @param {AbortSignal} [options.signal]
 * @param {boolean} [options.forceDemo]
 * @returns {Promise<import('./demoCaptions.js').createDemoResult extends never ? never : {
 *   caption: string, confidence: number, objects: string[],
 *   scene: string, demo: boolean, source: 'api' | 'demo', latencyMs: number
 * }>}
 */
export async function generateCaption(file, options = {}) {
  const { variant = 0, signal, forceDemo = false } = options

  if (!(file instanceof File)) {
    throw new CaptionError('No image was provided.', 'NO_FILE')
  }

  if (forceDemo || DEMO_MODE) {
    return simulateDemoLatency(createDemoResult(file, variant))
  }

  const startedAt = performance.now()
  const body = new FormData()
  body.append('image', file, file.name)
  if (variant > 0) body.append('variant', String(variant))

  try {
    const data = await request(CAPTION_ENDPOINT, { method: 'POST', body, signal })
    return normaliseApiResponse(data, performance.now() - startedAt)
  } catch (error) {
    // Network / 5xx failures degrade to Demo Mode instead of dead-ending the UX.
    if (error instanceof ApiError && (error.code === 'NETWORK_ERROR' || error.status >= 500)) {
      return {
        ...(await simulateDemoLatency(createDemoResult(file, variant))),
        fallbackReason: 'The AI backend is unreachable, so sample output is shown.',
      }
    }
    if (error instanceof ApiError) {
      throw new CaptionError(error.message, error.code)
    }
    throw error
  }
}

/** Defensive parsing — the backend contract is treated as untrusted input. */
function normaliseApiResponse(data, latencyMs) {
  if (!data || typeof data !== 'object') {
    throw new CaptionError('The AI service returned an unexpected response.', 'BAD_RESPONSE')
  }

  const caption = typeof data.caption === 'string' ? data.caption.trim() : ''
  if (!caption) {
    throw new CaptionError('The AI service did not return a caption. Please try again.', 'EMPTY_CAPTION')
  }

  const rawConfidence = Number(data.confidence)
  const confidence = Number.isFinite(rawConfidence)
    ? Math.min(1, Math.max(0, rawConfidence > 1 ? rawConfidence / 100 : rawConfidence))
    : null

  return {
    caption,
    confidence,
    objects: Array.isArray(data.objects) ? data.objects.filter((o) => typeof o === 'string') : [],
    scene: typeof data.scene === 'string' ? data.scene : null,
    demo: false,
    source: 'api',
    latencyMs: Math.round(latencyMs),
  }
}

/** Demo Mode keeps a realistic rhythm so the processing animation is honest. */
function simulateDemoLatency(result) {
  const delay = 900 + Math.random() * 900
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...result, latencyMs: Math.round(delay) }), delay)
  })
}
