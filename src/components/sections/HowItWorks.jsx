import { motion } from 'framer-motion'
import { ChevronDown, Route, Workflow } from 'lucide-react'

import { HOW_IT_WORKS_STEPS, PIPELINE_STAGES } from '../../config/site.js'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'

export default function HowItWorks() {
  return (
    <Section id="how-it-works" tone="sunken" className="py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />

      <SectionHeading
        eyebrow="Pipeline"
        eyebrowIcon={Route}
        title="How It Works"
        description="Four composable stages take a raw image file and turn it into a sentence. Each stage is a separate, replaceable component in the backend."
      />

      {/* Steps ------------------------------------------------------------- */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <Reveal key={step.id} delay={index * 0.09} className="group relative h-full">
            <article className="glass card-hover relative flex h-full flex-col gap-4 overflow-hidden rounded-[1.4rem] p-5">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-brand-500/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-violet-500/10 text-brand-200 transition-colors duration-500 group-hover:border-brand-400/40">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-2xl font-semibold text-white/8 transition-colors duration-500 group-hover:text-white/20">
                  {step.number}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display text-[1.06rem] font-semibold text-ink">{step.title}</h3>
                <p className="text-[0.87rem] leading-relaxed text-muted">{step.description}</p>
              </div>

              <span
                aria-hidden="true"
                className="mt-auto h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-400/70 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
            </article>

            {index < HOW_IT_WORKS_STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 -right-2 z-10 hidden size-4 -translate-y-1/2 place-items-center lg:grid"
              >
                <ChevronDown className="size-4 rotate-[-90deg] text-white/25" />
              </span>
            )}
          </Reveal>
        ))}
      </div>

      {/* Pipeline ---------------------------------------------------------- */}
      <Reveal delay={0.1} className="mt-16">
        <div className="glass overflow-hidden rounded-[1.75rem] p-6 sm:p-9">
          <div className="mb-7 flex items-center gap-2.5">
            <Workflow className="size-4 text-brand-300" aria-hidden="true" />
            <h3 className="font-display text-[1.05rem] font-semibold text-ink">
              End-to-end processing pipeline
            </h3>
          </div>

          <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {PIPELINE_STAGES.map((stage, index) => (
              <li key={stage} className="flex flex-1 flex-col items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07, duration: 0.5 }}
                  className={`w-full rounded-xl border px-3.5 py-3 text-center font-mono text-[0.72rem] tracking-wider uppercase ${
                    index === PIPELINE_STAGES.length - 1
                      ? 'border-brand-400/35 bg-brand-500/12 text-brand-200'
                      : index === 0
                        ? 'border-white/15 bg-white/6 text-ink'
                        : 'border-white/10 bg-white/[0.03] text-muted'
                  }`}
                >
                  {stage}
                </motion.span>

                {index < PIPELINE_STAGES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="grid size-6 rotate-90 place-items-center sm:rotate-0"
                  >
                    <span className="h-px w-6 bg-gradient-to-r from-brand-400/60 to-violet-400/25 sm:w-4" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  )
}
