import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, MapPin, Search } from 'lucide-react'

const splitValue = (value) => {
  const [title, detail] = value.split(' · ')
  return { title: title ?? value, detail: detail ?? '' }
}

/**
 * Large premium location field. Typing filters a mock list — no network,
 * no autocomplete API, just enough to feel alive.
 */
export default function LocationField({
  label,
  icon: Icon,
  value,
  onChange,
  suggestions = [],
  hint,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const { title, detail } = useMemo(() => splitValue(value), [value])

  useEffect(() => {
    if (!open) {
      setQuery('')
      return undefined
    }
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    const focus = window.setTimeout(() => inputRef.current?.focus(), 60)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(focus)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return suggestions
    return suggestions.filter((s) => `${s.title} ${s.detail}`.toLowerCase().includes(q))
  }, [query, suggestions])

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">{label}</span>
        {hint && <span className="text-[11.5px] text-faint">{hint}</span>}
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${value}. Change location`}
        className={`mt-2 flex min-h-[68px] w-full items-center gap-3 rounded-tile border bg-surface px-3.5 py-3 text-left transition-colors duration-150 ${
          open ? 'border-ink' : 'border-line hover:border-line-2'
        }`}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-paper-2 text-ink-2">
          {Icon && <Icon size={17} strokeWidth={2} aria-hidden="true" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15.5px] font-semibold leading-snug text-ink">
            {title}
          </span>
          {detail && (
            <span className="block truncate text-[13px] leading-snug text-quiet">{detail}</span>
          )}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-quiet transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={`${label} suggestions`}
          className="absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-panel border border-line bg-surface shadow-lift"
        >
          <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5">
            <Search size={15} strokeWidth={2} aria-hidden="true" className="text-quiet" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Mumbai areas"
              className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
              aria-label="Search areas"
            />
          </div>

          <ul className="max-h-[264px] overflow-y-auto py-1">
            {filtered.map((item) => {
              const selected = item.title === title
              return (
                <li key={`${item.title}-${item.detail}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(`${item.title} · ${item.detail}`)
                      setOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-paper-2"
                  >
                    <MapPin
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                      className={selected ? 'text-orange' : 'text-faint'}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold text-ink">
                        {item.title}
                      </span>
                      <span className="block truncate text-[12.5px] text-quiet">
                        {item.detail}
                      </span>
                    </span>
                    <span className="font-mono shrink-0 text-[10px] font-bold tracking-[0.06em] text-faint">
                      {item.meta}
                    </span>
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="px-3.5 py-6 text-center text-[13.5px] text-quiet">
                No mock areas match “{query}”.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
