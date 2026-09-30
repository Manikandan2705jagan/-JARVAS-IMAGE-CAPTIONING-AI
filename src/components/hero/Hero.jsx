import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  CheckCircle2,
  Copy,
  Download,
  ImageIcon,
  Loader2,
  RefreshCw,
  ScanEye,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { HERO_BADGE, HERO_SUBTITLE, HERO_TITLE_LINES, PROJECT } from '../../config/site.js'
import { DEMO_GALLERY } from '../../services/demoCaptions.js'
import Button from '../ui/Button.jsx'
import { DemoModePill } from '../ui/DemoNotice.jsx'
import SceneArt from '../art/SceneArt.jsx'

const SAMPLE = DEMO_GALLERY[0]

const STATES = {
  idle: { label: 'Analyzing image...', icon: Loader2, spin: true },
  done: { label: 'Caption generated', icon: CheckCircle2, spin: false },
}

const CYCLE_MS = 3400

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState(reduceMotion ? 'done' : 'idle')
  const [typed, setTyped] = useState(reduceMotion ? SAMPLE.caption : '')
  const [runKey, setRunKey] = useState(0)

  // Looping "AI is analysing" -> "caption generated" demo, paused for
  // users who prefer reduced motion. Resetting happens in the timer below so
  // the effect itself never triggers a synchronous re-render.
  useEffect(() => {
    if (reduceMotion) return undefined

    let cancelled = false
    let typeTimer
    let phaseTimer

    const caption = SAMPLE.caption
    const typeDelay = 620
    const charTime = 26

    phaseTimer = setTimeout(() => {
      if (cancelled) return
      setPhase('done')

      let index = 0
      const typeNext = () => {
        if (cancelled) return
        index += 1
        setTyped(caption.slice(0, index))
        if (index < caption.length) typeTimer = setTimeout(typeNext, charTime)
      }
      typeTimer = setTimeout(typeNext, 220)
    }, typeDelay)

    const reset = setTimeout(() => {
      if (cancelled) return
      setRunKey((key) => key + 1)
      setPhase('idle')
      setTyped('')
    }, CYCLE_MS)

    return () => {
      cancelled = true
      clearTimeout(phaseTimer)
      clearTimeout(typeTimer)
      clearTimeout(reset)
    }
  }, [runKey, reduceMotion])

  const { label, icon: StatusIcon, spin } = STATES[phase]

  return (
    <section id="home" className="section-offset relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-44 lg:pb-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10">
        {/* ---------------------------------------------------------------- */}
        {/* Copy                                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col items-start gap-7">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.7rem] font-semibold tracking-[0.2em] text-brand-300 uppercase"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand-400" />
            </span>
            {HERO_BADGE}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.6rem] leading-[1.06] font-semibold sm:text-6xl lg:text-[4.1rem]"
          >
            <span className="text-gradient">{HERO_TITLE_LINES[0]}</span>
            <br />
            <span className="text-gradient-soft">{HERO_TITLE_LINES[1]}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-[1.06rem] leading-relaxed text-muted"
          >
            {HERO_SUBTITLE}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button href="#caption" size="lg">
              <Sparkles className="size-4.5" aria-hidden="true" />
              Try Image Captioning
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Button>

            <Button href={PROJECT.repoUrl} target="_blank" rel="noreferrer noopener" variant="secondary" size="lg">
              View on GitHub
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.36 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2"
          >
            {[
              { value: 'ResNet-50', label: 'Vision encoder' },
              { value: 'Transformer', label: 'Caption decoder' },
              { value: 'FastAPI', label: 'Model serving' },
            ].map((item) => (
              <div key={item.value} className="flex flex-col">
                <dt className="font-display text-[0.98rem] font-semibold text-ink">{item.value}</dt>
                <dd className="text-[0.78rem] tracking-wide text-subtle">{item.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Interactive visual                                                */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(99,102,241,0.28),transparent_70%)] blur-2xl"
          />

          <div className="glass-strong relative overflow-hidden rounded-[1.75rem] p-2 shadow-card sm:p-2.5">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-400/70" />
                <span className="size-2.5 rounded-full bg-amber-400/70" />
                <span className="size-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <span className="flex items-center gap-2 font-mono text-[0.68rem] tracking-wider text-subtle">
                <ImageIcon className="size-3" aria-hidden="true" />
                sample / dog-in-park.jpg
              </span>
              <DemoModePill />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-[1.05fr_0.95fr]">
              {/* Image card */}
              <div className="relative aspect-4/3 overflow-hidden rounded-[1.15rem] border border-white/10 bg-surface-2 sm:aspect-auto sm:min-h-72">
                <SceneArt
                  variant={SAMPLE.image}
                  title="A dog running through a grassy field"
                  className="size-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />

                {/* Bounding-box flourish */}
                <div className="absolute inset-x-[16%] top-[26%] h-[46%] rounded-md border border-cyan-300/45">
                  <span className="absolute -top-px -left-px size-3 rounded-tl-md border-t-2 border-l-2 border-cyan-300" />
                  <span className="absolute -top-px -right-px size-3 rounded-tr-md border-t-2 border-r-2 border-cyan-300" />
                  <span className="absolute -bottom-px -left-px size-3 rounded-bl-md border-b-2 border-l-2 border-cyan-300" />
                  <span className="absolute -bottom-px -right-px size-3 rounded-br-md border-b-2 border-r-2 border-cyan-300" />
                  <span className="absolute -top-6 left-0 rounded bg-cyan-400/90 px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider text-void">
                    dog 0.96
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="rounded-md border border-white/12 bg-void/65 px-1.5 py-0.5 font-mono text-[0.56rem] tracking-wider text-brand-300 backdrop-blur-sm"
                    >
                      {SAMPLE.objects[i]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Caption card */}
              <div className="flex flex-col gap-2.5 rounded-[1.15rem] border border-white/10 bg-surface-2/80 p-4 sm:min-h-72">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.16em] text-subtle uppercase">
                    <ScanEye className="size-3.5" aria-hidden="true" />
                    Generated Caption
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phase}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className={`flex items-center gap-1.5 text-[0.7rem] font-medium ${
                        phase === 'done' ? 'text-emerald-300' : 'text-brand-300'
                      }`}
                    >
                      <StatusIcon className={`size-3.5 ${spin ? 'animate-spin' : ''}`} aria-hidden="true" />
                      {label}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="relative flex-1">
                  <p className="font-display text-[1.12rem] leading-relaxed font-medium text-ink sm:text-[1.2rem]">
                    {typed || <span className="text-subtle">Waiting for the vision encoder…</span>}
                    {phase === 'done' && typed.length < SAMPLE.caption.length ? (
                      <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-brand-400" />
                    ) : null}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/8 pt-3">
                  <div>
                    <p className="text-[0.62rem] tracking-[0.16em] text-subtle uppercase">Confidence</p>
                    <p className="font-display text-lg font-semibold text-ink">
                      {(SAMPLE.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[Copy, Download, RefreshCw].map((Icon, index) => (
                      <span
                        key={index}
                        className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted"
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-cyan-400"
                    initial={{ width: '0%' }}
                    animate={{ width: phase === 'done' ? '100%' : '68%' }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="glass absolute -top-5 -left-4 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-card sm:flex"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <CheckCircle2 className="size-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.78rem] font-semibold text-ink">Caption ready</p>
              <p className="font-mono text-[0.66rem] text-subtle">204 OK · 1.8s</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="glass absolute -bottom-5 -right-3 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-card sm:flex"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
              <UploadCloud className="size-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.78rem] font-semibold text-ink">Vision Encoder</p>
              <p className="font-mono text-[0.66rem] text-subtle">2048-d features</p>
            </div>
          </motion.div>

          <span className="sr-only">
            Interactive demonstration: an image of a dog in a field is analysed and captioned. The full
            version is available in the caption generator below.
          </span>
        </motion.div>
      </div>
    </section>
  )
}
