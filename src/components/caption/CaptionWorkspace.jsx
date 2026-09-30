import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, ShieldCheck, Sparkles, Terminal, TriangleAlert, Wand2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { DEMO_MODE, MAX_FILE_SIZE_MB, ACCEPTED_LABEL } from '../../config/env.js'
import useCaptionGenerator from '../../hooks/useCaptionGenerator.js'
import Button from '../ui/Button.jsx'
import { DemoModePill, Note } from '../ui/DemoNotice.jsx'
import Reveal from '../ui/Reveal.jsx'
import Section, { SectionHeading } from '../ui/Section.jsx'
import AnalysisPanel from './AnalysisPanel.jsx'
import CaptionResult from './CaptionResult.jsx'
import ImagePreview from './ImagePreview.jsx'
import ImageUploader from './ImageUploader.jsx'
import ProcessingSteps from './ProcessingSteps.jsx'

const EMPTY_STATE = {
  title: 'No image loaded yet',
  body: 'Upload a photo and the pipeline will run the vision encoder, then decode a natural-language caption from the extracted features.',
}

/** Main interactive application surface. */
export default function CaptionWorkspace() {
  const {
    status,
    file,
    previewUrl,
    result,
    error,
    step,
    isBusy,
    isDemo,
    selectFile,
    removeImage,
    regenerate,
    retry,
  } = useCaptionGenerator()

  const resultsRef = useRef(null)
  const hasImage = Boolean(file && previewUrl)

  // Move focus to the results region once the first caption arrives.
  useEffect(() => {
    if (status === 'success' && result) {
      resultsRef.current?.focus({ preventScroll: true })
    }
  }, [status, result])

  const showError = status === 'error' && !file

  return (
    <Section id="caption" className="py-24 sm:py-28 lg:py-32">
      <div className="flex flex-col gap-4">
        <SectionHeading
          eyebrow="Image Captioning"
          eyebrowIcon={Wand2}
          title="Generate a Caption"
          description="Drop in an image and watch the full computer-vision-to-language pipeline run in real time. Your file never leaves the browser unless a model backend is connected."
        />

        <Reveal delay={0.1} className="flex justify-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.7rem] tracking-wide text-muted">
            {DEMO_MODE ? <DemoModePill /> : null}
            <span className="inline-flex items-center gap-1.5">
              <Terminal className="size-3.5" aria-hidden="true" />
              <code className="font-mono">POST /api/caption</code>
            </span>
            <span className="text-subtle">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Processed in memory
            </span>
          </span>
        </Reveal>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Empty state                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={0.14} className="mt-12">
        <div className="glass-strong overflow-hidden rounded-[1.75rem] p-1.5 shadow-card">
          <div className="rounded-[1.35rem] bg-void/40 p-5 sm:p-8 lg:p-10">
            <ImageUploader onSelect={selectFile} error={showError ? error : null} />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: EMPTY_STATE.title,
                  body: EMPTY_STATE.body,
                  icon: Sparkles,
                  span: 'sm:col-span-2',
                },
                {
                  title: 'File constraints',
                  body: `${ACCEPTED_LABEL} · up to ${MAX_FILE_SIZE_MB} MB. Files are validated in the browser before any request is made.`,
                  icon: ShieldCheck,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border border-white/8 bg-white/[0.025] p-4 ${item.span ?? ''}`}
                >
                  <item.icon className="mb-2.5 size-4 text-brand-300" aria-hidden="true" />
                  <p className="text-[0.9rem] font-semibold text-ink">{item.title}</p>
                  <p className="mt-1.5 text-[0.82rem] leading-relaxed text-subtle">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ------------------------------------------------------------------ */}
      {/* Workspace                                                           */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence mode="wait">
        {hasImage && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]"
          >
            {/* Left — image, pipeline, analysis */}
            <div className="flex flex-col gap-4">
              <div className="min-h-80 lg:min-h-96">
                <ImagePreview
                  file={file}
                  previewUrl={previewUrl}
                  onRemove={removeImage}
                  busy={isBusy}
                />
              </div>

              <AnimatePresence>
                {isBusy && (
                  <motion.div
                    key="steps"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-[1.4rem] border border-white/10 bg-surface-2/70 p-5 sm:p-6"
                  >
                    <ProcessingSteps step={step} failed={status === 'error'} />
                  </motion.div>
                )}
              </AnimatePresence>

              {result && <AnalysisPanel result={result} isDemo={isDemo} />}
            </div>

            {/* Right — caption + status */}
            <div
              ref={resultsRef}
              tabIndex={-1}
              role="region"
              aria-label="Generated caption"
              className="flex flex-col gap-4 focus-visible:outline-none"
            >
              {isBusy && (
                <motion.div
                  key="inline-steps"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-[1.4rem] border border-white/10 bg-surface-2/70 p-5 lg:hidden sm:p-6"
                >
                  <ProcessingSteps step={step} failed={status === 'error'} />
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <CaptionResult
                      result={result}
                      file={file}
                      isBusy={isBusy}
                      isDemo={isDemo}
                      onRegenerate={regenerate}
                    />
                    {result.fallbackReason ? <Note tone="warn">{result.fallbackReason}</Note> : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="self-start"
                    >
                      Upload a different image
                    </Button>
                  </motion.div>
                ) : isBusy ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 flex-col justify-center gap-3 rounded-[1.4rem] border border-white/10 bg-surface-2/40 p-8"
                  >
                    <span className="font-mono text-[0.7rem] tracking-[0.2em] text-brand-300 uppercase">
                      Awaiting model
                    </span>
                    <p className="font-display text-xl font-semibold text-ink">
                      Generating your caption…
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-cyan-400"
                        initial={{ width: '4%' }}
                        animate={{ width: ['4%', '92%'] }}
                        transition={{ duration: 2.2, ease: 'easeInOut' }}
                      />
                    </div>
                    <p className="font-mono text-[0.7rem] text-subtle">
                      resnet-50 → transformer-decoder → post-process
                    </p>
                  </motion.div>
                ) : status === 'error' && file ? (
                  <motion.div
                    key="error"
                    role="alert"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-start gap-4 rounded-[1.4rem] border border-rose-400/25 bg-rose-500/6 p-6"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-rose-500/15 text-rose-300">
                      <TriangleAlert className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">
                        Caption generation failed
                      </h3>
                      <p className="mt-1.5 text-[0.88rem] text-muted">{error}</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <Button type="button" variant="outline" size="sm" onClick={retry}>
                        <RefreshCw className="size-3.5" aria-hidden="true" />
                        Try again
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={removeImage}>
                        Remove image
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
