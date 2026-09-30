/** Brand mark: gradient aperture glyph + wordmark. */
export default function Logo({ className = '', compact = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-indigo-500 to-violet-accent shadow-[0_8px_24px_-8px_rgba(99,102,241,0.9)]">
        <span className="absolute inset-[1.5px] rounded-[0.6rem] bg-void/85" />
        <svg viewBox="0 0 24 24" className="relative size-5" aria-hidden="true">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8ab4ff" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
          </defs>
          <path
            d="M3 8.5A2.5 2.5 0 0 1 5.5 6h3.2l1.5-2.2A1 1 0 0 1 11 3.4h2a1 1 0 0 1 .8.4L15.3 6h3.2A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"
            fill="none"
            stroke="url(#logo-grad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12.6" r="3.2" fill="url(#logo-grad)" />
        </svg>
      </span>

      {!compact && (
        <span className="font-display text-[1.02rem] leading-none font-semibold tracking-tight text-ink">
          Jarvas <span className="text-gradient-soft">AI</span>
        </span>
      )}
    </span>
  )
}
