import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

/* ------------------------------------------------------------------
   SETU route line. The signature component of the product.

   charcoal rail · orange = where the dabba is now
   green = covered / confirmed · stone = still to come
------------------------------------------------------------------ */

const SEGMENT = {
  done: 'bg-green',
  current: 'bg-orange',
  upcoming: 'bg-ink/25',
  paused: 'bg-ink/25',
}

const segTone = (state) => SEGMENT[state] ?? SEGMENT.upcoming

/** One station node: done / current / upcoming / paused. */
export function Node({ state = 'upcoming', size = 18, surface = 'light' }) {
  const reduce = useReducedMotion()
  const dark = surface === 'dark'

  if (state === 'done') {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-full bg-green text-paper"
        style={{ width: size, height: size }}
      >
        <Check size={Math.round(size * 0.6)} strokeWidth={3.5} aria-hidden="true" />
      </span>
    )
  }

  if (state === 'current') {
    return (
      <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-orange/40"
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span
          className="relative grid place-items-center rounded-full bg-orange"
          style={{ width: size, height: size }}
        >
          <span
            aria-hidden="true"
            className="rounded-full"
            style={{
              width: Math.max(3, size * 0.3),
              height: Math.max(3, size * 0.3),
              background: dark ? 'var(--color-ink)' : 'var(--color-paper)',
            }}
          />
        </span>
      </span>
    )
  }

  if (state === 'paused') {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-full border-2 border-dashed"
        style={{
          width: size - 1,
          height: size - 1,
          borderColor: dark ? 'rgba(250,247,239,0.4)' : 'var(--color-line-2)',
        }}
      />
    )
  }

  /* upcoming — the hollow railway circle from the deck */
  return (
    <span
      className="block shrink-0 rounded-full"
      style={{
        width: size - 1,
        height: size - 1,
        background: dark ? 'transparent' : 'var(--color-paper)',
        border: `2px solid ${dark ? 'rgba(250,247,239,0.42)' : 'var(--color-ink)'}`,
      }}
    />
  )
}

/**
 * Decorative rail: ────────○────────●────────○────────
 * The pure deck motif, for headers, separators and hero graphics.
 */
export function RailStrip({
  states = ['upcoming', 'current', 'upcoming'],
  surface = 'light',
  className = '',
  dotSize = 10,
}) {
  const dark = surface === 'dark'
  const rail = dark ? 'rgba(250,247,239,0.3)' : 'var(--color-ink)'
  const hollow = dark ? 'transparent' : 'var(--color-paper)'
  const ring = dark ? 'rgba(250,247,239,0.75)' : 'var(--color-ink)'

  return (
    <div
      aria-hidden="true"
      className={`relative flex w-full items-center justify-between ${className}`}
    >
      <span
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{ background: rail }}
      />
      {states.map((state, index) => (
        <span
          key={index}
          className="relative grid shrink-0 place-items-center rounded-full"
          style={{ width: dotSize, height: dotSize }}
        >
          {state === 'current' ? (
            <span className="size-full rounded-full bg-orange" />
          ) : state === 'done' ? (
            <span className="size-full rounded-full bg-green" />
          ) : (
            <span
              className="size-full rounded-full"
              style={{ background: hollow, border: `2px solid ${ring}` }}
            />
          )}
        </span>
      ))}
    </div>
  )
}

/**
 * The working route line. Vertical by default (a timetable), horizontal on
 * wide boards. `stops` carry { time, code, label, note, state }.
 */
export default function RouteLine({
  stops = [],
  orientation = 'vertical',
  renderStop,
  showCodes = true,
  surface = 'light',
  className = '',
}) {
  if (orientation === 'horizontal') {
    const n = stops.length
    const dark = surface === 'dark'
    const seg = (state) => {
      if (state === 'done') return 'bg-green'
      if (state === 'current') return 'bg-orange'
      return dark ? 'bg-paper/25' : 'bg-ink/25'
    }

    return (
      <div className={`flex w-full ${className}`}>
        {stops.map((stop, i) => (
          <div key={stop.id ?? i} className="relative flex-1">
            <div
              className={`numeric h-5 text-center text-[15px] leading-5 sm:text-[16px] ${
                dark ? 'text-paper/70' : 'text-ink-3'
              }`}
            >
              {stop.time}
            </div>

            <div className="relative h-[20px]">
              <span
                aria-hidden="true"
                className={`absolute top-[9px] h-[2px] ${
                  i === 0 ? 'left-1/2 right-0' : i === n - 1 ? 'left-0 right-1/2' : 'inset-x-0'
                } ${i === 0 ? (dark ? 'bg-paper/25' : 'bg-ink/25') : seg(stop.state)}`}
              />
              <span className="absolute left-1/2 top-0 -translate-x-1/2">
                <Node state={stop.state} size={19} surface={surface} />
              </span>
            </div>

            {showCodes && (
              <div
                className={`mt-3 px-1 text-center font-mono text-[9.5px] font-bold uppercase leading-[1.4] tracking-[0.06em] sm:text-[10.5px] ${
                  stop.state === 'current'
                    ? dark
                      ? 'text-orange'
                      : 'text-orange-ink'
                    : dark
                      ? 'text-paper/55'
                      : 'text-ink-3'
                }`}
              >
                {stop.code}
              </div>
            )}
            {stop.note && (
              <div
                className={`mt-1 text-center text-[11.5px] leading-tight ${
                  dark ? 'text-paper/45' : 'text-quiet'
                }`}
              >
                {stop.note}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {stops.map((stop, i) => {
        const first = i === 0
        const last = i === stops.length - 1
        const prev = stops[i - 1]

        return (
          <div
            key={stop.id ?? i}
            className="grid grid-cols-[3.5rem_18px_minmax(0,1fr)] gap-x-2.5 sm:grid-cols-[4.25rem_18px_minmax(0,1fr)] sm:gap-x-4"
          >
            <div
              className={`numeric pt-[5px] text-right text-[13px] leading-none sm:text-[14.5px] ${
                stop.state === 'current' ? 'text-orange-ink' : 'text-quiet'
              }`}
            >
              {stop.time}
            </div>

            <div className="relative">
              {!first && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-0 h-[11px] w-[2px] -translate-x-1/2 ${segTone(
                    prev?.state,
                  )}`}
                />
              )}
              <span className="absolute left-1/2 top-[11px] -translate-x-1/2">
                <Node state={stop.state} size={18} surface={surface} />
              </span>
              {!last && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-1/2 top-[30px] w-[2px] -translate-x-1/2 ${segTone(
                    stop.state,
                  )}`}
                />
              )}
            </div>

            <div className={last ? '' : 'pb-7'}>
              {showCodes && (
                <span
                  className={`block font-mono text-[10.5px] font-bold uppercase leading-[1.35] tracking-[0.08em] ${
                    stop.state === 'current' ? 'text-orange-ink' : 'text-quiet'
                  }`}
                >
                  {stop.code}
                </span>
              )}

              {stop.label && (
                <p
                  className={`mt-1 text-[15.5px] leading-snug ${
                    stop.state === 'upcoming' || stop.state === 'paused'
                      ? 'text-ink-3'
                      : 'font-semibold text-ink'
                  }`}
                >
                  {stop.label}
                </p>
              )}

              {stop.note && (
                <p className="mt-0.5 text-[13px] leading-snug text-quiet">{stop.note}</p>
              )}

              {renderStop?.(stop, i)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
