import { useRef } from 'react'
import gsap from 'gsap'
import { MaskLine, Poster, Stage, Tag } from '../ChapterShell'
import { ART } from '../assets.jsx'
import { useScene } from '../useStory'
import { CHAPTERS } from '../story'

const HEIGHT = CHAPTERS[4].height

/**
 * CHAPTER 4 — SETU
 *
 * The gap becomes a bridge. A single orange line travels from the customer side
 * to the dabbawala side, arches, and hands over to the real SETU logo at matched
 * geometry — the same shape the mark has always had. No logo animation gimmicks,
 * and a lot of empty space afterwards.
 */
export default function Ch4Bridge({ enabled }) {
  const ref = useRef(null)

  useScene(
    ref,
    (q) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      })

      // The gap, with nothing across it.
      tl.fromTo(q('[data-gap]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0)
      tl.fromTo(q('[data-gap-side]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05, stagger: 0.03 }, 0.02)

      // The line travels across.
      tl.fromTo(
        q('[data-arch-line]'),
        { strokeDashoffset: 1500 },
        { strokeDashoffset: 0, duration: 0.2, ease: 'power1.inOut' },
        0.14,
      )
      tl.fromTo(q('[data-arch-ring]'), { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.06, stagger: 0.03, ease: 'back.out(2)' }, 0.3)
      tl.fromTo(q('[data-gap]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06 }, 0.34)

      // Hand over to the real logo, at matched geometry.
      tl.fromTo(q('[data-arch]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06 }, 0.42)
      tl.fromTo(
        q('[data-logo]'),
        { autoAlpha: 0, scale: 0.94 },
        { autoAlpha: 1, scale: 1, duration: 0.07, ease: 'power2.out' },
        0.43,
      )
      tl.to(q('[data-logo]'), { autoAlpha: 0, y: -30, duration: 0.07 }, 0.6)

      // The name.
      tl.fromTo(q('[data-setu]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.56)
      tl.fromTo(q('[data-setu] [data-mask-line]'), { yPercent: 120 }, { yPercent: 0, duration: 0.09, ease: 'power3.out' }, 0.56)
      tl.fromTo(q('[data-tag]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.66)
      tl.fromTo(q('[data-note]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.72)
      tl.fromTo(q('[data-pledge]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05, stagger: 0.035 }, 0.8)
    },
    enabled,
  )

  return (
    <Stage ref={ref} id="bridge" height={HEIGHT} tone="ink" className="bg-ink">
      <div className="relative h-full w-full">
        {/* The gap and the bridge share one coordinate space. */}
        <div className="absolute inset-x-[6vw] top-[30vh]">
          <div className="relative mx-auto w-full max-w-[1100px]">
            <svg viewBox="0 0 1200 420" className="w-full" aria-hidden="true">
              <g data-arch>
                <path
                  data-arch-line
                  d="M120 300 Q600 168 1080 300"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="1500"
                  strokeDashoffset="1500"
                />
                <circle data-arch-ring cx="120" cy="300" r="17" fill="none" stroke="#faf7ef" strokeWidth="3" />
                <circle data-arch-ring cx="1080" cy="300" r="17" fill="none" stroke="#f97316" strokeWidth="3" />
              </g>
            </svg>

            {/* The real mark, placed where the arch just was. */}
            <img
              data-logo
              src={ART.logoLight.src}
              alt=""
              aria-hidden="true"
              width={ART.logoLight.w}
              height={ART.logoLight.h}
              className="pointer-events-none absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 select-none opacity-0"
            />
          </div>

          {/* The two sides, with absolutely nothing between them. */}
          <div data-gap className="absolute inset-x-0 top-[74%] flex items-start justify-between">
            <span data-gap-side className="max-w-[14ch]">
              <Tag className="block text-paper/45">Customers</Tag>
              <span className="mt-2 block text-[clamp(1rem,1.8vw,1.5rem)] text-paper/80">
                Want lunch carried
              </span>
            </span>
            <span data-gap-side className="max-w-[14ch] text-right">
              <Tag className="block text-paper/45">Dabbawalas</Tag>
              <span className="mt-2 block text-[clamp(1rem,1.8vw,1.5rem)] text-paper/80">
                Carry it already
              </span>
            </span>
          </div>
        </div>

        {/* The reveal */}
        <div data-setu className="absolute inset-x-[6vw] top-[26vh] text-center">
          <Poster vw={13} vh={19} className="text-paper">
            <MaskLine>
              SETU<span className="text-orange">.</span>
            </MaskLine>
          </Poster>
          <p data-tag className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-paper/55">
            Mumbai’s Dabba Connection
          </p>
          <p
            data-note
            className="mx-auto mt-[6vh] max-w-[30ch] text-[clamp(1rem,1.9vw,1.45rem)] leading-snug text-paper/70"
          >
            An app that connects you to Mumbai’s dabbawalas.
          </p>
          <div className="mx-auto mt-[5vh] max-w-[46ch] space-y-1.5 text-left">
            {['We don’t cook.', 'We don’t hire delivery boys.', 'We make the existing network easier to use.'].map(
              (line) => (
                <p key={line} data-pledge className="text-[clamp(0.95rem,1.6vw,1.2rem)] text-paper/55">
                  {line}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    </Stage>
  )
}
