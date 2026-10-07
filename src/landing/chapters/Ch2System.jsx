import { useRef, useState } from 'react'
import gsap from 'gsap'
import { MaskLine, Poster, Stage, Tag } from '../ChapterShell'
import { Mascot } from '../assets.jsx'
import { useScene } from '../useStory'
import { CHAPTERS } from '../story'

const HEIGHT = CHAPTERS[2].height

const STATIONS = [
  { name: 'HOME', time: '09:00', note: 'Picked up at the door' },
  { name: 'KANDIVALI', time: '09:45', note: 'Sorted into crate K4-07' },
  { name: 'LOCAL TRAIN', time: '10:15', note: 'On the Western Line' },
  { name: 'LOWER PAREL', time: '11:30', note: 'Off the train' },
  { name: 'DESK', time: '12:30', note: 'Handed over' },
]

/**
 * CHAPTER 2 — THE MACHINE THAT ISN'T A MACHINE
 *
 * The visitor scrolls down but the world moves sideways: the WebGL rail slides
 * past with five station nodes, easing to a stop at each one. The DOM carries
 * the headline, the current station title card and a one-line progress rail.
 * Nothing here is a timeline component — it is a journey you sit inside.
 */
export default function Ch2System({ enabled }) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)

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
            // Five stops, weighted so the name changes while the node locks.
            const i = Math.min(STATIONS.length - 1, Math.floor(self.progress * STATIONS.length * 1.02))
            setIndex((prev) => (prev === i ? prev : i))
          },
        },
      })

      tl.fromTo(q('[data-open] [data-mask-line]'), { yPercent: 116 }, { yPercent: 0, duration: 0.09, stagger: 0.03, ease: 'power3.out' }, 0)
      tl.fromTo(q('[data-sub]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.08)

      // The headline pair hands over to the journey.
      tl.to(q('[data-open]'), { autoAlpha: 0, y: -28, duration: 0.09 }, 0.2)

      // Each station name drifts sideways as the world slides under it.
      tl.fromTo(q('[data-card]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.24)
      tl.fromTo(
        q('[data-card-name]'),
        { xPercent: 4 },
        { xPercent: -4, duration: 0.76, ease: 'none' },
        0.24,
      )

      // The mascot rides along for one stop, then drops behind.
      tl.fromTo(
        q('[data-rider]'),
        { autoAlpha: 0, xPercent: 16 },
        { autoAlpha: 1, xPercent: -6, duration: 0.2, ease: 'power2.out' },
        0.3,
      )
      tl.to(q('[data-rider]'), { autoAlpha: 0, xPercent: -18, duration: 0.12 }, 0.72)

      tl.fromTo(q('[data-outro]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.9)
    },
    enabled,
  )

  const station = STATIONS[index]

  return (
    <Stage ref={ref} id="travel" height={HEIGHT} tone="paper" className="bg-paper">
      <div className="relative h-full w-full px-[6vw]">
        {/* Opening statement */}
        <div data-open className="absolute inset-x-[6vw] top-[16vh]">
          <Poster vw={9.5} vh={13} className="text-ink">
            <MaskLine>IT ALREADY</MaskLine>
            <MaskLine>
              WORKS<span className="text-orange">.</span>
            </MaskLine>
          </Poster>
          <div data-sub className="mt-[4vh] flex flex-wrap gap-x-8 gap-y-2">
            <Tag className="text-quiet">No app</Tag>
            <Tag className="text-quiet">No GPS</Tag>
            <Tag className="text-quiet">No new riders</Tag>
          </div>
        </div>

        {/* The current station */}
        <div data-card className="absolute inset-x-[6vw] top-[26vh]">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <Tag className="text-orange-ink">
              Stop {String(index + 1).padStart(2, '0')} / {String(STATIONS.length).padStart(2, '0')}
            </Tag>
            <span className="numeric text-[clamp(1.4rem,2.6vw,2rem)] leading-none text-ink">
              {station.time}
            </span>
          </div>
          <Poster data-card-name vw={13} vh={17} className="mt-4 text-ink">
            {station.name}
          </Poster>
          <p className="mt-3 text-[clamp(0.95rem,1.5vw,1.2rem)] text-quiet">{station.note}</p>
        </div>

        {/* A slim progress rail, one node per stop. */}
        <div className="absolute inset-x-[6vw] top-[74vh]">
          <div className="relative flex items-center justify-between">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/25" />
            {STATIONS.map((s, i) => (
              <span
                key={s.name}
                aria-hidden="true"
                className={`relative rounded-full transition-all duration-500 ${
                  i < index
                    ? 'size-[9px] bg-green'
                    : i === index
                      ? 'size-[14px] bg-orange'
                      : 'size-[9px] bg-paper ring-2 ring-ink'
                }`}
              />
            ))}
          </div>
          <div className="relative mt-4 flex justify-between">
            {STATIONS.map((s, i) => (
              <span
                key={s.name}
                className={`font-mono text-[9.5px] font-bold uppercase tracking-[0.08em] transition-colors duration-500 ${
                  i === index ? 'text-ink' : 'text-faint'
                }`}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* The mascot, riding one leg of the journey. */}
        <div data-rider className="absolute bottom-[6vh] right-[6vw] w-[26vw] max-w-[240px]">
          <Mascot pose="mascotRide" className="h-auto w-full" />
        </div>

        <p data-outro className="absolute inset-x-[6vw] bottom-[9vh] max-w-[34ch] text-[clamp(0.9rem,1.4vw,1.1rem)] text-quiet">
          Forty-two dabbas ride this crate. Yours is one of them.
        </p>
      </div>
    </Stage>
  )
}
