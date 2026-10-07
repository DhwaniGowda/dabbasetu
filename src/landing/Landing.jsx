import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, useStory } from './useStory'
import { story } from './story'
import './landing.css'
import Loader from './Loader'
import Nav from './Nav'
import Cursor from './Cursor'
import StaticStory from './StaticStory'
import SceneBoundary from './webgl/SceneBoundary'
import Ch0Prelude from './chapters/Ch0Prelude'
import Ch1Tiffin from './chapters/Ch1Tiffin'
import Ch2System from './chapters/Ch2System'
import Ch3Friction from './chapters/Ch3Friction'
import Ch4Bridge from './chapters/Ch4Bridge'
import Ch5Product from './chapters/Ch5Product'
import Ch6Track from './chapters/Ch6Track'
import Ch7Delivery from './chapters/Ch7Delivery'

/* The whole WebGL bundle arrives after the first paint, behind the loader. */
const Scene = lazy(() => import('./webgl/Scene'))

const isCompact = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 767px), (pointer: coarse)').matches

/**
 * SETU — the landing film.
 *
 * One persistent WebGL canvas sits between two DOM layers for the entire page,
 * so the tiffin is a single object travelling through one continuous world
 * rather than one object per section. Lenis owns the wheel, ScrollTrigger owns
 * the choreography, and nothing about scrolling re-renders React.
 *
 * Under reduced motion the film is replaced by a static composition of the same
 * eight beats and no WebGL at all.
 */
export default function Landing() {
  const decided = useRef(null)
  if (decided.current === null) decided.current = prefersReducedMotion()
  const reduce = decided.current
  const enabled = !reduce

  const { tone } = useStory({ enabled })
  const [sceneReady, setSceneReady] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const [loading, setLoading] = useState(enabled)
  const compact = useRef(isCompact()).current

  // Wait for the faces that carry the film, not just for "some" font.
  useEffect(() => {
    let alive = true
    const done = () => alive && setFontsReady(true)
    const fonts = typeof document !== 'undefined' && document.fonts
    if (!fonts) {
      done()
      return undefined
    }
    Promise.all([
      fonts.load('400 4rem "Big Shoulders Display"', 'SETU MUMBAI 07:58 SCANS').catch(() => {}),
      fonts.load('700 1rem "JetBrains Mono"', 'WESTERN LINE').catch(() => {}),
      fonts.ready,
    ])
      .then(done)
      .catch(done)
    return () => {
      alive = false
    }
  }, [])

  // Scroll stays locked while the loader is up, and is released exactly once.
  useEffect(() => {
    story.locked = loading
    return () => {
      story.locked = true
    }
  }, [loading])

  return (
    <div className="film-reset film-grain relative min-h-dvh bg-ink">
      <span id="setu-top" />
      <Cursor enabled={enabled} />

      {enabled ? (
        <div className="story-canvas" aria-hidden="true">
          <SceneBoundary onFail={() => setSceneReady(true)}>
            <Suspense fallback={null}>
              <Scene compact={compact} onReady={() => setSceneReady(true)} />
            </Suspense>
          </SceneBoundary>
        </div>
      ) : null}

      <Nav tone={enabled ? tone : 'ink'} enabled={enabled} />

      {enabled ? (
        <main>
          <Ch0Prelude enabled />
          <Ch1Tiffin enabled />
          <Ch2System enabled />
          <Ch3Friction enabled />
          <Ch4Bridge enabled />
          <Ch5Product enabled />
          <Ch6Track enabled />
          <Ch7Delivery enabled />
        </main>
      ) : (
        <StaticStory />
      )}

      {loading ? (
        <Loader ready={fontsReady && sceneReady} onDone={() => setLoading(false)} />
      ) : null}
    </div>
  )
}
