import { motion, useReducedMotion } from 'framer-motion'
import { Network } from 'lucide-react'

import { ARCHITECTURE_STAGES } from '../../config/site.js'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'

const KIND_STYLES = {
  io: { ring: 'border-white/15', tint: 'from-white/10 to-white/[0.02]', text: 'text-ink' },
  process: {
    ring: 'border-sky-400/25',
    tint: 'from-sky-500/12 to-sky-500/[0.02]',
    text: 'text-sky-200',
  },
  model: {
    ring: 'border-violet-400/30',
    tint: 'from-violet-500/16 to-violet-500/[0.02]',
    text: 'text-violet-200',
  },
  output: {
    ring: 'border-emerald-400/30',
    tint: 'from-emerald-500/16 to-emerald-500/[0.02]',
    text: 'text-emerald-200',
  },
}

const SUBTITLES = {
  upload: 'multipart/form-data',
  preprocess: 'resize · normalise · augment',
  resnet: 'ImageNet-pretrained backbone',
  features: '2048-d global vector',
  embedding: 'projection → decoder space',
  decoder: 'causal attention · beam search',
  tokens: '<start> … <end>',
  postprocess: 'detokenise · sentence case',
  result: '{ "caption": string }',
}

export default function Architecture() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="architecture" tone="sunken" className="py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />

      <SectionHeading
        eyebrow="System Design"
        eyebrowIcon={Network}
        title="AI Architecture"
        description="Nine discrete stages separate concerns cleanly: the frontend never runs model code, it only consumes the JSON produced at the end of this pipeline."
      />

      <div className="relative mx-auto mt-14 max-w-3xl">
        {/* Rail ------------------------------------------------------------ */}
        <div
          aria-hidden="true"
          className="absolute top-6 bottom-6 left-[1.4rem] w-px -translate-x-1/2 bg-white/8 sm:left-1/2"
        >
          <motion.div
            className="absolute inset-x-0 h-1/4 bg-gradient-to-b from-brand-400 via-violet-400 to-cyan-400"
            initial={reduceMotion ? { top: 0 } : { top: '-25%' }}
            animate={reduceMotion ? { top: 0 } : { top: '125%' }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <ol className="flex flex-col gap-5">
          {ARCHITECTURE_STAGES.map((stage, index) => {
            const style = KIND_STYLES[stage.kind] ?? KIND_STYLES.process
            const isRight = index % 2 === 1

            return (
              <Reveal
                as="li"
                key={stage.id}
                delay={index * 0.05}
                y={18}
                className="relative pl-14 sm:pl-0"
              >
                <div
                  className={`flex items-center gap-4 sm:w-1/2 sm:px-8 ${
                    isRight ? 'sm:ml-auto' : 'sm:mr-auto sm:flex-row-reverse sm:text-right'
                  }`}
                >
                  <article
                    className={`group relative flex flex-1 items-center gap-3.5 overflow-hidden rounded-2xl border bg-gradient-to-br ${style.ring} ${style.tint} p-4 backdrop-blur-sm transition-all duration-500 hover:border-white/30`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-void/60">
                      <stage.icon className={`size-4.5 ${style.text}`} aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[0.62rem] tracking-[0.18em] text-subtle uppercase">
                        {String(index + 1).padStart(2, '0')} · {stage.kind}
                      </p>
                      <h3 className="truncate font-display text-[0.98rem] font-semibold text-ink">
                        {stage.label}
                      </h3>
                      <p className="truncate font-mono text-[0.68rem] text-subtle">
                        {SUBTITLES[stage.id]}
                      </p>
                    </div>
                  </article>
                </div>

                {/* Node on the rail */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-[1.4rem] z-10 grid size-3 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-400/60 bg-void sm:left-1/2"
                >
                  <span className="size-1.5 rounded-full bg-brand-400" />
                  {!reduceMotion && (
                    <span
                      className="absolute inset-0 rounded-full border border-brand-400/60"
                      style={{ animation: 'vc-pulse-ring 2.6s ease-out infinite' }}
                    />
                  )}
                </span>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
