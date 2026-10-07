import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Flow, MaskLine, Poster, Tag } from '../ChapterShell'
import { ART, Mascot } from '../assets.jsx'
import { useScene } from '../useStory'
import { wipe } from '../../lib/wipe'
import { CHAPTERS } from '../story'

const HEIGHT = CHAPTERS[7].height

/**
 * CHAPTER 7 — DELIVERY
 *
 * Movement stops. The node goes green, the mascot comes back for the strongest
 * appearance in the film, and then the two lines the whole story has been
 * walking towards — one per viewport, huge. It ends on the real logo and the
 * way into the product.
 */
export default function Ch7Delivery({ enabled }) {
  const ref = useRef(null)
  const navigate = useNavigate()

  useScene(
    ref,
    (q) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
        },
      })

      tl.fromTo(q('[data-block="arrived"] [data-mask-line]'), { yPercent: 118 }, { yPercent: 0, duration: 0.05, stagger: 0.02, ease: 'power3.out' }, 0.02)
      tl.fromTo(q('[data-swap]'), { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.02)
      tl.fromTo(q('[data-mascot]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.06)

      tl.fromTo(q('[data-block="one"] [data-mask-line]'), { yPercent: 120 }, { yPercent: 0, duration: 0.07, stagger: 0.03, ease: 'power3.out' }, 0.28)
      tl.fromTo(q('[data-block="two"] [data-mask-line]'), { yPercent: 120 }, { yPercent: 0, duration: 0.07, stagger: 0.03, ease: 'power3.out' }, 0.52)

      tl.fromTo(q('[data-final]'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.78)
    },
    enabled,
  )

  return (
    <Flow ref={ref} id="delivery" height={HEIGHT} tone="paper" className="bg-paper">
      {/* 1 — lunch has arrived */}
      <div data-block="arrived" className="flex min-h-dvh items-center px-[6vw]">
        <div data-swap className="w-full">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <Tag className="text-green">Delivered</Tag>
            <span className="numeric text-[clamp(1.3rem,2.4vw,1.9rem)] leading-none text-ink">
              12:18
            </span>
          </div>
          <Poster vw={11.5} vh={16} className="mt-4 text-ink">
            <MaskLine>LUNCH</MaskLine>
            <MaskLine>HAS</MaskLine>
            <MaskLine>
              ARRIVED<span className="text-green">.</span>
            </MaskLine>
          </Poster>
        </div>

        {/* His strongest appearance after the opening. */}
        <div data-mascot className="pointer-events-none ml-auto hidden w-[30vw] max-w-[380px] lg:block">
          <Mascot pose="mascotTiffin" className="h-auto w-full" />
        </div>
      </div>

      {/* 2 — the conclusion, one sentence per viewport */}
      <div data-block="one" className="flex min-h-dvh items-center px-[6vw]">
        <Poster vw={11} vh={15} className="w-full text-ink">
          <MaskLine>THE NETWORK</MaskLine>
          <MaskLine>
            ALREADY EXISTS<span className="text-orange">.</span>
          </MaskLine>
        </Poster>
      </div>

      <div data-block="two" className="flex min-h-dvh items-center px-[6vw]">
        <Poster vw={10} vh={15} className="w-full text-ink">
          <MaskLine>WE’RE BUILDING</MaskLine>
          <MaskLine>THE BRIDGE</MaskLine>
          <MaskLine>
            TO IT<span className="text-orange">.</span>
          </MaskLine>
        </Poster>
      </div>

      {/* 3 — the last frame */}
      <div className="flex min-h-dvh flex-col items-center justify-center px-[6vw] text-center">
        <div data-final>
          <img
            src={ART.logoDark.src}
            alt="SETU — Mumbai’s Dabba Connection"
            width={ART.logoDark.w}
            height={ART.logoDark.h}
            className="mx-auto h-[42px] w-auto sm:h-[54px]"
          />

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              data-cursor="expand"
              data-cursor-label="ENTER"
              onClick={() => wipe.play(() => navigate('/route'))}
              className="inline-flex h-[58px] w-full items-center justify-center rounded-panel border border-orange bg-orange px-7 text-[1rem] font-semibold text-ink transition-colors hover:border-orange-deep hover:bg-orange-deep sm:w-auto"
            >
              Check my route
            </button>
            <button
              type="button"
              data-cursor="expand"
              onClick={() => wipe.play(() => navigate('/app'))}
              className="inline-flex h-[58px] w-full items-center justify-center rounded-panel border border-ink bg-transparent px-7 text-[1rem] font-semibold text-ink transition-colors hover:bg-ink/[0.07] sm:w-auto"
            >
              Explore the app
            </button>
          </div>

          <p className="mx-auto mt-8 max-w-[46ch] text-[12.5px] leading-snug text-quiet">
            A frontend prototype. Mock data only — no backend, no payments, no maps, no GPS.
          </p>
        </div>
      </div>
    </Flow>
  )
}
