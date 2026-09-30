import { Sparkles } from 'lucide-react'

import { FEATURES } from '../../config/site.js'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'

export default function Features() {
  return (
    <Section id="features" className="py-24 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow="Capabilities"
        eyebrowIcon={Sparkles}
        title="Built for Speed, Clarity and Trust"
        description="Every part of the product is designed around a single goal: get from an image to a trustworthy sentence as fast as possible."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.id} delay={index * 0.07} className="h-full">
            <article className="glass card-hover group relative flex h-full flex-col gap-3.5 overflow-hidden rounded-[1.35rem] p-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -left-10 size-44 rounded-full bg-brand-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <span className="relative grid size-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/18 to-violet-500/8 text-brand-200 transition-transform duration-500 group-hover:-translate-y-0.5">
                <feature.icon className="size-5.5" aria-hidden="true" />
              </span>

              <h3 className="relative font-display text-[1.06rem] font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="relative text-[0.88rem] leading-relaxed text-muted">
                {feature.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
