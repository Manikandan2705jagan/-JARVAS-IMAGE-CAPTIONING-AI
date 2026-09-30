import { Boxes } from 'lucide-react'

import { TECHNOLOGY_STACK, TRUST_STRIP } from '../../config/site.js'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'

export default function Technology() {
  return (
    <Section id="technology" className="py-24 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow="Stack"
        eyebrowIcon={Boxes}
        title="Powered by Modern AI Technologies"
        description="A research-grade captioning pipeline built on well-understood, production-proven components — from the visual backbone to the language decoder and its evaluation metric."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TECHNOLOGY_STACK.map((tech, index) => (
          <Reveal key={tech.id} delay={index * 0.06} className="h-full">
            <article className="glass card-hover group relative flex h-full flex-col gap-3 overflow-hidden rounded-[1.35rem] p-5">
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tech.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-14 -right-8 size-36 rounded-full bg-brand-400/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <span className="relative grid size-11 place-items-center rounded-2xl border border-white/10 bg-void/50 text-ink transition-transform duration-500 group-hover:scale-105">
                <tech.icon className="size-5" aria-hidden="true" />
              </span>

              <div className="relative flex flex-col gap-1.5">
                <h3 className="font-display text-[1.02rem] font-semibold text-ink">{tech.name}</h3>
                <p className="text-[0.83rem] leading-relaxed text-muted">{tech.role}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Trust marquee ----------------------------------------------------- */}
      <Reveal delay={0.1} className="mt-12">
        <div className="mask-fade-x flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-3 pr-3">
            {[...TRUST_STRIP, ...TRUST_STRIP].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 font-mono text-[0.72rem] tracking-wider whitespace-nowrap text-subtle"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
