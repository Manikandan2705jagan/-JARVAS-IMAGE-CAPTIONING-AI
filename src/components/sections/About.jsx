import { BookOpen, Info, Sparkles } from 'lucide-react'

import { PRIVACY_POINTS, PROJECT_FACTS } from '../../config/site.js'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'

export default function About() {
  return (
    <Section id="about" tone="sunken" className="py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />

      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="About the project"
            eyebrowIcon={BookOpen}
            title="About Jarvas Image Captioning AI"
            className="mx-0"
          />

          <Reveal delay={0.1} className="mt-6 flex flex-col gap-4">
            <p className="text-[1.02rem] leading-relaxed text-muted">
              Jarvas Image Captioning AI is an image captioning system that combines computer vision
              and natural language processing to understand visual information and automatically
              generate descriptive captions. The project demonstrates how pretrained vision models and
              modern language-generation architectures can work together to convert visual data into
              natural language.
            </p>
            <p className="text-[0.95rem] leading-relaxed text-subtle">
              A convolutional backbone compresses the image into a compact feature vector, which is
              projected into the decoder&rsquo;s embedding space. The decoder then predicts a sequence
              of tokens one at a time until it emits an end-of-sentence marker. Because training uses
              paired image&ndash;caption data (Flickr8k / Flickr30k), the model learns not just
              <em> what</em> is present but <em> how</em> people naturally describe it.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="mt-9">
            <dl className="grid gap-3 sm:grid-cols-2">
              {PROJECT_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="glass card-hover rounded-2xl px-4 py-3.5"
                >
                  <dt className="text-[0.68rem] font-semibold tracking-[0.16em] text-subtle uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-[0.9rem] font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Privacy + ethics note ------------------------------------------- */}
        <Reveal delay={0.12} className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass-strong flex flex-col gap-5 rounded-[1.5rem] p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-500/12 text-emerald-300">
                <Info className="size-4.5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-[1.05rem] font-semibold text-ink">
                How your images are handled
              </h3>
            </div>

            <ul className="flex flex-col gap-3">
              {PRIVACY_POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-[0.88rem] leading-relaxed text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-400 to-violet-400"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <div className="hairline" />

            <p className="flex items-start gap-2.5 text-[0.82rem] leading-relaxed text-subtle">
              <Sparkles className="mt-px size-3.5 shrink-0 text-violet-400/70" aria-hidden="true" />
              Captions are generated descriptions, not ground truth. Always verify important output
              before relying on it.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
