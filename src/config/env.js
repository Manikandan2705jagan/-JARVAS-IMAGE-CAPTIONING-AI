/**
 * Centralised runtime configuration.
 *
 * Every value is sourced from Vite environment variables so the same build can
 * be pointed at a real Python/FastAPI backend without touching component code.
 * See `.env.example` for the full list of supported keys.
 */

const env = import.meta.env

const toBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase())
}

const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

/** Base URL of the captioning REST API. Empty string = same-origin + proxy. */
export const API_BASE_URL = (env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

/** Endpoint that accepts `multipart/form-data` with an `image` field. */
export const CAPTION_ENDPOINT = env.VITE_API_CAPTION_PATH ?? '/api/caption'

/**
 * Demo mode returns curated sample responses from the UI itself.
 * Auto-enabled whenever no API base URL is configured.
 */
export const DEMO_MODE = toBoolean(env.VITE_DEMO_MODE, API_BASE_URL === '')

/** Abort the request if the backend takes longer than this (ms). */
export const REQUEST_TIMEOUT_MS = toNumber(env.VITE_API_TIMEOUT_MS, 30_000)

/** Uploader guard rails. */
export const MAX_FILE_SIZE_MB = toNumber(env.VITE_MAX_FILE_SIZE_MB, 10)
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
export const ACCEPTED_LABEL = 'JPG • JPEG • PNG • WEBP'

/** Placeholder social links — replace with your real profiles. */
export const LINKS = {
  github: env.VITE_GITHUB_URL ?? 'https://github.com/your-username/jarvas-image-captioning-ai',
  linkedin: env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/in/your-username/',
}

export const APP_VERSION = env.VITE_APP_VERSION ?? '1.0.0'
