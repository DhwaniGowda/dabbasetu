import { QrCode } from 'lucide-react'
import RouteLine from './RouteLine'

const NOTE = {
  local:
    'The crate was loaded onto the 10:14 local. The next confirmation is when it is scanned off at Lower Parel.',
  'lower-parel':
    'The crate is off the train. Next stop is your desk — 4th floor reception, handed over by 12:30.',
}

/** Today's journey. The current stop expands into a confirmed-scan panel. */
export default function JourneyTimeline({ stops = [], className = '' }) {
  return (
    <RouteLine
      stops={stops}
      className={className}
      renderStop={(stop) =>
        stop.state === 'current' ? (
          <div className="mt-4 rounded-tile border border-orange/40 bg-orange-tint p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-orange text-ink">
                <QrCode size={15} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-snug text-ink">
                  Crate K4-07 scanned at {stop.time}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-ink-3">
                  {NOTE[stop.id] ?? 'Scanned by Santosh and logged against your route.'}
                </p>
              </div>
            </div>
          </div>
        ) : null
      }
    />
  )
}
