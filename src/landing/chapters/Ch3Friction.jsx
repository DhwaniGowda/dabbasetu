import { useRef } from 'react'
import gsap from 'gsap'
import { MaskLine, Poster, Stage, Tag } from '../ChapterShell'
import { useScene } from '../useStory'
import { CHAPTERS } from '../story'

const HEIGHT = CHAPTERS[3].height

/**
 * Five real questions, art-directed at five different depths so they crowd the
 * frame as they arrive. Deliberately not feature cards.
 */
const QUESTIONS = [
  { text: 'How do I even find a dabbawala?', left: '14%', top: '34%', depth: 0.62, rot: -3 },
  { text: 'Does he cover my home AND my office?', left: '58%', top: '26%', depth: 0.78, rot: 2 },
  { text: 'Cash every month?', left: '30%', top: '58%', depth: 1, rot: -1.5 },
  { text: 'Where is my lunch right now?', left: '68%', top: '62%', depth: 0.88, rot: 3 },
  { text: 'I only go to office 3 days a week.', left: '44%', top: '80%', depth: 0.7, rot: -2 },
]

/**
 * CHAPTER 3 — THE FRICTION
 *
 * Movement stops dead. Two statements, then the questions arrive from depth until
 * the screen is crowded, then a hard cut to nothing.
 */
export default function Ch3Friction({ enabled }) {
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

      // The verdict.
      tl.fromTo(q('[data-a]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0)
      tl.fromTo(q('[data-a] [data-mask-line]'), { yPercent: 120 }, { yPercent: 0, duration: 0.1, stagger: 0.04, ease: 'power3.out' }, 0)
      tl.fromTo(q('[data-b]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.13)
      tl.fromTo(q('[data-b] [data-mask-line]'), { yPercent: 120 }, { yPercent: 0, duration: 0.1, stagger: 0.045, ease: 'power3.out' }, 0.14)
      tl.to([q('[data-a]'), q('[data-b]')], { autoAlpha: 0, y: -34, duration: 0.08 }, 0.29)

      // The pile-up. Static transforms go through GSAP so its own transform
      // string stays authoritative — mixing CSS transforms with GSAP breaks
      // the centring.
      QUESTIONS.forEach((question, i) => {
        gsap.set(q(`[data-q="${i}"]`), {
          xPercent: -50,
          yPercent: -50,
          rotation: question.rot,
        })
      })
      QUESTIONS.forEach((question, i) => {
        const at = 0.36 + i * 0.065
        tl.fromTo(
          q(`[data-q="${i}"]`),
          { autoAlpha: 0, scale: 0.42, filter: 'blur(7px)' },
          {
            autoAlpha: 1,
            scale: question.depth,
            filter: 'blur(0px)',
            duration: 0.09,
            ease: 'power2.out',
          },
          at,
        )
      })
      // Everything leaves at once: the cut to empty.
      tl.to(q('[data-q]'), { autoAlpha: 0, scale: 0.86, filter: 'blur(4px)', duration: 0.05 }, 0.76)
      tl.to(q('[data-pile]'), { autoAlpha: 0, duration: 0.02 }, 0.81)

      // The sentence in the empty space.
      tl.fromTo(q('[data-c]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.82)
      tl.fromTo(q('[data-c] [data-mask-line]'), { yPercent: 118 }, { yPercent: 0, duration: 0.09, stagger: 0.04, ease: 'power3.out' }, 0.82)
      tl.fromTo(q('[data-d]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.92)
      tl.fromTo(q('[data-d] [data-mask-line]'), { yPercent: 118 }, { yPercent: 0, duration: 0.08, stagger: 0.04, ease: 'power3.out' }, 0.92)
    },
    enabled,
  )

  return (
    <Stage ref={ref} id="friction" height={HEIGHT} tone="ink" className="bg-ink">
      <div className="relative h-full w-full">
        {/* Verdict */}
        <div data-a className="absolute inset-x-[6vw] top-[30vh]">
          <Poster vw={10.5} vh={14} className="text-paper">
            <MaskLine>GREAT</MaskLine>
            <MaskLine>SYSTEM.</MaskLine>
          </Poster>
        </div>
        <div data-b className="absolute inset-x-[6vw] top-[38vh] text-right">
          <Poster vw={10.5} vh={14} className="text-orange">
            <MaskLine>HARD</MaskLine>
            <MaskLine>TO GET IN.</MaskLine>
          </Poster>
        </div>

        {/* The pile-up */}
        <div data-pile className="absolute inset-0">
          {QUESTIONS.map((question, i) => (
            <p
              key={question.text}
              data-q={i}
              className="absolute max-w-[20ch] -translate-x-1/2 -translate-y-1/2 text-[clamp(1.1rem,2.6vw,2.1rem)] font-semibold leading-snug text-paper/85"
              style={{
                left: question.left,
                top: question.top,
                rotate: `${question.rot}deg`,
                transformOrigin: 'center',
              }}
            >
              {question.text}
            </p>
          ))}
        </div>

        {/* Empty space, one sentence at a time */}
        <div data-c className="absolute inset-x-[6vw] top-[30vh] text-center">
          <Poster vw={9.5} vh={13} className="text-paper">
            <MaskLine>BOTH SIDES</MaskLine>
            <MaskLine>WANT EACH OTHER.</MaskLine>
          </Poster>
        </div>
        <div data-d className="absolute inset-x-[6vw] top-[38vh] text-center">
          <Poster vw={9.5} vh={13} className="text-paper/70">
            <MaskLine>NOTHING</MaskLine>
            <MaskLine>
              CONNECTS THEM<span className="text-orange">.</span>
            </MaskLine>
          </Poster>
          <Tag className="mt-[5vh] block text-paper/35">Until now</Tag>
        </div>
      </div>
    </Stage>
  )
}
