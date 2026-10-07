import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Info,
  LifeBuoy,
  Pause,
  RotateCcw,
  SkipForward,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import BottomSheet from '../components/BottomSheet'
import JourneyTimeline from '../components/JourneyTimeline'
import Mascot from '../components/Mascot'
import Reveal from '../components/Reveal'
import RouteLine from '../components/RouteLine'
import { CodePlate, StatusPill } from '../components/StatusPill'
import { RailRule, Rule, SectionNumber } from '../components/PageParts'
import { LiveRouteRail } from '../components/AsideCards'
import { useToast } from '../components/Toast'
import { TODAY, useDemo } from '../state/DemoState'
import { carrier, journeyStages, journeyStates, trackingStages } from '../data/demo'

/** The four QR checkpoints. `local` is inferred from a crate scan, not scanned. */
const SCAN_IDS = ['home', 'kandivali', 'lower-parel', 'desk']

/** Compact codes for the hero rail — the full codes are too long for a column. */
const RAIL_CODES = {
  home: 'HOME',
  kandivali: 'KANDIVALI',
  local: 'LOCAL',
  'lower-parel': 'L. PAREL',
  desk: 'DESK',
}

export default function Journey() {
  const toast = useToast()
  const { isPaused, togglePause, journeyStage, advanceJourney, resetJourney } = useDemo()
  const [pauseOpen, setPauseOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  const stage = journeyStages[journeyStage]
  const stops = useMemo(() => journeyStates(journeyStage), [journeyStage])
  const delivered = stage.id === 'desk'
  const isLast = journeyStage === journeyStages.length - 1
  const pausedTomorrow = isPaused(TODAY.tomorrow)
  const confirmed = stops.filter((s) => s.state === 'done' && SCAN_IDS.includes(s.id)).length

  const railStops = stops.map((stop) => ({ ...stop, code: RAIL_CODES[stop.id] ?? stop.code }))

  return (
    <AppShell
      nav
      headerTone="ink"
      hero={<TodayHero stage={stage} stops={railStops} delivered={delivered} />}
      aside={
        <>
          <LiveRouteRail stops={railStops} stage={stage} delivered={delivered} />
          <section className="rounded-panel border border-line bg-surface p-5">
            <span className="eyebrow">How tracking works</span>
            <p className="mt-3 text-[13.5px] leading-snug text-quiet">
              No GPS and nothing attached to your dabba. Four QR scans mark the journey, and a missed
              scan says so honestly.
            </p>
            <Button
              to="/how-it-works"
              tone="secondary"
              size="sm"
              iconRight={ArrowRight}
              className="mt-4"
            >
              Open explainer
            </Button>
          </section>
        </>
      }
    >
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow">{TODAY.label}</span>
        <div className="flex items-center gap-2.5">
          <StatusPill tone={stage.statusTone} dot>
            {stage.status}
          </StatusPill>
          <Link
            to="/how-it-works"
            aria-label="How tracking works"
            className="grid size-9 place-items-center rounded-full text-quiet transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <Info size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Reveal className="mt-6">
        <h1 className="display max-w-[15ch] text-[clamp(2.5rem,10vw,4rem)] text-ink">
          {stage.headline}
          <span className="text-orange-ink">.</span>
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-ink-3">{stage.note}</p>
      </Reveal>

      {/* Demo control — this prototype has no backend, so the presenter
          walks the journey forward by hand. */}
      <Reveal delay={0.04} className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-tile border border-dashed border-line-2 px-4 py-3">
          <span className="eyebrow">
            Demo · stage {String(journeyStage + 1).padStart(2, '0')} /{' '}
            {String(journeyStages.length).padStart(2, '0')} · {stage.label}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              tone="secondary"
              icon={SkipForward}
              disabled={isLast}
              onClick={advanceJourney}
            >
              Next scan
            </Button>
            <Button size="sm" tone="ghost" icon={RotateCcw} disabled={journeyStage === 0} onClick={resetJourney}>
              Reset
            </Button>
          </div>
        </div>
      </Reveal>

      {delivered && (
        <Reveal delay={0.06} className="mt-6">
          <div className="flex items-center gap-3.5 rounded-tile bg-green-tint px-4 py-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green text-paper">
              <Check size={20} strokeWidth={3} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold leading-snug text-green-deep">
                Delivered to your desk at {stage.eta}.
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-green-deep/85">
                Today's dabba is done. Tomorrow's pickup is at {carrier.pickup}.
              </p>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.08} className="mt-9">
        <div className="flex items-end justify-between gap-6 border-y border-line py-6">
          <div>
            <span className="eyebrow">{stage.etaLabel}</span>
            <p
              className={`numeric mt-2 text-[clamp(2.6rem,11vw,3.5rem)] leading-none ${
                delivered ? 'text-green' : 'text-orange-ink'
              }`}
            >
              {stage.eta}
            </p>
          </div>

          <div className="text-right">
            <span className="eyebrow">Scan trail</span>
            <p className="mt-2 text-[14.5px] font-semibold text-ink">
              {confirmed} of {SCAN_IDS.length} confirmed
            </p>
            <div className="mt-2.5 flex justify-end gap-1.5" aria-hidden="true">
              {SCAN_IDS.map((id, index) => {
                const stop = stops.find((s) => s.id === id)
                const done = stop?.state === 'done'
                return (
                  <span
                    key={id}
                    className={`h-1.5 w-7 sm:w-9 ${done ? 'bg-green' : 'bg-paper-3'}`}
                    style={{ borderRadius: 2 }}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <p className="mt-3.5 text-[12.5px] text-quiet">
          Four quick scans. No GPS needed — and no device riding along with your tiffin.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <RailRule
          label="Today"
          states={railStops.map((stop) => stop.state)}
          right={<SectionNumber>02</SectionNumber>}
        />
        <JourneyTimeline className="mt-8" stops={stops} />
      </Reveal>

      <Reveal delay={0.14} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {pausedTomorrow ? (
          <>
            <Button
              tone="secondary"
              size="lg"
              icon={Check}
              onClick={() => {
                togglePause(TODAY.tomorrow)
                toast('Tomorrow’s pickup is back on.')
              }}
              className="w-full sm:w-auto"
            >
              Tomorrow paused
            </Button>
            <p className="text-[13px] text-quiet sm:ml-1">
              Tap to resume · Santosh skips tomorrow.
            </p>
          </>
        ) : (
          <Button
            tone="secondary"
            size="lg"
            icon={Pause}
            onClick={() => setPauseOpen(true)}
            className="w-full sm:w-auto"
          >
            Pause tomorrow
          </Button>
        )}

        <Button
          tone="ghost"
          size="lg"
          icon={LifeBuoy}
          onClick={() => setHelpOpen(true)}
          className="w-full sm:w-auto"
        >
          Get help
        </Button>
      </Reveal>

      <Reveal delay={0.18} className="mt-12">
        <Rule label="About this tracking" />
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5">
          {trackingStages.map((item, index) => (
            <span key={item.n} className="flex items-center gap-4">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-quiet">
                {item.n} {item.title}
              </span>
              {index < trackingStages.length - 1 && (
                <span aria-hidden="true" className="h-3 w-px bg-line-2" />
              )}
            </span>
          ))}
        </div>
      </Reveal>

      <BottomSheet
        open={pauseOpen}
        onClose={() => setPauseOpen(false)}
        title="Pause tomorrow's pickup?"
        subtitle={`${TODAY.tomorrowLabel} · your dabba stays home`}
        footer={
          <>
            <Button
              size="lg"
              icon={Pause}
              fullWidth
              onClick={() => {
                togglePause(TODAY.tomorrow)
                setPauseOpen(false)
                toast('Tomorrow paused. Santosh has been told.', { tone: 'pause' })
              }}
            >
              Pause tomorrow
            </Button>
            <Button tone="ghost" fullWidth onClick={() => setPauseOpen(false)}>
              Keep it as it is
            </Button>
          </>
        }
      >
        <ul className="space-y-3.5">
          {[
            'Santosh will not collect your dabba tomorrow morning.',
            'Nothing else changes — the rest of your week stays as it is.',
            'You can undo this any time before 7 am.',
          ].map((line) => (
            <li key={line} className="flex items-start gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
              <span className="text-[14.5px] leading-snug text-ink-2">{line}</span>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Need a hand?"
        subtitle="Copy only — this prototype does not call or message anyone."
      >
        <ul className="divide-y divide-line">
          {[
            { label: 'Call Santosh', note: 'The carrier on your route' },
            { label: 'Message the Kandivali group', note: 'Typical reply in a few minutes' },
            { label: 'My dabba has not arrived', note: 'Report it after 12:45' },
          ].map((row) => (
            <li key={row.label}>
              <button
                type="button"
                onClick={() => toast('Demo only — nothing was sent.')}
                className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-ink"
              >
                <span>
                  <span className="block text-[15px] font-semibold leading-snug text-ink">
                    {row.label}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-quiet">
                    {row.note}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  aria-hidden="true"
                  className="shrink-0 text-quiet"
                />
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </AppShell>
  )
}

/**
 * Charcoal hero — the tracking slide, live. Title, ETA, the railway line
 * across the route, and the dabbawala himself once lunch has landed.
 */
function TodayHero({ stage, stops, delivered }) {
  return (
    <section
      data-surface="ink"
      className="relative isolate overflow-hidden bg-ink text-paper grain grain-dark"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-9 pt-8 sm:px-7 sm:pb-10 lg:px-11 lg:pb-14 lg:pt-12">
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow text-paper/55">{stage.eyebrow}</span>
          <SectionNumber tone="paper">02</SectionNumber>
        </div>

        <div className="mt-6 grid items-end gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <div className="min-w-0">
            <h1 className="display max-w-[16ch] text-[clamp(2.75rem,12vw,5.5rem)] text-paper">
              {stage.headline}
              <span className={delivered ? 'text-green' : 'text-orange'}>.</span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-paper">
                Kandivali → Lower Parel
              </span>
              <span aria-hidden="true" className="h-3.5 w-px bg-paper/25" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-paper/55">
                {stage.etaLabel}{' '}
                <span className={`numeric text-[19px] ${delivered ? 'text-green-tint' : 'text-orange'}`}>
                  {stage.eta}
                </span>
              </span>
              <span aria-hidden="true" className="h-3.5 w-px bg-paper/25" />
              <CodePlate tone="outline" className="border-paper/25 bg-transparent text-paper/70">
                {carrier.code}
              </CodePlate>
            </div>
          </div>

          {delivered && (
            <Mascot
              pose="tiffin"
              className="h-[150px] sm:h-[210px] lg:h-[330px]"
              alt="The SETU dabbawala holding a tiffin and a delivered stamp."
            />
          )}
        </div>

        <div className="mt-9 border-t border-paper/15 pt-6">
          <RouteLine orientation="horizontal" stops={stops} surface="dark" />
        </div>
      </div>
    </section>
  )
}
