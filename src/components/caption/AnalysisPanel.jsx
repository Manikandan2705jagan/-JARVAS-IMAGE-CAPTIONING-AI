import { motion } from 'framer-motion'
import { Boxes, Gauge, MapPinned, Tag } from 'lucide-react'

import { formatConfidence } from '../../lib/validation.js'
import { DemoModePill } from '../ui/DemoNotice.jsx'

/**
 * "Image Analysis" panel — the structured metadata returned alongside the
 * caption. Fields the backend omits are simply hidden rather than faked.
 */
export default function AnalysisPanel({ result, isDemo }) {
  if (!result) return null

  const { objects = [], scene, confidence } = result
  const hasObjects = objects.length > 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="analysis-heading"
      className="flex flex-col gap-5 rounded-[1.4rem] border border-white/10 bg-surface-2/70 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          id="analysis-heading"
          className="flex items-center gap-2 font-display text-[1.02rem] font-semibold text-ink"
        >
          <Boxes className="size-4 text-brand-300" aria-hidden="true" />
          Image Analysis
        </h3>
        {isDemo && <DemoModePill />}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Object detection */}
        <div className="flex flex-col gap-2.5 rounded-2xl border border-white/8 bg-white/[0.025] p-4 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.16em] text-subtle uppercase">
            <Tag className="size-3" aria-hidden="true" />
            Object Detection
          </p>
          {hasObjects ? (
            <ul className="flex flex-wrap gap-2">
              {objects.map((object, index) => (
                <motion.li
                  key={`${object}-${index}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.32 }}
                  className="rounded-full border border-brand-400/22 bg-brand-500/10 px-3 py-1.5 text-[0.8rem] font-medium text-brand-200"
                >
                  {object}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.82rem] text-subtle">
              Not provided by the current model endpoint.
            </p>
          )}
        </div>

        {/* Scene */}
        <div className="flex flex-col gap-2.5 rounded-2xl border border-white/8 bg-white/[0.025] p-4">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.16em] text-subtle uppercase">
            <MapPinned className="size-3" aria-hidden="true" />
            Scene
          </p>
          <p className="font-display text-[1.02rem] font-medium text-ink">
            {scene ?? '—'}
          </p>
        </div>

        {/* Confidence */}
        <div className="flex flex-col gap-2.5 rounded-2xl border border-white/8 bg-white/[0.025] p-4">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.16em] text-subtle uppercase">
            <Gauge className="size-3" aria-hidden="true" />
            Confidence
          </p>
          <div className="flex items-center gap-3">
            <p className="font-display text-[1.35rem] font-semibold text-ink">
              {formatConfidence(confidence)}
            </p>
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8"
              role="meter"
              aria-valuenow={Math.round((confidence ?? 0) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Model confidence"
            >
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${(confidence ?? 0) * 100}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
