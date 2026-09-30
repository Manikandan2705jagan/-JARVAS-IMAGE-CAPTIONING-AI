import { motion } from 'framer-motion'
import { ArrowUpRight, Images, Sparkles } from 'lucide-react'

import { DEMO_GALLERY } from '../../services/demoCaptions.js'
import { formatConfidence } from '../../lib/validation.js'
import SceneArt from '../art/SceneArt.jsx'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'
import { DemoModePill } from '../ui/DemoNotice.jsx'

export default function DemoGallery() {
  return (
    <Section id="gallery" tone="sunken" className="py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />

      <SectionHeading
        eyebrow="Examples"
        eyebrowIcon={Images}
        title="Demo Gallery"
        description="A look at the kind of captions this pipeline produces. These entries ship with the app as sample content."
      />

      <div className="mt-12 flex justify-center">
        <DemoModePill />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_GALLERY.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.07} className="h-full">
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="group glass flex h-full flex-col overflow-hidden rounded-[1.4rem]"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <SceneArt
                  variant={item.image}
                  title={item.title}
                  className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />

                <span className="absolute top-3 left-3 rounded-full border border-white/12 bg-void/70 px-2.5 py-1 font-mono text-[0.64rem] tracking-wider text-brand-300 uppercase backdrop-blur-sm">
                  {item.scene}
                </span>

                <span className="absolute right-3 bottom-3 rounded-full border border-emerald-400/30 bg-emerald-500/12 px-2.5 py-1 font-mono text-[0.66rem] font-semibold text-emerald-300 backdrop-blur-sm">
                  {formatConfidence(item.confidence)}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 border-t border-white/8 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[1rem] font-semibold text-ink">{item.title}</h3>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-300"
                    aria-hidden="true"
                  />
                </div>

                <p className="flex flex-1 gap-2 text-[0.9rem] leading-relaxed text-muted">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-violet-400/70" aria-hidden="true" />
                  <span>&ldquo;{item.caption}&rdquo;</span>
                </p>

                <ul className="flex flex-wrap gap-1.5 pt-0.5">
                  {item.objects.map((object) => (
                    <li
                      key={object}
                      className="rounded-md border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[0.7rem] text-subtle"
                    >
                      {object}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
