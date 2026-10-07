import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ART } from './assets.jsx'
import { wipe } from '../lib/wipe'

const LINKS = [
  { label: 'The story', href: '#chapter-tiffin' },
  { label: 'How it works', href: '#chapter-track' },
]

/**
 * Kept deliberately minimal: a mark and three words. It only appears once the
 * prelude has finished, and it changes between charcoal and cream with the
 * chapter underneath it rather than sitting on a bar of its own.
 */
export default function Nav({ tone = 'ink', enabled = true }) {
  const navigate = useNavigate()
  const [shown, setShown] = useState(!enabled)
  const [open, setOpen] = useState(false)
  const dark = tone === 'ink'

  useEffect(() => {
    if (!enabled) return undefined
    const t = ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight * 0.72,
      scrub: true,
      onUpdate: (self) => setShown(self.progress >= 1),
    })
    return () => t.kill()
  }, [enabled])

  const enter = () => wipe.play(() => navigate('/app'))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[opacity,transform] duration-500 ${
        shown ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
      style={{ pointerEvents: shown ? 'auto' : 'none' }}
      {...(dark ? { 'data-surface': 'ink' } : {})}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#setu-top"
          aria-label="SETU — back to the top"
          className="flex items-center rounded-[10px]"
          data-cursor="expand"
        >
          <img
            src={dark ? ART.markLight.src : ART.markDark.src}
            alt="SETU"
            width={dark ? 607 : 230}
            height={dark ? 340 : 142}
            className="h-[26px] w-auto select-none"
          />
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors ${
                dark ? 'text-paper/75 hover:text-paper' : 'text-quiet hover:text-ink'
              }`}
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-orange transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          ))}

          <button
            type="button"
            data-cursor="expand"
            data-cursor-label="ENTER"
            onClick={enter}
            className={`inline-flex h-10 items-center rounded-[10px] border px-4 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] transition-colors ${
              dark
                ? 'border-paper/35 text-paper hover:bg-paper hover:text-ink'
                : 'border-ink/70 text-ink hover:bg-ink hover:text-paper'
            }`}
          >
            Enter SETU
          </button>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className={`flex h-10 items-center rounded-[10px] border px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] md:hidden ${
            dark ? 'border-paper/30 text-paper' : 'border-line-2 text-ink'
          }`}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div
          className={`mx-5 mt-1 rounded-panel border p-2 sm:mx-8 md:hidden ${
            dark ? 'border-paper/15 bg-ink' : 'border-line bg-paper'
          }`}
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-[10px] px-3 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
                dark ? 'text-paper' : 'text-ink'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
