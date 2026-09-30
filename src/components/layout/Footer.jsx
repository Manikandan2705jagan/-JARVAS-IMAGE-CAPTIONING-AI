import { ArrowUpRight, GitBranch, Heart } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'

import { PROJECT } from '../../config/site.js'
import Logo from '../ui/Logo.jsx'

const FOOTER_LINKS = [
  { label: 'Home', href: '#home', internal: true },
  { label: 'Image Captioning', href: '#caption', internal: true },
  { label: 'Technology', href: '#technology', internal: true },
  { label: 'GitHub', href: PROJECT.repoUrl, internal: false },
  { label: 'LinkedIn', href: PROJECT.linkedinUrl, internal: false },
]

const BRAND_ICON = {
  GitHub: <FaGithub className="size-4" aria-hidden="true" />,
  LinkedIn: <FaLinkedinIn className="size-4" aria-hidden="true" />,
}

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/8 bg-abyss/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <a href="#home" className="w-fit rounded-xl" aria-label="Jarvas Image Captioning AI — back to top">
              <Logo />
            </a>
            <p className="text-[0.9rem] leading-relaxed text-muted">{PROJECT.tagline}</p>
            <p className="flex items-center gap-1.5 text-[0.82rem] text-subtle">
              Built with <Heart className="size-3.5 text-rose-400/80" aria-hidden="true" /> and a lot
              of model iterations
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-subtle uppercase">
              Explore
            </p>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:grid-cols-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.internal ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
                    className="group inline-flex items-center gap-1.5 text-[0.88rem] text-muted transition-colors hover:text-ink"
                  >
                    {link.internal ? null : BRAND_ICON[link.label]}
                    {link.label}
                    {link.internal ? null : (
                      <ArrowUpRight
                        className="size-3 opacity-0 transition-opacity group-hover:opacity-60"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-7 sm:flex-row">
          <p className="text-[0.82rem] text-subtle">
            &copy; {PROJECT.year} {PROJECT.name}. Built by {PROJECT.author}.
          </p>
          <p className="flex items-center gap-2 font-mono text-[0.72rem] tracking-wider text-subtle">
            <GitBranch className="size-3.5" aria-hidden="true" />
            v{PROJECT.version}
          </p>
        </div>
      </div>
    </footer>
  )
}
