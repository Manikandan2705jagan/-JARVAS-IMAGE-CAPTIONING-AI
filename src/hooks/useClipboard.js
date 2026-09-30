import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copy text to the clipboard with a short-lived confirmation state.
 * Falls back to `document.execCommand` for non-secure contexts and surfaces an
 * explicit failure state so the user is never left guessing.
 *
 * @param {number} [resetAfter] ms
 * @returns {{
 *   status: 'idle'|'copied'|'failed',
 *   copied: boolean,
 *   copy: (text: string) => Promise<boolean>,
 *   reset: () => void,
 * }}
 */
export default function useClipboard(resetAfter = 2200) {
  const [status, setStatus] = useState('idle')
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    setStatus('idle')
  }, [])

  const copy = useCallback(
    async (text) => {
      const succeeded = await writeToClipboard(text)
      setStatus(succeeded ? 'copied' : 'failed')
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setStatus('idle'), resetAfter)
      return succeeded
    },
    [resetAfter],
  )

  return { status, copied: status === 'copied', copy, reset }
}

async function writeToClipboard(text) {
  if (!text) return false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the legacy path */
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
