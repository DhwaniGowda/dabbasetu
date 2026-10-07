import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BottomNav from './BottomNav'
import DesktopRail from './DesktopRail'
import Logo, { LogoMark } from './Logo'

/**
 * Desktop: rail + content column + sticky context column. Phone: header + bottom nav.
 * `hero` renders full-bleed above the content column — the deck's opening slide.
 */
export default function AppShell({
  children,
  hero,
  headerTone = 'paper',
  aside,
  back,
  step,
  nav = true,
  className = '',
  contentClassName = '',
}) {
  const dark = headerTone === 'ink'

  return (
    <div className={`min-h-dvh bg-paper ${dark ? 'lg:bg-paper' : ''}`}>
      <DesktopRail />

      <div className="lg:pl-[250px]">
        <MobileHeader back={back} step={step} tone={headerTone} />

        {hero}

        <main
          className={`mx-auto w-full max-w-[1180px] px-5 pt-8 sm:px-7 sm:pt-10 lg:px-11 lg:pt-14 ${
            nav ? 'pb-32 lg:pb-24' : 'pb-44 lg:pb-24'
          } ${className}`}
        >
          <div
            className={
              aside
                ? 'grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_332px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_364px] xl:gap-14'
                : ''
            }
          >
            <div className={`min-w-0 ${contentClassName}`}>{children}</div>

            {aside && (
              <aside className="hidden lg:block">
                <div className="sticky top-14 space-y-5">{aside}</div>
              </aside>
            )}
          </div>
        </main>
      </div>

      {nav && <BottomNav />}
    </div>
  )
}

function MobileHeader({ back, step, tone }) {
  const navigate = useNavigate()
  const dark = tone === 'ink'

  return (
    <header
      {...(dark ? { 'data-surface': 'ink' } : {})}
      className={`sticky top-0 z-40 border-b lg:hidden ${
        dark
          ? 'border-paper/12 bg-ink/95 backdrop-blur-md'
          : 'border-line bg-paper/90 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-3 px-5 sm:px-7">
        {back ? (
          <button
            type="button"
            onClick={() => (back.to ? navigate(back.to) : navigate(-1))}
            className={`-ml-2 flex h-11 items-center gap-1.5 rounded-[10px] px-2 text-[14px] font-semibold transition-colors ${
              dark ? 'text-paper/75 hover:text-paper' : 'text-ink-3 hover:text-ink'
            }`}
          >
            <ArrowLeft size={17} strokeWidth={2.2} aria-hidden="true" />
            {back.label}
          </button>
        ) : (
          <Link to="/app" aria-label="SETU home" className="rounded-[10px]">
            {dark ? <LogoMark height={24} tone="light" /> : <Logo height={26} />}
          </Link>
        )}

        {step ? (
          <span
            className={`numeric text-[14px] ${dark ? 'text-paper/70' : 'text-ink-3'}`}
          >
            {String(step[0]).padStart(2, '0')}
            <span className={dark ? 'text-paper/35' : 'text-faint'}>
              /{String(step[1]).padStart(2, '0')}
            </span>
          </span>
        ) : (
          <Link
            to="/dabbawala"
            className={`eyebrow py-2 transition-colors ${
              dark ? 'text-paper/60 hover:text-paper' : 'text-quiet hover:text-ink'
            }`}
          >
            Dabbawala
          </Link>
        )}
      </div>
    </header>
  )
}
