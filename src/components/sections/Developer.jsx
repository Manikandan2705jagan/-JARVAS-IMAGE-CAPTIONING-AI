import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'

import { DEVELOPER, PROJECT } from '../../config/site.js'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'

const GITHUB = <FaGithub className="size-4" aria-hidden="true" />
const LINKEDIN = <FaLinkedinIn className="size-4" aria-hidden="true" />

export default function Developer() {
  return (
    <Section id="developer" className="py-24 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow="The Builder"
        eyebrowIcon={Sparkles}
        title="Behind the Project"
        description="Designed and built end to end — model pipeline, REST API and this interface."
      />

      <Reveal delay={0.12} className="mt-14">
        <div className="glass-strong relative overflow-hidden rounded-[1.75rem] p-6 sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.28),transparent)] blur-2xl"
          />

          <div className="relative flex flex-col gap-9 lg:flex-row lg:items-start lg:justify-between">
            {/* Identity ---------------------------------------------------- */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <motion.div
                whileHover={{ rotate: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="relative grid size-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 via-indigo-500 to-violet-accent font-display text-3xl font-semibold text-white shadow-[0_20px_50px_-20px_rgba(99,102,241,0.9)]"
              >
                MJ
                <span
                  aria-hidden="true"
                  className="absolute inset-[2px] rounded-[1.4rem] bg-void/80"
                />
                <span className="relative bg-gradient-to-br from-brand-200 to-violet-200 bg-clip-text text-transparent">
                  MJ
                </span>
              </motion.div>

              <div className="flex flex-col gap-2.5">
                <h3 className="font-display text-2xl font-semibold text-ink sm:text-[1.75rem]">
                  {DEVELOPER.name}
                </h3>
                <p className="text-[0.98rem] font-medium text-brand-300">{DEVELOPER.role}</p>
                <p className="max-w-md text-[0.9rem] leading-relaxed text-muted">
                  {DEVELOPER.bio}
                </p>

                <div className="mt-1.5 flex flex-wrap gap-2.5">
                  <a
                    href={PROJECT.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[0.86rem] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
                  >
                    {GITHUB}
                    GitHub
                    <ArrowUpRight
                      className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>

                  <a
                    href={PROJECT.linkedinUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[0.86rem] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
                  >
                    {LINKEDIN}
                    LinkedIn
                    <ArrowUpRight
                      className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Skills ------------------------------------------------------ */}
            <div className="flex w-full max-w-md flex-col gap-4">
              <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-subtle uppercase">
                Core Skills
              </p>
              <ul className="flex flex-wrap gap-2">
                {DEVELOPER.skills.map((skill, index) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.035, duration: 0.35 }}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[0.82rem] font-medium text-muted transition-colors duration-300 hover:border-brand-400/40 hover:text-ink"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-1 grid grid-cols-3 gap-2.5">
                {DEVELOPER.stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-2xl border border-white/8 bg-void/40 px-3 py-3"
                  >
                    <p className="text-[0.6rem] font-semibold tracking-[0.16em] text-subtle uppercase">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-[0.82rem] leading-tight font-medium text-ink">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
