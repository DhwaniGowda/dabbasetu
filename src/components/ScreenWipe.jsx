import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { wipe } from '../lib/wipe'

/**
 * The hand-off from the film into the product.
 *
 * The orange route line draws itself across the screen, the screen washes to
 * warm cream behind it, the router navigates at the peak, and the cream lifts
 * to reveal the real SETU screen. It lives in App, above <Routes>, so the
 * overlay is still on screen while the route swaps underneath it.
 *
 * Under reduced motion the wipe is skipped entirely and the navigation is
 * immediate.
 */
export default function ScreenWipe() {
  const root = useRef(null)
  const line = useRef(null)
  const wash = useRef(null)
  const mark = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    wipe.play = (go) => {
      if (reduce || !root.current) {
        go()
        return
      }
      const el = root.current
      el.style.pointerEvents = 'auto'
      gsap.killTweensOf([line.current, wash.current, mark.current])

      const tl = gsap.timeline({
        onComplete: () => {
          el.style.pointerEvents = 'none'
        },
      })

      tl.set(el, { autoAlpha: 1 })
        .fromTo(line.current, { scaleX: 0 }, { scaleX: 1, duration: 0.44, ease: 'power3.inOut' })
        .fromTo(wash.current, { yPercent: 100 }, { yPercent: 0, duration: 0.34, ease: 'power2.inOut' }, '-=0.06')
        .fromTo(mark.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.24 }, '-=0.1')
        .add(() => go())
        .to({}, { duration: 0.22 })
        .to(mark.current, { autoAlpha: 0, duration: 0.2 }, '-=0.1')
        .to(line.current, { autoAlpha: 0, duration: 0.3 }, '-=0.1')
        .to(wash.current, { yPercent: -100, duration: 0.5, ease: 'power2.inOut' }, '-=0.24')
        .set(wash.current, { yPercent: 100 })
        .set(el, { autoAlpha: 0 })
    }

    return () => {
      wipe.play = null
    }
  }, [])

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[90]"
    >
      {/* The orange route line, drawn across the full width. */}
      <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2">
        <div ref={line} className="h-full w-full origin-left bg-orange" />
      </div>

      <div ref={wash} className="absolute inset-0 bg-[#faf7ef]">
        <div className="flex h-full items-center justify-center">
          <p ref={mark} className="display text-[clamp(2.4rem,7vw,4.6rem)] leading-none text-ink">
            Loading your route
            <span className="text-orange">.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
