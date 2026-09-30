import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Animated number counter that starts when the element scrolls into view.
 * Respects `prefers-reduced-motion` by jumping straight to the final value.
 *
 * @param {number|null} target
 * @param {object} [options]
 * @param {number} [options.duration] ms
 * @param {number} [options.decimals]
 * @returns {{ value: number, formatted: string, nodeRef: import('react').RefObject<HTMLElement|null> }}
 */
export default function useCountUp(target, options = {}) {
  const { duration = 1600, decimals = 0 } = options
  const reduceMotion = useReducedMotion()

  const [display, setDisplay] = useState(0)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  const frameRef = useRef(0)
  const nodeRef = useRef(null)

  const isAnimatable = Number.isFinite(target) && !reduceMotion

  useEffect(() => {
    if (!isAnimatable || inView) return undefined
    if (typeof IntersectionObserver === 'undefined') return undefined

    const node = nodeRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isAnimatable, inView])

  useEffect(() => {
    if (!isAnimatable || !inView) return undefined

    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress)
      setDisplay(target * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isAnimatable, inView, target, duration])

  const value = Number.isFinite(target) ? (isAnimatable ? display : target) : 0

  return { value, formatted: value.toFixed(decimals), nodeRef }
}
