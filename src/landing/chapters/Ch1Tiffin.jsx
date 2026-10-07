import { useRef } from 'react'
import gsap from 'gsap'
import { MaskLine, Poster, Stage, Tag } from '../ChapterShell'
import { Mascot } from '../assets.jsx'
import { useScene } from '../useStory'
import { CHAPTERS } from '../story'

const HEIGHT = CHAPTERS[1].height

const STATS = [
  { n: '~3,000', label: 'Dabbawalas', pos: 'left-[6vw] top-[24%] text-left' },
  { n: '50K – 1 LAKH', label: 'Lunchboxes, every day', pos: 'right-[6vw] top-[70%] text-right' },
  { n: 'BEFORE 1 PM', label: 'Nobody has ever missed it', pos: 'left-[6vw] top-[76%] text-left' },
]

/**
 * CHAPTER 1 — THE TIFFIN
 *
 * The giant type sits in the layer *behind* the WebGL canvas, so the steel
 * tiffin drifts in front of the words. The mascot arrives for the first time, in
 * the foreground, small. The numbers are shown as title cards passing through
 * the frame — huge numerals, tiny mono labels, never stat boxes.
 */
export default function Ch1Tiffin({ enabled }) {
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
          scrub: 0.45,
        },
      })

      // The headline, revealed line by line.
      tl.fromTo(
        q('[data-mask-line]'),
        { yPercent: 118 },
        { yPercent: 0, duration: 0.12, stagger: 0.045, ease: 'power3.out' },
        0.0,
      )
      tl.fromTo(q('[data-head]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.0)
      // It recedes as the tiffin grows, then leaves.
      tl.to(q('[data-head]'), { yPercent: -12, autoAlpha: 0.3, duration: 0.3 }, 0.34)
      tl.to(q('[data-head]'), { autoAlpha: 0, duration: 0.14 }, 0.82)

      // The mascot's first appearance: lower corner, foreground, unhurried.
      tl.fromTo(
        q('[data-mascot]'),
        { xPercent: -26, yPercent: 8, autoAlpha: 0, scale: 0.94 },
        { xPercent: 0, yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.14, ease: 'power2.out' },
        0.1,
      )
      tl.to(q('[data-mascot]'), { xPercent: -10, yPercent: 6, autoAlpha: 0, duration: 0.16 }, 0.84)

      // Title cards: in, hold, out — one at a time.
      STATS.forEach((_, i) => {
        const at = 0.36 + i * 0.16
        tl.fromTo(
          q(`[data-stat="${i}"]`),
          { autoAlpha: 0, y: 34, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.05, ease: 'power2.out' },
          at,
        )
        tl.to(
          q(`[data-stat="${i}"]`),
          { autoAlpha: 0, y: -30, duration: 0.05, ease: 'power2.in' },
          at + 0.1,
        )
      })
    },
    enabled,
  )

  return (
    <Stage
      ref={ref}
      id="tiffin"
      height={HEIGHT}
      tone="ink"
      className="bg-ink"
      under={
        <div data-head className="relative w-full px-[6vw] text-center">
          <Poster vw={15.5} vh={13.5} className="text-paper">
            <MaskLine>MUMBAI’S</MaskLine>
            <MaskLine className="text-orange">LUNCH</MaskLine>
            <MaskLine>HAS MOVED</MaskLine>
            <MaskLine>THIS WAY</MaskLine>
            <MaskLine className="text-paper/55">SINCE 1890.</MaskLine>
          </Poster>
        </div>
      }
    >
      <div className="relative h-full w-full">
        {/* The mascot, foreground left. */}
        <div
          data-mascot
          className="absolute bottom-[6vh] left-[4vw] w-[34vw] max-w-[300px] sm:w-[26vw]"
        >
          <Mascot pose="mascotRunning" className="h-auto w-full" eager />
        </div>

        {/* Title cards. */}
        {STATS.map((stat, i) => (
          <div
            key={stat.n}
            data-stat={i}
            className={`absolute ${stat.pos}`}
          >
            <p className="numeric t-stat text-paper">{stat.n}</p>
            <Tag className="mt-3 block text-paper/50">{stat.label}</Tag>
          </div>
        ))}
      </div>
    </Stage>
  )
}
