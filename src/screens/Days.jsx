import { ArrowRight, Pause } from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import DaySelector from '../components/DaySelector'
import Reveal from '../components/Reveal'
import { StatusPill } from '../components/StatusPill'
import { PageHead, RailRule, StickyCTA } from '../components/PageParts'
import { FlowIndexCard, TripCard } from '../components/AsideCards'
import { useDemo } from '../state/DemoState'
import { weekdays } from '../data/demo'
import { inr, perLunch } from '../lib/format'
import { weekSummary } from '../lib/dayLabels'

export default function Days() {
  const { days, setDays, toggleDay, setAllDays } = useDemo()
  const lunch = perLunch(days.length)
  const allSelected = days.length === weekdays.length
  const none = days.length === 0

  const states = weekdays.map((day) => (days.includes(day.id) ? 'done' : 'upcoming'))

  return (
    <AppShell
      nav={false}
      back={{ to: '/match', label: 'Carrier' }}
      step={[3, 5]}
      aside={
        <>
          <TripCard
            days={days}
            statusPill={
              <StatusPill tone="covered" dot>
                Route covered
              </StatusPill>
            }
          />
          <FlowIndexCard activeTo="/days" />
        </>
      }
    >
      <PageHead
        eyebrow="Step 03 · Office days"
        title={
          <>
            Which days are you in<span className="text-orange-ink">?</span>
          </>
        }
        lead="Only pay for the service you actually use. The dabba comes on the days you are at your desk."
      />

      <div className="mt-9 sm:mt-11 sm:max-w-[520px]">
        <div
          role="group"
          aria-label="Schedule preset"
          className="flex gap-1 rounded-tile border border-line bg-surface p-1"
        >
          <PresetButton active={allSelected} onClick={setAllDays} label="Every weekday" />
          <PresetButton
            active={!allSelected}
            onClick={() => allSelected && setDays(['tue', 'wed', 'thu'])}
            label="Custom schedule"
          />
        </div>

        <DaySelector className="mt-4" days={days} onToggle={toggleDay} />

        <div className="mt-5 flex items-start gap-2.5">
          {none ? (
            <p className="text-[13px] font-semibold text-orange-ink">
              Pick at least one day to continue.
            </p>
          ) : (
            <p className="flex items-start gap-2.5 text-[13px] text-quiet">
              <Pause size={14} strokeWidth={2.2} aria-hidden="true" className="mt-0.5 shrink-0" />
              You can pause any single day later — just tell SETU before 7 am that morning.
            </p>
          )}
        </div>
      </div>

      <Reveal delay={0.06} className="mt-11 sm:mt-14">
        <RailRule label="This week" states={states} />

        <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
          <div>
            <span className="eyebrow">Your schedule</span>
            <p className="numeric mt-3 text-[clamp(2.6rem,10vw,3.5rem)] leading-none text-ink">
              {days.length}
            </p>
            <p className="mt-2.5 text-[14px] font-semibold text-ink-3">office days / week</p>
          </div>

          {lunch && (
            <div className="min-w-0">
              <span className="eyebrow">Works out to</span>
              <p className="numeric mt-3 text-[30px] leading-none text-ink">
                {inr(lunch.each)}
                <span className="ml-2 font-sans text-[13px] font-medium tracking-normal text-quiet">
                  per lunch
                </span>
              </p>
              <p className="mt-2.5 text-[13px] leading-snug text-quiet">
                {lunch.lunches} lunches this month on a {inr(1800)} dabbawala fee.
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 max-w-[52ch] border-t border-line pt-5 text-[13.5px] leading-snug text-quiet">
          {weekSummary(days)} · the fee is monthly, so a lighter week costs the same. Pausing keeps
          the dabba ready for the next day you are in.
        </p>
      </Reveal>

      <StickyCTA note={none ? 'Choose at least one day first.' : 'Next: the full monthly breakdown.'}>
        <Button
          to={none ? undefined : '/plan'}
          size="lg"
          iconRight={ArrowRight}
          fullWidth
          disabled={none}
          aria-disabled={none}
        >
          Review plan
        </Button>
      </StickyCTA>
    </AppShell>
  )
}

function PresetButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-10 flex-1 rounded-[9px] px-3 text-[13px] font-semibold transition-colors duration-150 ${
        active ? 'bg-ink text-paper' : 'text-ink-3 hover:bg-paper-2 hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}
