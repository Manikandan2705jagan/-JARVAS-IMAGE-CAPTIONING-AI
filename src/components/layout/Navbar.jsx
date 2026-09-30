import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, Sparkles, X } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { LINKS } from '../../config/env.js'
import { NAV_LINKS } from '../../config/site.js'
import useLockBodyScroll from '../../hooks/useLockBodyScroll.js'
import useScrollSpy from '../../hooks/useScrollSpy.js'
import Button from '../ui/Button.jsx'
import Logo from '../ui/Logo.jsx'

const NAV_IDS = NAV_LINKS.map((link) => link.id)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(useMemo(() => NAV_IDS, []))
  const reduceMotion = useReducedMotion()

  useLockBodyScroll(menuOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <a
        href="#caption"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to caption generator
      </a>

      <motion.header
        initial={reduceMotion ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'border-b border-white/8 bg-abyss/72 backdrop-blur-xl backdrop-saturate-150'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10"
          >
            <a
              href="#home"
              onClick={closeMenu}
              className="rounded-xl transition-opacity hover:opacity-85"
              aria-label="Jarvas Image Captioning AI — home"
            >
              <Logo />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.id
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative block rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-300 ${
                        isActive ? 'text-ink' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/8"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2.5">
              <Button
                href={LINKS.github}
                target="_blank"
                rel="noreferrer noopener"
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <FaGithub className="size-4" aria-hidden="true" />
                GitHub
              </Button>

              <Button href="#caption" size="sm" className="hidden sm:inline-flex">
                <Sparkles className="size-4" aria-hidden="true" />
                Try AI
              </Button>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="glass grid size-10 place-items-center rounded-xl text-ink transition-colors hover:bg-white/10 lg:hidden"
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            />

            <motion.nav
              aria-label="Mobile"
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong absolute inset-x-4 top-20 rounded-3xl p-5 shadow-card"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05 }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={closeMenu}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[0.98rem] font-medium transition-colors ${
                        activeId === link.id
                          ? 'bg-white/8 text-ink'
                          : 'text-muted hover:bg-white/5 hover:text-ink'
                      }`}
                    >
                      {link.label}
                      <span className="text-[0.7rem] tracking-widest text-subtle">
                        0{index + 1}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-white/8 pt-5">
                <Button
                  href={LINKS.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="secondary"
                  size="sm"
                >
                  <FaGithub className="size-4" aria-hidden="true" />
                  GitHub
                </Button>
                <Button href="#caption" onClick={closeMenu} size="sm">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Try AI
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
