import { motion } from 'framer-motion'

const BASE =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45'

const VARIANTS = {
  primary:
    'px-6 py-3 text-[0.94rem] text-white shadow-[0_14px_40px_-16px_rgba(59,130,246,0.85)] hover:shadow-[0_20px_55px_-16px_rgba(99,102,241,0.9)] hover:-translate-y-0.5',
  secondary:
    'glass px-6 py-3 text-[0.94rem] text-ink hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10',
  ghost: 'px-4 py-2 text-[0.88rem] text-muted hover:text-ink',
  outline:
    'border border-white/15 px-5 py-2.5 text-[0.88rem] text-ink hover:border-brand-400/60 hover:bg-white/5',
}

const SIZES = {
  sm: 'text-[0.82rem]',
  md: '',
  lg: 'px-7 py-3.5 text-[1rem]',
}

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'outline'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.iconOnly]
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  className = '',
  href,
  as,
  ...rest
}) {
  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.primary,
    size !== 'md' ? SIZES[size] : '',
    iconOnly ? 'aspect-square p-0' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden rounded-full"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-accent" />
          <span className="absolute inset-0 bg-gradient-to-r from-brand-500 via-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,rgba(255,255,255,0.4),transparent_60%)]" />
        </span>
      )}
      {variant !== 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/0 via-brand-500/0 to-violet-500/0 transition-all duration-500 group-hover:from-brand-500/10 group-hover:via-violet-500/10 group-hover:to-cyan-400/10"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  const Tag = as ?? 'button'
  const isMotionTag = Tag === motion.button || Tag === motion.a

  if (isMotionTag) {
    const MotionTag = Tag
    return (
      <MotionTag
        className={classes}
        whileHover={rest.disabled ? undefined : { y: -2 }}
        whileTap={rest.disabled ? undefined : { scale: 0.97 }}
        {...rest}
      >
        {content}
      </MotionTag>
    )
  }

  return (
    <Tag className={classes} {...rest}>
      {content}
    </Tag>
  )
}
