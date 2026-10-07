import { Check } from 'lucide-react'
import { weekdays } from '../data/demo'

/**
 * Weekday stamps. Orange is the action colour, so a selected day is
 * orange — it is the one thing on this screen the customer changes.
 */
export default function DaySelector({ days = [], onToggle, className = '' }) {
  return (
    <div className={`grid grid-cols-5 gap-2 sm:gap-2.5 ${className}`}>
      {weekdays.map((day) => {
        const on = days.includes(day.id)
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onToggle?.(day.id)}
            aria-pressed={on}
            aria-label={`${day.long} ${day.date} September — ${on ? 'office day' : 'not an office day'}`}
            className={`group flex flex-col items-center gap-1.5 rounded-tile border px-1 pb-2.5 pt-3 transition-[background-color,border-color,transform,color] duration-150 active:scale-[0.97] motion-reduce:active:scale-100 ${
              on
                ? 'border-orange bg-orange text-ink'
                : 'border-line bg-surface text-ink-3 hover:border-line-2 hover:bg-paper-2'
            }`}
          >
            <span
              className={`font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] ${
                on ? 'text-ink/70' : 'text-quiet'
              }`}
            >
              {day.short}
            </span>
            <span className="numeric text-[24px] leading-none">{day.date}</span>
            <span
              className={`mt-0.5 grid size-[16px] place-items-center rounded-full border transition-colors ${
                on ? 'border-ink bg-ink text-paper' : 'border-line-2'
              }`}
            >
              {on && <Check size={10} strokeWidth={3.5} aria-hidden="true" />}
            </span>
          </button>
        )
      })}
    </div>
  )
}
