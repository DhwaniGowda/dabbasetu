import { useRef, useState } from 'react'
import gsap from 'gsap'
import { MaskLine, Poster, Stage, Tag } from '../ChapterShell'
import { ART } from '../assets.jsx'
import { useScene } from '../useStory'
import { CHAPTERS } from '../story'

const HEIGHT = CHAPTERS[6].height

const CHECKPOINTS = ['Picked up', 'At station', 'Reached office stn', 'Delivered']

const SCANS = [
  { time: '9:12', what: 'Collected from home' },
  { time: '9:51', what: 'Kandivali' },
  { time: '10:14', what: 'On the local' },
  { time: '11:40', what: 'Lower Parel' },
  { time: '12:30', what: 'Desk' },
]

/**
 * CHAPTER 6 — TRACK THE DABBA
 *
 * Four QR checkpoints in WebGL, with the tiffin moving through them and each
 * node flashing orange then settling to green. The DOM carries the checkpoint
 * list, the scan times and the line this whole film has been walking towards:
 * four quick scans, and no GPS.
 */
export default function Ch6Track({ enabled }) {
  const ref = useRef(null)
  const [step, setStep] = useState(0)

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
          onUpdate: (self) => {
            // Matches the 3D rail: four checkpoints across the chapter's middle.
            const local = (self.progress - 0.1) / 0.42
            const i = Math.max(0, Math.min(CHECKPOINTS.length - 1, Math.floor(local * CHECKPOINTS.length)))
            setStep((prev) => (prev === i ? prev : i))
          },
        },
      })

      tl.fromTo(q('[data-tag]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0)
      tl.fromTo(q('[data-head] [data-mask-line]'), { yPercent: 118 }, { yPercent: 0, duration: 0.08, stagger: 0.04, ease: 'power3.out' }, 0.02)

      // Checkpoints arrive one at a time.
      tl.fromTo(q('[data-cp]'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.05, stagger: 0.05 }, 0.1)
      tl.fromTo(q('[data-scans]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.3)
      tl.fromTo(
        q('[data-qr]'),
        { autoAlpha: 0, rotationY: 62, scale: 0.8 },
        { autoAlpha: 1, rotationY: 0, scale: 1, duration: 0.1, ease: 'power2.out' },
        0.34,
      )

      // Clear the frame before the big statement.
      tl.to([q('[data-block]')], { autoAlpha: 0, y: -26, duration: 0.06 }, 0.54)

      tl.fromTo(q('[data-big-1]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.62)
      tl.fromTo(q('[data-big-1] [data-mask-line]'), { yPercent: 120 }, { yPercent: 0, duration: 0.09, stagger: 0.05, ease: 'power3.out' }, 0.62)
      tl.to(q('[data-big-1]'), { autoAlpha: 0, y: -40, duration: 0.06 }, 0.82)
      tl.fromTo(q('[data-big-2]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.86)
      tl.fromTo(q('[data-big-2] [data-mask-line]'), { yPercent: 120 }, { yPercent: 0, duration: 0.09, stagger: 0.05, ease: 'power3.out' }, 0.86)
    },
    enabled,
  )

  return (
    <Stage ref={ref} id="track" height={HEIGHT} tone="ink" className="bg-ink">
      <div className="relative h-full w-full px-[6vw]">
        <div data-block className="absolute inset-x-[6vw] top-[9vh]">
          <Tag data-tag className="opacity-0 text-orange">
            4 quick scans · no GPS
          </Tag>
          <Poster data-head vw={8} vh={10.5} className="mt-3 text-paper">
            <MaskLine>YOUR DABBA</MaskLine>
            <MaskLine>
              IS ON
              <span className="text-orange"> THE TRAIN.</span>
            </MaskLine>
          </Poster>
        </div>

        <div data-block className="absolute inset-x-[6vw] top-[24vh] grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <ol className="space-y-3">
            {CHECKPOINTS.map((label, i) => (
              <li key={label} data-cp className="flex items-center gap-3">
                <span
                  className={`grid size-[19px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-500 ${
                    i < step
                      ? 'border-green bg-green'
                      : i === step
                        ? 'border-orange bg-orange'
                        : 'border-paper/35 bg-transparent'
                  }`}
                >
                  {i < step && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4.5 4.5L19 7" stroke="#faf7ef" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <Tag
                  className={`transition-colors duration-500 ${
                    i === step ? 'text-paper' : i < step ? 'text-green-tint/80' : 'text-paper/40'
                  }`}
                >
                  {label}
                </Tag>
              </li>
            ))}
          </ol>

          <img
            data-qr
            src={ART.qr.src}
            alt=""
            aria-hidden="true"
            width={ART.qr.w}
            height={ART.qr.h}
            className="h-[86px] w-[86px] justify-self-start opacity-0 lg:justify-self-end [transform-style:preserve-3d]"
          />
        </div>

        <div data-block className="absolute inset-x-[6vw] top-[62vh]">
          <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-paper/15 pt-4">
            {SCANS.map((scan) => (
              <span key={scan.time} className="flex items-baseline gap-2">
                <span className="numeric text-[clamp(1rem,1.8vw,1.4rem)] leading-none text-paper/80">
                  {scan.time}
                </span>
                <Tag className="text-paper/40">{scan.what}</Tag>
              </span>
            ))}
          </div>
        </div>

        <div data-big-1 className="absolute inset-x-[6vw] top-[26vh]">
          <Poster vw={13} vh={19} className="text-paper">
            <MaskLine>4</MaskLine>
            <MaskLine>QUICK</MaskLine>
            <MaskLine>
              SCANS<span className="text-orange">.</span>
            </MaskLine>
          </Poster>
        </div>

        <div data-big-2 className="absolute inset-x-[6vw] top-[30vh] text-right">
          <Poster vw={12} vh={17} className="text-paper">
            <MaskLine>NO GPS</MaskLine>
            <MaskLine className="text-paper/60">NEEDED.</MaskLine>
          </Poster>
          <p className="mt-[5vh] ml-auto max-w-[34ch] text-[clamp(0.95rem,1.6vw,1.25rem)] leading-snug text-paper/55">
            Nothing is attached to your tiffin. Four people scan a code, and that is the whole
            tracking system.
          </p>
        </div>
      </div>
    </Stage>
  )
}
