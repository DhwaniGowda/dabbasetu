/*
  Squared-off transit tags rather than soft SaaS pills.
  `covered` is the only tone that uses green, because green means exactly
  one thing in this product: covered, confirmed, delivered.
*/
const TONES = {
  covered: { ring: 'border-green/40 bg-green-tint text-green-deep', dot: 'bg-green' },
  active: { ring: 'border-orange/45 bg-orange-tint text-orange-ink', dot: 'bg-orange' },
  ink: { ring: 'border-ink bg-ink text-paper', dot: 'bg-orange' },
  quiet: { ring: 'border-line bg-paper-2 text-quiet', dot: 'bg-line-2' },
}

/** Small uppercase state tag. Route status, plan status, scan state. */
export function StatusPill({ children, tone = 'quiet', dot = false, icon: Icon, className = '' }) {
  const t = TONES[tone] ?? TONES.quiet
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-plate border px-2 py-[5px] font-mono text-[10px] font-bold uppercase leading-none tracking-[0.09em] ${t.ring} ${className}`}
    >
      {dot && <span className={`size-[5px] shrink-0 rounded-full ${t.dot}`} aria-hidden="true" />}
      {Icon && <Icon aria-hidden="true" size={12} strokeWidth={2.6} />}
      {children}
    </span>
  )
}

/**
 * The dabbawala code plate. Stamped typography — the deck's mono codes
 * (`3-BO-12 · LP`) are a signature part of SETU's graphic language.
 */
export function CodePlate({ children, tone = 'ink', className = '' }) {
  const tones = {
    ink: 'bg-ink text-paper',
    outline: 'border border-line-2 bg-surface text-quiet',
    green: 'bg-green text-paper',
    orange: 'bg-orange text-ink',
  }
  return (
    <span
      className={`inline-flex items-center rounded-plate px-2 py-[5px] font-mono text-[10.5px] font-bold uppercase leading-none tracking-[0.1em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export default StatusPill
