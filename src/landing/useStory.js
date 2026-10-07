import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { CHAPTERS, CHAPTER_IDS, refreshFilm, story } from './story'

gsap.registerPlugin(ScrollTrigger)

/** Mobile browsers resize the viewport when the URL bar moves. Ignore it. */
ScrollTrigger.config({ ignoreMobileResize: true })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isCompact = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 767px), (pointer: coarse)').matches

/**
 * Drives the whole film.
 *
 * - Lenis owns the wheel and hands its scroll to ScrollTrigger through the GSAP
 *   ticker, so there is exactly one rAF loop and one source of truth.
 * - One cheap ScrollTrigger per chapter records how far that chapter has
 *   crossed the viewport. Their values are summed into `story.film`, which the
 *   WebGL scene is keyed to. Chapters own their own cinematic timelines
 *   separately, so pinning never disturbs the camera maths.
 * - Only the nav tone and the compact flag live in React state. Scroll does not
 *   re-render anything.
 */
export function useStory({ enabled }) {
  const [tone, setTone] = useState(CHAPTERS[0].tone)

  useEffect(() => {
    if (!enabled) {
      story.static = true
      story.compact = isCompact()
      story.viewport.w = window.innerWidth
      story.viewport.h = window.innerHeight
      refreshFilm()
      const onResize = () => {
        story.viewport.w = window.innerWidth
        story.viewport.h = window.innerHeight
        story.compact = isCompact()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    story.static = false
    story.compact = isCompact()
    story.viewport.w = window.innerWidth
    story.viewport.h = window.innerHeight

    const lenis = new Lenis({
      lerp: story.compact ? 0.16 : 0.11,
      wheelMultiplier: 1,
      touchMultiplier: story.compact ? 1 : 1.6,
      smoothWheel: true,
    })

    const onLenisScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onLenisScroll)

    let held = false
    const raf = (time) => {
      // Hold the page still behind the loader, then never touch it again.
      if (story.locked !== held) {
        held = story.locked
        if (held) lenis.stop()
        else lenis.start()
      }
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const triggers = []

    // Whole-document progress, for the fader strip in the nav.
    triggers.push(
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          story.progress = self.progress
        },
      }),
    )

    // Chapter crossing progress → the film clock.
    document.querySelectorAll('[data-chapter]').forEach((el) => {
      const id = el.getAttribute('data-chapter')
      if (!CHAPTER_IDS.includes(id)) return

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            story.chapters[id] = self.progress
            refreshFilm()
          },
          onRefresh: (self) => {
            story.chapters[id] = self.progress
          },
        }),
      )

      // Precise window for the nav colour: while this chapter is under the bar.
      const chapter = CHAPTERS.find((c) => c.id === id)
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 72px',
          end: 'bottom 72px',
          onToggle: (self) => {
            if (self.isActive) setTone(chapter.tone)
          },
          onEnter: () => setTone(chapter.tone),
          onEnterBack: () => setTone(chapter.tone),
        }),
      )
    })

    refreshFilm()

    // Pointer, normalised. Read by the scene for the "stationary" response.
    const onPointer = (event) => {
      story.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      story.pointer.y = 1 - (event.clientY / window.innerHeight) * 2
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    // Stop all WebGL work when the tab is hidden or the landing is scrolled past.
    const onVisibility = () => {
      story.awake = document.hidden ? 0 : 1
      document.documentElement.classList.toggle('setu-story-off', document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onResize = () => {
      story.viewport.w = window.innerWidth
      story.viewport.h = window.innerHeight
      story.compact = isCompact()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    // Late-loading fonts and images change the document height.
    let cancelled = false
    const settle = async () => {
      try {
        await document.fonts?.ready
      } catch {
        /* fonts API is optional */
      }
      await Promise.all(
        [...document.images]
          .filter((img) => !img.complete)
          .map((img) => new Promise((res) => {
            img.addEventListener('load', res, { once: true })
            img.addEventListener('error', res, { once: true })
          })),
      )
      if (!cancelled) ScrollTrigger.refresh()
    }
    settle()
    const late = window.setTimeout(() => !cancelled && ScrollTrigger.refresh(), 1200)

    return () => {
      cancelled = true
      window.clearTimeout(late)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      document.documentElement.classList.remove('setu-story-off')
      triggers.forEach((t) => t.kill())
      lenis.off('scroll', onLenisScroll)
      gsap.ticker.remove(raf)
      lenis.destroy()
      story.chapters = Object.fromEntries(CHAPTER_IDS.map((id) => [id, 0]))
      story.progress = 0
      story.film = 0
      story.awake = 1
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [enabled])

  return { tone }
}

/**
 * Scoped GSAP context for one chapter. When motion is disabled the build
 * function never runs, so nothing is ever set to an invisible start state and
 * the chapter simply renders as a static composition.
 */
export function useScene(ref, build, enabled) {
  const buildRef = useRef(build)
  buildRef.current = build

  useEffect(() => {
    if (!enabled || !ref.current) return undefined
    const ctx = gsap.context((self) => buildRef.current(self.selector, self), ref)
    return () => ctx.revert()
  }, [enabled, ref])
}
