import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

import { PROCESSING_STEPS } from '../../hooks/useCaptionGenerator.js'

/**
 * Vertical pipeline indicator shown while the AI is working.
 * Steps 1–3 are locally paced, the final step resolves with the request.
 */
export default function ProcessingSteps({ step, failed = false }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[0.72rem] font-semibold tracking-[0.18em] text-subtle uppercase">
          {failed ? 'Processing halted' : 'AI Processing Pipeline'}
        </h3>
        <span className="font-mono text-[0.7rem] text-subtle">
          {String(Math.min(step + 1, PROCESSING_STEPS.length)).padStart(2, '0')}/
          {String(PROCESSING_STEPS.length).padStart(2, '0')}
        </span>
      </div>

      <ol className="flex flex-col">
        {PROCESSING_STEPS.map((item, index) => {
          const isDone = index < step
          const isActive = index === step && !failed
          const isPending = index > step
          const isFailedStep = failed && index === step

          return (
            <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Connector */}
              {index < PROCESSING_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-8 bottom-0 left-[0.94rem] w-px -translate-x-1/2 overflow-hidden bg-white/10"
                >
                  <motion.span
                    className="absolute inset-x-0 top-0 bg-gradient-to-b from-brand-400 to-violet-400"
                    initial={{ height: '0%' }}
                    animate={{ height: isDone ? '100%' : '0%' }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </span>
              )}

              {/* Marker */}
              <span className="relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center">
                <AnimatePresence mode="wait" initial={false}>
                  {isDone ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      className="grid size-8 place-items-center rounded-full border border-emerald-400/40 bg-emerald-500/12 text-emerald-300"
                    >
                      <Check className="size-4" aria-hidden="true" />
                    </motion.span>
                  ) : isActive ? (
                    <motion.span
                      key="active"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative grid size-8 place-items-center rounded-full border border-brand-400/50 bg-brand-500/15 text-brand-200"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border border-brand-400/50"
                        style={{ animation: 'vc-pulse-ring 1.9s ease-out infinite' }}
                      />
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="pending"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className={`grid size-8 place-items-center rounded-full border text-[0.7rem] font-semibold ${
                        isFailedStep
                          ? 'border-rose-400/40 bg-rose-500/12 text-rose-300'
                          : 'border-white/10 bg-white/4 text-subtle'
                      }`}
                    >
                      {isFailedStep ? '!' : index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>

              {/* Label */}
              <div className="min-w-0 flex-1 pt-1">
                <p
                  className={`text-[0.9rem] font-medium transition-colors duration-300 ${
                    isDone
                      ? 'text-muted'
                      : isActive
                        ? 'text-ink'
                        : isFailedStep
                          ? 'text-rose-200'
                          : 'text-subtle'
                  }`}
                >
                  {item.label}
                  {isDone && <span className="ml-2 text-emerald-300">✓</span>}
                </p>
                <AnimatePresence initial={false}>
                  {(isActive || isDone) && !isPending ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden font-mono text-[0.68rem] tracking-wide text-subtle"
                    >
                      {item.detail}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
