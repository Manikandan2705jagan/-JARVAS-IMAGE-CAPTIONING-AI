import { ACCEPTED_EXTENSIONS, ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_MB } from '../config/env.js'

const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

/** @typedef {{ valid: boolean, error: string | null }} ValidationResult */

/**
 * Validate an uploaded image before it reaches the AI service.
 * @param {File} file
 * @returns {ValidationResult}
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'No file selected. Please choose an image.' }

  const isAcceptedMime = ACCEPTED_MIME_TYPES.includes(file.type)
  const extension = getExtension(file.name)
  const isAcceptedExtension = ACCEPTED_EXTENSIONS.includes(extension)

  // Some browsers/OS report an empty MIME type for valid images, so the
  // extension acts as a safe secondary signal.
  if (!isAcceptedMime && !(file.type === '' && isAcceptedExtension)) {
    return {
      valid: false,
      error: `Unsupported file type${file.type ? ` (${file.type})` : ''}. Please upload a JPG, PNG or WEBP image.`,
    }
  }

  if (file.size === 0) {
    return { valid: false, error: 'That file is empty. Please choose a different image.' }
  }

  if (file.size > MAX_BYTES) {
    return {
      valid: false,
      error: `Image is ${formatBytes(file.size)} — the maximum supported size is ${MAX_FILE_SIZE_MB} MB.`,
    }
  }

  return { valid: true, error: null }
}

/** Read the first file from a drop / input event. */
export function extractFirstFile(source) {
  if (!source) return null
  if (source instanceof File) return source
  if (Array.isArray(source)) return source[0] ?? null
  if (typeof source.length === 'number') return source.item ? source.item(0) : source[0] ?? null
  return null
}

function getExtension(name = '') {
  const index = name.lastIndexOf('.')
  return index === -1 ? '' : name.slice(index).toLowerCase()
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`
}

export function formatConfidence(confidence) {
  if (confidence === null || confidence === undefined || !Number.isFinite(confidence)) return '—'
  return `${(confidence * 100).toFixed(1)}%`
}
