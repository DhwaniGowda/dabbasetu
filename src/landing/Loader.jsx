import { useEffect, useRef, useState } from 'react'
import { CHAPTERS } from './story'

/**
 * The SETU loader: a railway line drawing itself from one end of the screen to
 * the other, station circles arriving as it goes. No spinner.
 *
 * It is gated on real work (the WebGL module and the webfonts) with a short
 * floor so it cannot flash, and a hard ceiling so it can never become an
 * artificial delay. The ceiling is also what guarantees termination: if WebGL
 * is unavailable or slow, the film still starts — just without the tiffin.
 */
const FLOOR_MS = 620
const CEILING_MS = 2400

export default function Loader({ ready, onDone }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const value = useRef(0)
  const finished = useRef(false)

  useEffect(() => {
    const start = performance.now()
    let raf

    const tick = (now) => {
      const elapsed = now - start
      const overCeiling = elapsed > CEILING_MS
      const arriving = ready || overCeiling

      // Chase the real readiness, but always arrive either way.
      const target = arriving ? 1 : Math.min(0.92, elapsed / CEILING_MS)
      value.current += (target - value.current) * (overCeiling ? 0.26 : ready ? 0.18 : 0.05)
      const next = value.current > 0.997 ? 1 : value.current
      setProgress(next)

      const floorPassed = ready ? elapsed > FLOOR_MS : overCeiling
      if (!finished.current && floorPassed && next >= 1) {
        finished.current = true
        setLeaving(true)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  useEffect(() => {
    if (!leaving) return undefined
    const t = window.setTimeout(() => onDone?.(), 720)
    return () => window.clearTimeout(t)
  }, [leaving, onDone])

  const stations = CHAPTERS.length

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[80] flex flex-col justify-center bg-ink px-6 transition-opacity duration-700 sm:px-12 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="relative flex items-center">
          {/* The line draws itself. */}
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper/18" />
          <span
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-paper"
            style={{ width: `${progress * 100}%` }}
          />
          {Array.from({ length: stations }, (_, i) => {
            const at = (i / (stations - 1)) * 100
            const passed = progress * 100 >= at - 0.5
            const edge = i === 0 || i === stations - 1
            return (
              <span
                key={i}
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: `${at}%`,
                  marginLeft: i === 0 ? 0 : edge ? -5.5 : -3.5,
                }}
              >
                <span
                  className={`block rounded-full transition-colors duration-500 ${
                    passed ? 'bg-orange' : 'bg-transparent ring-1 ring-paper/30'
                  }`}
                  style={{ width: edge ? 11 : 7, height: edge ? 11 : 7 }}
                />
              </span>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-orange">
              SETU
            </p>
            <p className="display mt-3 text-[clamp(2rem,5vw,3.4rem)] leading-none text-paper">
              Loading the route
            </p>
          </div>
          <p className="numeric text-[clamp(1.6rem,3.4vw,2.4rem)] leading-none text-paper/70">
            {String(Math.round(progress * 100)).padStart(3, '0')}
            <span className="text-paper/35">%</span>
          </p>
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">
          Mumbai → lunch → connection
        </p>
      </div>
    </div>
  )
}
