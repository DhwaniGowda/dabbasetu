import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import DaySelector from '../components/DaySelector'
import Reveal from '../components/Reveal'
import { StatusPill } from '../components/StatusPill'
import { PageHead, Rule } from '../components/PageParts'
import { useToast } from '../components/Toast'
import { TODAY, useDemo } from '../state/DemoState'
import { weekdays } from '../data/demo'
import { inr, perLunch } from '../lib/format'
import { formatDayList } from '../lib/dayLabels'

/** Tuesday is today, so the pause list starts there. */
const THIS_WEEK = [
  { id: 'tue', day: 'Today', label: 'TUE 24 SEP', note: 'On the 10:14 local', locked: true },
  { id: 'wed', day: 'Tomorrow', label: 'WED 25 SEP', note: null },
  { id: 'thu', day: 'Thursday', label: 'THU 26 SEP', note: null },
]

export default function Schedule() {
  const toast = useToast()
  const { days, setDays, toggleDay, togglePause, isPaused } = useDemo()
  const [saved, setSaved] = useState(days)

  const dirty = useMemo(
    () => [...days].sort().join() !== [...saved].sort().join(),
    [days, saved],
  )
  const lunch = perLunch(days.length)
  const states = weekdays.map((day) => (days.includes(day.id) ? 'done' : 'upcoming'))

  return (
    <AppShell
      nav
      aside={
        <>
          <section className="rounded-panel border border-line bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow">This month</span>
              {dirty ? (
                <StatusPill tone="active" dot>
                  Unsaved
                </StatusPill>
              ) : (
                <StatusPill tone="covered" dot>
                  Saved
                </StatusPill>
              )}
            </div>
            <p className="numeric mt-4 text-[36px] leading-none text-ink">{inr(1800 + 149)}</p>
            <p className="mt-2.5 text-[13px] leading-snug text-quiet">
              {formatDayList(days)} · {lunch ? `${lunch.lunches} lunches` : 'no days selected'}
            </p>
            <p className="mt-4 border-t border-line pt-4 text-[12.5px] leading-snug text-quiet">
              The monthly fee does not change when you pause a day.
            </p>
          </section>
        </>
      }
    >
      <PageHead
        eyebrow="Schedule"
        title={
          <>
            Your office days<span className="text-orange-ink">.</span>
          </>
        }
        lead="Change your days whenever your week changes. Pausing a single day keeps everything else exactly as it is."
      />

      <Reveal className="mt-9 sm:mt-11 sm:max-w-[520px]">
        <DaySelector days={days} onToggle={toggleDay} />
        <p className="mt-5 flex items-start gap-2.5 text-[13px] text-quiet">
          {days.length === 0 ? (
            <>
              <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-line-2" />
              Santosh needs at least one day — pick when you are at your desk.
            </>
          ) : (
            <>
              <Check
                size={14}
                strokeWidth={2.8}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-green"
              />
              {`${formatDayList(days)} · ${lunch?.lunches} lunches this month.`}
            </>
          )}
        </p>

        <div className="mt-7 flex gap-3">
          <Button
            size="md"
            disabled={!dirty}
            onClick={() => {
              setSaved(days)
              toast('Schedule saved. Santosh has your updated days.')
            }}
          >
            Save changes
          </Button>
          <Button tone="ghost" size="md" disabled={!dirty} onClick={() => setDays(saved)}>
            Reset
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.06} className="mt-12 sm:max-w-[620px]">
        <Rule label="Pause a single day" />

        <ul className="mt-3">
          {THIS_WEEK.map((row) => {
            const isOfficeDay = days.includes(row.id)
            const paused = isPaused(row.id)

            return (
              <li
                key={row.id}
                className="flex items-center justify-between gap-4 border-b border-line py-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[15px] font-semibold text-ink">{row.day}</span>
                    <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-faint">
                      {row.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-snug text-quiet">
                    {row.locked
                      ? row.note
                      : !isOfficeDay
                        ? 'Not an office day'
                        : paused
                          ? 'Paused — no pickup'
                          : 'Dabba coming that morning'}
                  </p>
                </div>

                {row.locked ? (
                  <StatusPill tone="active" dot>
                    On the way
                  </StatusPill>
                ) : !isOfficeDay ? (
                  <span className="text-[13px] text-faint">—</span>
                ) : (
                  <Button
                    tone={paused ? 'secondary' : 'quiet'}
                    size="sm"
                    onClick={() => {
                      togglePause(row.id)
                      toast(
                        paused
                          ? `${row.day}'s pickup is back on.`
                          : `${row.day} paused. Santosh has been told.`,
                        { tone: 'pause' },
                      )
                    }}
                  >
                    {paused ? 'Resume' : 'Pause'}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>

        <p className="mt-5 text-[13px] leading-snug text-quiet">
          Pauses close at 7 am on the day itself. After that Santosh has already left with the crate.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 sm:max-w-[620px]">
        <p className="font-mono text-[10.5px] leading-relaxed tracking-[0.02em] text-faint">
          DEMO NOTE · TODAY IS {TODAY.label} · PAUSING TUESDAY IS DISABLED BECAUSE YOUR DABBA IS
          ALREADY ON THE TRAIN.
        </p>
      </Reveal>
    </AppShell>
  )
}
