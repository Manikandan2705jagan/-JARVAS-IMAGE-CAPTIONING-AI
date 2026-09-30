import { motion } from 'framer-motion'
import { ChartNoAxesColumn, Info } from 'lucide-react'

import { METRICS } from '../../config/site.js'
import useCountUp from '../../hooks/useCountUp.js'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'

function MetricCard({ metric, index }) {
  const { formatted, nodeRef } = useCountUp(metric.value, { decimals: metric.decimals ?? 0 })

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <article className="glass card-hover group relative flex h-full flex-col gap-3 overflow-hidden rounded-[1.35rem] p-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-brand-500/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative flex items-center justify-between">
          <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-brand-300">
            <metric.icon className="size-4.5" aria-hidden="true" />
          </span>
          <span className="font-mono text-[0.62rem] tracking-[0.18em] text-subtle uppercase">
            0{index + 1}
          </span>
        </div>

        <p ref={nodeRef} className="relative font-display text-[2.6rem] leading-none font-semibold text-gradient">
          {metric.display ?? formatted}
          {metric.suffix ? <span className="text-brand-300">{metric.suffix}</span> : null}
        </p>

        <div className="relative flex flex-col gap-1">
          <p className="text-[0.9rem] font-medium text-ink">{metric.label}</p>
          <p className="text-[0.76rem] text-subtle">{metric.note}</p>
        </div>

        <span aria-hidden="true" className="relative mt-1 h-0.5 w-full overflow-hidden rounded-full bg-white/8">
          <motion.span
            className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-400"
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      </article>
    </Reveal>
  )
}

export default function Metrics() {
  return (
    <Section id="metrics" className="py-24 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow="Dashboard"
        eyebrowIcon={ChartNoAxesColumn}
        title="System Snapshot"
        description="A quick look at the targets this project is designed around."
      />

      <div className="mx-auto mt-12 flex max-w-2xl justify-center">
        <p className="flex items-start gap-2.5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] px-4 py-3 text-[0.8rem] leading-relaxed text-amber-200/90">
          <Info className="mt-px size-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Demo Metrics.</strong> The figures below are
            illustrative placeholders that ship with the UI for design purposes. They are not
            measured results — connect a trained model and replace them with real evaluation output.
          </span>
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>
    </Section>
  )
}
