/**
 * Ambient page background: layered aurora glows, a faint technical grid and a
 * soft vignette. Fixed behind all content, purely decorative.
 */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-void" />

      {/* Base aurora */}
      <div className="absolute -top-40 left-1/2 h-[46rem] w-[78rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.20),rgba(139,92,246,0.10),transparent)] blur-[10px]" />
      <div className="absolute top-[24rem] -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.12),transparent)] blur-2xl" />
      <div className="absolute top-[62rem] -right-32 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.14),transparent)] blur-2xl" />
      <div className="absolute bottom-0 left-1/3 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent)] blur-2xl" />

      {/* Technical grid with radial mask */}
      <div className="grid-backdrop absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000,transparent)]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,transparent,rgba(4,6,13,0.55),var(--color-void))]" />
    </div>
  )
}
