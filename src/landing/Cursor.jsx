import { useEffect, useRef } from 'react'

/**
 * An understated custom cursor: a small orange point that trails the pointer and
 * grows over anything marked `data-cursor="expand"`, optionally showing a label
 * from `data-cursor-label`.
 *
 * The native cursor is deliberately left in place — this is an accent, not a
 * replacement, so usability never depends on the effect working. It is only
 * mounted on hover-capable, fine-pointer devices and never under reduced motion.
 */
export default function Cursor({ enabled }) {
  const dot = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    let scale = 0.34
    let targetScale = 0.34
    let label = ''
    let raf

    const onMove = (event) => {
      target.x = event.clientX
      target.y = event.clientY
      const holder = event.target?.closest?.('[data-cursor]')
      targetScale = holder ? 1 : 0.34
      const next = holder?.getAttribute('data-cursor-label') ?? ''
      if (next !== label) {
        label = next
        if (labelRef.current) labelRef.current.textContent = label
      }
    }

    const onLeave = () => {
      targetScale = 0
    }

    const tick = () => {
      current.x += (target.x - current.x) * 0.18
      current.y += (target.y - current.y) * 0.18
      scale += (targetScale - scale) * 0.14
      const el = dot.current
      if (el) {
        el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${scale})`
        el.style.opacity = scale < 0.05 ? '0' : '1'
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[85] hidden opacity-0 will-change-transform md:block"
    >
      <span className="relative flex size-[38px] items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-orange/70" />
        <span className="size-[5px] rounded-full bg-orange" />
        <span
          ref={labelRef}
          className="absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-orange"
        />
      </span>
    </div>
  )
}
