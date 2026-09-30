import { FlaskConical, Info, TriangleAlert } from 'lucide-react'

/**
 * Persistent, explicit labelling of Demo Mode output.
 * Used anywhere sample (non-measured) results are shown.
 */
export function DemoModePill({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-amber-300 uppercase ${className}`}
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      Demo Mode
    </span>
  )
}

/** Neutral inline note, e.g. to explain demo metrics. */
export function Note({ children, tone = 'info', className = '' }) {
  const tones = {
    info: 'border-white/10 bg-white/[0.035] text-subtle',
    warn: 'border-amber-400/20 bg-amber-400/[0.07] text-amber-200/90',
  }
  const Icon = tone === 'warn' ? TriangleAlert : Info

  return (
    <p
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-[0.78rem] leading-relaxed ${
        tones[tone] ?? tones.info
      } ${className}`}
    >
      <Icon className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export default DemoModePill
