import { motion, useReducedMotion } from 'framer-motion'
import { Rocket, Sparkles } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'

import { PROJECT } from '../../config/site.js'
import Button from '../ui/Button.jsx'
import Reveal from '../ui/Reveal.jsx'

export default function CtaSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="section-offset relative overflow-hidden py-24 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-14 sm:py-18">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(99,102,241,0.24),transparent_70%)]"
            />
            <div
              aria-hidden="true"
              className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]"
            />

            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full border border-dashed border-white/8"
              />
            )}

            <div className="relative flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-void/50 px-4 py-2 text-[0.7rem] font-semibold tracking-[0.18em] text-brand-300 uppercase backdrop-blur-sm">
                <Rocket className="size-3.5" aria-hidden="true" />
                Open Source
              </span>

              <h2 className="max-w-2xl text-3xl leading-[1.1] font-semibold text-ink sm:text-4xl lg:text-[2.9rem]">
                Explore the <span className="text-gradient-soft">Project</span>
              </h2>

              <p className="max-w-xl text-[1.02rem] leading-relaxed text-muted">
                Explore the source code, architecture and implementation of {PROJECT.name}.
              </p>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <Button href={PROJECT.repoUrl} target="_blank" rel="noreferrer noopener" size="lg">
                  <FaGithub className="size-4.5" aria-hidden="true" />
                  View GitHub
                </Button>
                <Button href="#caption" variant="secondary" size="lg">
                  <Sparkles className="size-4.5" aria-hidden="true" />
                  Try Demo
                </Button>
              </div>

              <p className="pt-2 font-mono text-[0.72rem] tracking-wider text-subtle">
                v{PROJECT.version} · React + FastAPI + PyTorch
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
