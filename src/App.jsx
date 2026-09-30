import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home.jsx'))

function PageFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-void">
      <div className="flex flex-col items-center gap-4">
        <span className="size-9 animate-spin rounded-full border-2 border-white/10 border-t-brand-400" />
        <p className="font-mono text-[0.72rem] tracking-[0.2em] text-subtle uppercase">
          Loading Jarvas Image Captioning AI
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Home />
    </Suspense>
  )
}
