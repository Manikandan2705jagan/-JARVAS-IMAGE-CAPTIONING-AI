import Reveal from './Reveal.jsx'

/** Consistent page section wrapper: rhythm, anchor offset and optional tone. */
export default function Section({
  id,
  children,
  className = '',
  containerClassName = '',
  tone = 'default',
}) {
  const tones = {
    default: '',
    raised: 'bg-surface/40',
    sunken: 'bg-abyss',
  }

  return (
    <section id={id} className={`section-offset relative ${tones[tone] ?? ''} ${className}`}>
      <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${containerClassName}`}>
        {children}
      </div>
    </section>
  )
}

/** Eyebrow + title + optional description, used by every content section. */
export function SectionHeading({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <Reveal className={`flex max-w-3xl flex-col gap-5 ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.22em] text-brand-300/90 uppercase">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-brand-400/70" />
          {EyebrowIcon ? <EyebrowIcon className="size-3.5" aria-hidden="true" /> : null}
          {eyebrow}
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-violet-400/60" />
        </span>
      ) : null}

      <h2 className="text-3xl leading-[1.1] font-semibold text-ink sm:text-4xl lg:text-[2.85rem]">
        {title}
      </h2>

      {description ? (
        <p className="max-w-2xl text-[1.02rem] leading-relaxed text-muted">{description}</p>
      ) : null}
    </Reveal>
  )
}
