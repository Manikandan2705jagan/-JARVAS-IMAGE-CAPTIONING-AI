import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'

import CaptionWorkspace from '../components/caption/CaptionWorkspace.jsx'
import Hero from '../components/hero/Hero.jsx'
import Background from '../components/layout/Background.jsx'
import Footer from '../components/layout/Footer.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import About from '../components/sections/About.jsx'
import Architecture from '../components/sections/Architecture.jsx'
import CtaSection from '../components/sections/CtaSection.jsx'
import DemoGallery from '../components/sections/DemoGallery.jsx'
import Developer from '../components/sections/Developer.jsx'
import Features from '../components/sections/Features.jsx'
import HowItWorks from '../components/sections/HowItWorks.jsx'
import Metrics from '../components/sections/Metrics.jsx'
import Technology from '../components/sections/Technology.jsx'

export default function Home() {
  const reduceMotion = useReducedMotion()

  // Deep links (e.g. /#caption) should land correctly after the app mounts.
  useEffect(() => {
    if (!window.location.hash) return
    const target = document.querySelector(window.location.hash)
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }, [reduceMotion])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:z-[60] focus:-translate-x-1/2 focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <Background />
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          key="home"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Hero />
          <CaptionWorkspace />
          <HowItWorks />
          <Technology />
          <Architecture />
          <Features />
          <DemoGallery />
          <Metrics />
          <About />
          <Developer />
          <CtaSection />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </>
  )
}
