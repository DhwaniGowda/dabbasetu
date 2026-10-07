/** Receipt-style rows with dotted leaders. Used for plans and profile. */
export default function Ledger({ children, className = '', divider = true }) {
  return (
    <dl className={`${divider ? 'divide-y divide-line' : ''} ${className}`}>{children}</dl>
  )
}

export function LedgerRow({ label, note, value, strong = false }) {
  return (
    <div className="flex items-end gap-3 py-4">
      <div className="min-w-0">
        <dt
          className={`text-[15px] leading-snug ${
            strong ? 'font-semibold text-ink' : 'font-medium text-ink-2'
          }`}
        >
          {label}
        </dt>
        {note && (
          <dd className="mt-0.5 text-[12.5px] leading-snug text-quiet">{note}</dd>
        )}
      </div>
      <span
        aria-hidden="true"
        className="mb-[7px] h-[1px] min-w-6 flex-1 border-b border-dashed border-line-2"
      />
      <dd
        className={`numeric shrink-0 text-[19px] leading-none ${
          strong ? 'text-ink' : 'text-ink-2'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
