import { Info } from 'lucide-react'
import { CodePlate, StatusPill } from './StatusPill'
import { carrier } from '../data/demo'

const FACTS = [
  { label: 'Pickup', value: carrier.pickup, note: 'from your door' },
  { label: 'Desk by', value: carrier.delivery, note: 'Kamala Mills' },
  { label: 'Dabbas', value: carrier.dabbas, note: 'on this run' },
  { label: 'On route', value: `${carrier.years} yrs`, note: 'Kandivali group' },
]

/**
 * Human, not a driver profile. No rating, no vehicle, and deliberately no
 * photograph — Santosh is a real carrier on this line, so the SETU mascot
 * has no business standing in for him here.
 */
export default function DabbawalaCard({ className = '' }) {
  return (
    <section
      className={`relative overflow-hidden rounded-panel border border-line bg-surface grain ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <CodePlate>Kandivali group</CodePlate>
        <StatusPill tone="covered" dot>
          On this route
        </StatusPill>
      </div>

      <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-tile bg-ink font-display text-[26px] font-semibold leading-none text-paper"
          >
            {carrier.initials}
          </span>
          <div className="min-w-0">
            <h2 className="display text-[36px] leading-none text-ink sm:text-[42px]">Santosh</h2>
            <p className="mt-2 text-[13.5px] text-quiet">
              {carrier.group} · {carrier.line}
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
          {carrier.note} Your dabba travels in crate{' '}
          <span className="font-mono text-[13.5px] font-bold text-ink">{carrier.code}</span> with the
          rest of the Kandivali load.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-5 sm:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="eyebrow">{fact.label}</dt>
              <dd className="numeric mt-2 text-[27px] leading-none text-ink">{fact.value}</dd>
              <dd className="mt-1.5 text-[12.5px] leading-snug text-quiet">{fact.note}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-[13px] leading-snug text-ink-3">
          <Info size={15} strokeWidth={2.2} aria-hidden="true" className="mt-0.5 shrink-0" />
          No app, no training, nothing new for Santosh. His group already runs this line — SETU only
          tells him which days you are in.
        </p>
      </div>
    </section>
  )
}
