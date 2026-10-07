import { RailStrip } from './RouteLine'

/** Small shared pieces of page furniture. */

/**
 * Tiny page-like number, borrowed from the deck's slide corners.
 * Used very sparingly — only on the moments that carry the brand.
 */
export function SectionNumber({ children, tone = 'ink', className = '' }) {
  return (
    <span
      className={`font-mono text-[10px] font-bold uppercase leading-none tracking-[0.16em] ${
        tone === 'paper' ? 'text-paper/40' : 'text-faint'
      } ${className}`}
    >
      {children}
    </span>
  )
}

export function PageHead({ eyebrow, title, lead, className = '', wide = false }) {
  return (
    <header className={className}>
      {eyebrow && <span className="eyebrow block">{eyebrow}</span>}
      <h1
        className={`display mt-3 text-[clamp(2.6rem,9vw,4.25rem)] text-ink ${
          wide ? '' : 'max-w-[18ch]'
        }`}
      >
        {title}
      </h1>
      {lead && (
        <p className="mt-4 max-w-[54ch] text-[16.5px] leading-relaxed text-ink-3">{lead}</p>
      )}
    </header>
  )
}

/** Read-only board: routes, ledgers, receipts. */
export function Board({ children, tone = 'paper', className = '' }) {
  const tones = {
    paper: 'border-line bg-surface',
    deep: 'border-line-2 bg-paper-2',
    ink: 'border-ink bg-ink text-paper grain grain-dark',
  }
  const dark = tone === 'ink'
  return (
    <section
      {...(dark ? { 'data-surface': 'ink' } : {})}
      className={`relative overflow-hidden rounded-panel border ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  )
}

export function Rule({ label, right, className = '', tone = 'ink' }) {
  const line = tone === 'paper' ? 'bg-paper/20' : 'bg-line'
  if (!label) return <div className={`h-px w-full ${line} ${className}`} aria-hidden="true" />
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`eyebrow shrink-0 ${tone === 'paper' ? 'text-paper/55' : ''}`}>
        {label}
      </span>
      <span className={`h-px flex-1 ${line}`} aria-hidden="true" />
      {right}
    </div>
  )
}

/**
 * The route line used as page furniture — the deck's rail motif closing a
 * section. Use it where it adds meaning, not on every heading.
 */
export function RailRule({
  label,
  states = ['done', 'current', 'upcoming', 'upcoming'],
  tone = 'ink',
  right,
  className = '',
}) {
  const dark = tone === 'paper'
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <span className={`eyebrow ${dark ? 'text-paper/55' : ''}`}>{label}</span>
        {right}
      </div>
      <RailStrip className="mt-3.5" states={states} surface={dark ? 'dark' : 'light'} />
    </div>
  )
}

/** Mobile sticky action bar; a normal inline row on desktop. */
export function StickyCTA({ children, note, className = '' }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md lg:static lg:z-auto lg:mt-10 lg:border-0 lg:bg-transparent lg:backdrop-blur-none ${className}`}
    >
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-[calc(env(safe-area-inset-bottom,0px)+14px)] pt-3.5 sm:px-7 lg:p-0 lg:[&>*]:w-auto">
        {children}
        {note && (
          <p className="mt-2.5 text-center text-[12px] leading-snug text-quiet lg:mt-3.5 lg:text-left">
            {note}
          </p>
        )}
      </div>
    </div>
  )
}
