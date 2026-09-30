import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileImage, ImageUp, TriangleAlert, UploadCloud } from 'lucide-react'

import { ACCEPTED_LABEL, MAX_FILE_SIZE_MB } from '../../config/env.js'
import { extractFirstFile } from '../../lib/validation.js'

/**
 * Drag-and-drop / click-to-browse upload zone.
 * Fully keyboard accessible: the hidden input is focusable and labelled.
 */
export default function ImageUploader({ onSelect, error, disabled = false, compact = false }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const dragDepth = useRef(0)

  const handleFiles = useCallback(
    (source) => {
      const file = extractFirstFile(source)
      if (file) onSelect(file)
    },
    [onSelect],
  )

  const onDrop = (event) => {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (disabled) return
    handleFiles(event.dataTransfer?.files)
  }

  // Counter-based enter/leave so nested drag events don't flicker the state.
  const onDragEnter = (event) => {
    event.preventDefault()
    dragDepth.current += 1
    if (!disabled) setDragging(true)
  }

  const onDragLeave = (event) => {
    event.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        animate={{
          scale: dragging ? 1.008 : 1,
          borderColor: dragging ? 'rgba(139,92,246,0.65)' : 'rgba(255,255,255,0.09)',
        }}
        transition={{ duration: 0.25 }}
        className={`group relative overflow-hidden rounded-[1.5rem] border border-dashed bg-white/[0.02] ${
          compact ? 'p-7' : 'p-10 sm:p-14'
        } ${dragging ? 'bg-violet-500/8' : ''} ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        {/* Hover sheen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <span className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.16),transparent_70%)]" />
        </span>

        <div className="relative flex flex-col items-center gap-5 text-center">
          <motion.span
            animate={dragging ? { y: -6, scale: 1.06 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className={`relative grid ${compact ? 'size-14' : 'size-16'} place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/22 to-violet-500/12 ${
              dragging ? 'border-violet-400/60' : ''
            }`}
          >
            {dragging ? (
              <ImageUp className="size-7 text-violet-soft" aria-hidden="true" />
            ) : (
              <UploadCloud className="size-7 text-brand-300" aria-hidden="true" />
            )}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl border border-brand-400/40 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </motion.span>

          <div className="flex flex-col gap-2">
            <p className="font-display text-xl font-semibold text-ink sm:text-[1.4rem]">
              {dragging ? 'Release to upload' : 'Drop your image here'}
            </p>
            <p className="text-[0.95rem] text-muted">
              or{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-brand-300 underline decoration-brand-400/40 underline-offset-4 transition-colors hover:text-brand-200"
              >
                click to browse
              </button>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[0.7rem] tracking-wider text-muted">
              <FileImage className="size-3.5" aria-hidden="true" />
              {ACCEPTED_LABEL}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[0.7rem] tracking-wider text-muted">
              MAX {MAX_FILE_SIZE_MB} MB
            </span>
          </div>
        </div>

        <input
          ref={inputRef}
          id="caption-image-input"
          type="file"
          accept={ACCEPTED_LABEL.toLowerCase().replace(/ • /g, ',')}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </motion.div>

      <AnimatePresence>
        {error ? (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="flex items-start gap-2.5 rounded-xl border border-rose-400/25 bg-rose-500/8 px-3.5 py-3 text-[0.84rem] text-rose-200"
          >
            <TriangleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
