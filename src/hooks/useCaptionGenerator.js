import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { generateCaption } from '../services/captionService.js'
import { validateImageFile } from '../lib/validation.js'

/** Ordered pipeline stages surfaced while the AI is working. */
export const PROCESSING_STEPS = [
  { id: 'upload', label: 'Uploading image', detail: 'Secure multipart transfer' },
  { id: 'features', label: 'Extracting visual features', detail: 'ResNet-50 encoder forward pass' },
  { id: 'context', label: 'Understanding image context', detail: 'Scene & object relations' },
  { id: 'generate', label: 'Generating caption', detail: 'Transformer decoding tokens' },
  { id: 'ready', label: 'Caption ready', detail: 'Post-processing complete' },
]

/** Milliseconds the UI dwells on each *local* stage before the next begins. */
const STAGE_TIMINGS = [320, 900, 1500]

const LAST_STEP = PROCESSING_STEPS.length - 1
const GENERATING_STEP = 3

/**
 * Owns the whole captioning workflow: file selection, validation, the request
 * lifecycle and the progress stage machine.
 *
 * @returns {{
 *   status: 'idle'|'loading'|'success'|'error',
 *   file: File|null, previewUrl: string|null, result: object|null,
 *   error: string|null, step: number, isDemo: boolean, metrics: object|null,
 *   selectFile: (file: File|undefined) => void, removeImage: () => void,
 *   regenerate: () => void, retry: () => void
 * }}
 */
export default function useCaptionGenerator() {
  const [status, setStatus] = useState('idle')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(0)
  const [variant, setVariant] = useState(0)

  const timersRef = useRef([])
  const runIdRef = useRef(0)
  const fileRef = useRef(null)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  /* Object URL lifecycle ------------------------------------------------- */
  // Created during render and released on change/unmount, so no state update
  // is needed to track it.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    if (!previewUrl) return undefined
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  /* Request lifecycle ---------------------------------------------------- */
  const run = useCallback(
    async (targetFile, nextVariant, options = {}) => {
      const { keepResult = false } = options
      const runId = runIdRef.current + 1
      runIdRef.current = runId
      clearTimers()

      setStatus('loading')
      setError(null)
      if (!keepResult) setResult(null)
      setStep(0)

      // Walk through the locally-simulated stages; the final stage resolves
      // only when the real request settles.
      STAGE_TIMINGS.forEach((delay, index) => {
        timersRef.current.push(
          setTimeout(() => {
            if (runIdRef.current === runId) setStep(index + 1)
          }, delay),
        )
      })

      try {
        const data = await generateCaption(targetFile, { variant: nextVariant })
        if (runIdRef.current !== runId) return

        setResult(data)
        setStatus('success')
        setStep(LAST_STEP)
      } catch (requestError) {
        if (runIdRef.current !== runId) return

        setStatus('error')
        setError(requestError?.message ?? 'Something went wrong while generating the caption.')
        setStep(GENERATING_STEP)
      }
    },
    [clearTimers],
  )

  /* Public actions ------------------------------------------------------- */
  const selectFile = useCallback(
    (incoming) => {
      if (!incoming) return

      const { valid, error: validationError } = validateImageFile(incoming)
      if (!valid) {
        setFile(null)
        fileRef.current = null
        setResult(null)
        setStatus('error')
        setError(validationError)
        return
      }

      fileRef.current = incoming
      setFile(incoming)
      setVariant(0)
      run(incoming, 0)
    },
    [run],
  )

  const removeImage = useCallback(() => {
    clearTimers()
    runIdRef.current += 1
    fileRef.current = null
    setFile(null)
    setResult(null)
    setError(null)
    setVariant(0)
    setStatus('idle')
    setStep(0)
  }, [clearTimers])

  const regenerate = useCallback(() => {
    if (!fileRef.current) return
    const next = variant + 1
    setVariant(next)
    // Keep the previous caption on screen while a new one is generated.
    run(fileRef.current, next, { keepResult: true })
  }, [run, variant])

  const retry = useCallback(() => {
    if (!fileRef.current) {
      setStatus('idle')
      return
    }
    run(fileRef.current, variant)
  }, [run, variant])

  return {
    status,
    file,
    previewUrl,
    result,
    error,
    step,
    variant,
    isBusy: status === 'loading',
    isDemo: result?.demo ?? true,
    progress: Math.min(100, Math.round(((step + 1) / PROCESSING_STEPS.length) * 100)),
    selectFile,
    removeImage,
    regenerate,
    retry,
  }
}
