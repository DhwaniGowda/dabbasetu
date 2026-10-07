import { useRef } from 'react'
import gsap from 'gsap'
import { Poster, Stage, Tag } from '../ChapterShell'
import { useScene } from '../useStory'
import { CHAPTERS } from '../story'

const HEIGHT = CHAPTERS[0].height

/**
 * CHAPTER 0 — PRELUDE
 *
 * Almost black. A departure board at 07:58, a railway line drawing itself, one
 * orange station, an abstract train passing, then MUMBAI / MOVES. at poster
 * scale. It ends on the word LUNCH opening up to reveal the tiffin behind it.
 */
export default function Ch0Prelude({ enabled }) {
  const ref = useRef(null)

  useScene(
    ref,
    (q, self) => {
      // The quiet board is the first thing anyone sees, so it arrives on load
      // rather than waiting for a scroll. Only its exit is scroll-driven, which
      // also means the two never fight over the same property.
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro.fromTo(q('[data-board]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.0 }, 0.15)
      intro.fromTo(q('[data-rail]'), { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.45)
      intro.fromTo(
        q('[data-node]'),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' },
        1.7,
      )

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      })

      // The abstract train passes, and the board leaves the frame upward.
      tl.fromTo(
        q('[data-train]'),
        { xPercent: -130, autoAlpha: 0 },
        { xPercent: 130, autoAlpha: 1, duration: 0.1, ease: 'power2.in' },
        0.17,
      )
      tl.to(q('[data-train]'), { autoAlpha: 0, duration: 0.02 }, 0.29)
      tl.to(q('[data-board]'), { y: -170, duration: 0.14 }, 0.22)

      // MUMBAI, then MOVES.
      tl.fromTo(q('[data-mumbai]'), { yPercent: 112 }, { yPercent: 0, duration: 0.1, ease: 'power3.out' }, 0.32)
      tl.fromTo(q('[data-moves]'), { yPercent: 112 }, { yPercent: 0, duration: 0.1, ease: 'power3.out' }, 0.44)
      tl.to(q('[data-mumbai-moves]'), { yPercent: -46, autoAlpha: 0, duration: 0.12 }, 0.56)

      // The two lines of plain speech.
      tl.fromTo(q('[data-line-1]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.62)
      tl.to(q('[data-line-1]'), { autoAlpha: 0, y: -16, duration: 0.05 }, 0.74)
      tl.fromTo(q('[data-line-2]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.79)
      tl.to(q('[data-line-2]'), { autoAlpha: 0, y: -16, duration: 0.05 }, 0.9)

      // LUNCH opens, and the tiffin comes up behind it (the 3D does that half).
      tl.fromTo(
        q('[data-lunch]'),
        { autoAlpha: 0, scale: 1.12, letterSpacing: '0.06em' },
        { autoAlpha: 1, scale: 1, letterSpacing: '0em', duration: 0.06, ease: 'power2.out' },
        0.9,
      )
      tl.to(q('[data-lunch]'), { autoAlpha: 0, scale: 0.96, duration: 0.06 }, 0.99)
    },
    enabled,
  )

  return (
    <Stage ref={ref} id="prelude" height={HEIGHT} tone="ink" className="bg-ink">
      <div className="relative flex h-full w-full items-center justify-center">
        {/* The quiet board */}
        <div data-board className="absolute flex flex-col items-center gap-3 px-6 text-center">
          <p className="numeric text-[clamp(2.6rem,7vw,4.4rem)] leading-none text-paper">07:58</p>
          <Tag className="text-paper/45">A weekday morning</Tag>
          <Tag className="text-paper/30">Mumbai</Tag>

          <div className="relative mt-8 h-px w-[min(78vw,44rem)]">
            <span data-rail className="absolute inset-0 origin-left bg-paper/60" />
            <span
              data-node
              className="absolute -top-[5px] left-[22%] size-[11px] rounded-full bg-orange"
            />
          </div>
        </div>

        {/* Abstract train: a cream carriage band crossing the frame. */}
        <div data-train className="pointer-events-none absolute inset-x-0 top-[34%]">
          <div className="mx-auto h-[3px] w-[62vw] bg-paper/25" />
          <div className="mx-auto mt-2 flex w-[62vw] gap-2">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="h-8 flex-1 bg-paper/70" />
            ))}
          </div>
        </div>

        {/* MUMBAI MOVES. */}
        <div data-mumbai-moves className="absolute inset-x-0 flex flex-col items-center">
          <span className="mask block w-full text-center">
            <Poster data-mumbai vw={19.5} vh={26} className="text-paper">
              MUMBAI
            </Poster>
          </span>
          <span className="mask mt-[1vh] block w-full text-center">
            <Poster data-moves vw={17} vh={23} className="text-orange">
              MOVES.
            </Poster>
          </span>
        </div>

        {/* The two lines of plain speech. */}
        <p
          data-line-1
          className="absolute max-w-[22ch] px-8 text-center text-[clamp(1.05rem,2.1vw,1.6rem)] leading-snug text-paper/70"
        >
          Almost a crore train rides happen every day.
        </p>
        <p
          data-line-2
          className="absolute max-w-[22ch] px-8 text-center text-[clamp(1.05rem,2.1vw,1.6rem)] leading-snug text-paper/70"
        >
          Inside those trains, lunch is moving too.
        </p>

        {/* LUNCH — the word the tiffin arrives behind. */}
        <Poster data-lunch vw={21} vh={27} className="absolute inset-x-0 text-center text-paper">
          LUNCH
        </Poster>
      </div>
    </Stage>
  )
}
