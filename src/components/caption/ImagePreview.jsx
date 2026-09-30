import { motion } from 'framer-motion'
import { Check, FileImage, Loader2, Trash2 } from 'lucide-react'

import { formatBytes } from '../../lib/validation.js'

/** Uploaded image preview with metadata and a remove control. */
export default function ImagePreview({ file, previewUrl, onRemove, busy = false }) {
  if (!file || !previewUrl) return null

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/10 bg-surface-2/70"
    >
      <div className="relative flex-1 overflow-hidden bg-void">
        <img
          src={previewUrl}
          alt={`Preview of the uploaded image: ${file.name}`}
          className="size-full object-contain"
        />

        {busy && (
          <div className="pointer-events-none absolute inset-0 bg-void/45 backdrop-blur-[2px]">
            <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
              <span className="block h-full w-1/3 animate-[vc-sweep_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2">
          {busy && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-void/70 px-2.5 py-1 text-[0.66rem] font-medium tracking-wider text-brand-300 uppercase backdrop-blur-sm">
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
              Analysing
            </span>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            aria-label="Remove uploaded image"
            className="grid size-9 place-items-center rounded-xl border border-white/12 bg-void/70 text-muted backdrop-blur-sm transition-colors hover:border-rose-400/50 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <figcaption className="flex items-center gap-3 border-t border-white/8 px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-500/12 text-brand-300">
          <FileImage className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.86rem] font-medium text-ink">{file.name}</p>
          <p className="font-mono text-[0.68rem] tracking-wide text-subtle">
            {formatBytes(file.size)} · {file.type.replace('image/', '').toUpperCase()}
          </p>
        </div>
        <span className="hidden items-center gap-1.5 text-[0.68rem] font-medium text-emerald-300 sm:inline-flex">
          <Check className="size-3.5" aria-hidden="true" />
          Uploaded
        </span>
      </figcaption>
    </motion.figure>
  )
}
