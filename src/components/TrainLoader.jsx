import { motion, useReducedMotion } from 'framer-motion'

/**
 * A train running along a line while we "check" the route.
 * Deliberately abstract: a carriage, a window band, a track.
 */
export default function TrainLoader({ label = 'Checking Western Line coverage', className = '' }) {
  const reduce = useReducedMotion()

  return (
    <div className={`rounded-tile border border-line bg-surface px-4 py-5 ${className}`}>
      <div className="relative h-10">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-line"
        />
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-orange/70"
            initial={{ left: '0%', width: '0%' }}
            animate={{ left: '0%', width: '100%' }}
            transition={{ duration: 0.95, ease: 'easeInOut' }}
          />
        )}
        <motion.div
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2"
          initial={reduce ? { left: '48%' } : { left: '4%' }}
          animate={reduce ? { left: '48%' } : { left: '92%' }}
          transition={{ duration: 0.95, ease: 'easeInOut' }}
        >
          <svg width="40" height="22" viewBox="0 0 40 22" fill="none" className="drop-shadow-sm">
            <rect x="1" y="6" width="38" height="13" rx="4" fill="var(--color-ink)" />
            <rect x="6" y="9.5" width="8" height="6" rx="1.5" fill="var(--color-paper)" />
            <rect x="18" y="9.5" width="8" height="6" rx="1.5" fill="var(--color-paper)" />
            <rect x="30" y="9.5" width="5" height="6" rx="1.5" fill="var(--color-paper)" />
            <rect x="8" y="1" width="9" height="3" rx="1.5" fill="var(--color-orange)" />
          </svg>
        </motion.div>
      </div>

      <p className="mt-4 font-mono text-[10.5px] font-bold uppercase leading-relaxed tracking-[0.08em] text-ink-3">
        {label}
      </p>

      <div className="mt-3.5 space-y-2">
        {[88, 64, 74].map((width, index) => (
          <span
            key={width}
            className="block h-2 animate-pulse rounded-full bg-paper-3"
            style={{ width: `${width}%`, animationDelay: `${index * 110}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
