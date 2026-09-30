import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in view so the navbar can highlight it.
 * Uses an IntersectionObserver rather than scroll maths for better performance.
 *
 * @param {string[]} ids
 * @param {{ rootMargin?: string, threshold?: number }} [options]
 * @returns {string} activeId
 */
export default function useScrollSpy(ids, options = {}) {
  const { rootMargin = '-45% 0px -50% 0px', threshold = 0 } = options
  const [activeId, setActiveId] = useState(ids[0] ?? '')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element) => element !== null)

    if (elements.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin, threshold },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids, rootMargin, threshold])

  return activeId
}
