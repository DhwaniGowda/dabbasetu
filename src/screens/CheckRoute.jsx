import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Building2, Check, Home } from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import LocationField from '../components/LocationField'
import Mascot from '../components/Mascot'
import RouteLine from '../components/RouteLine'
import Reveal from '../components/Reveal'
import TrainLoader from '../components/TrainLoader'
import { CodePlate, StatusPill } from '../components/StatusPill'
import { Board, PageHead, StickyCTA } from '../components/PageParts'
import { FlowIndexCard, TripCard } from '../components/AsideCards'
import { useDemo } from '../state/DemoState'
import { carrier, locationSuggestions, pricing, route } from '../data/demo'
import { inr } from '../lib/format'

const CHECKS = [
  'Your home is on a morning pickup walk',
  'Your office is on a delivery walk the same day',
  'One group covers both ends of the journey',
]

export default function CheckRoute() {
  const { home, office, setHome, setOffice } = useDemo()
  const [status, setStatus] = useState('idle')
  const timer = useRef(null)
  const resultRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (status !== 'done' || !resultRef.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resultRef.current.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
    })
  }, [status])

  const check = () => {
    setStatus('checking')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('done'), 900)
  }

  const covered = status === 'done'

  return (
    <AppShell
      nav={false}
      back={{ to: '/app', label: 'Home' }}
      step={[1, 5]}
      aside={
        <>
          <TripCard
            days={['tue', 'wed', 'thu']}
            statusPill={
              covered ? (
                <StatusPill tone="covered" dot>
                  Route covered
                </StatusPill>
              ) : (
                <StatusPill tone="quiet" dot>
                  Not checked
                </StatusPill>
              )
            }
          />
          <FlowIndexCard activeTo="/route" />
        </>
      }
    >
      <PageHead
        eyebrow="Step 01 · Route check"
        title={
          <>
            Where does your dabba travel<span className="text-orange-ink">?</span>
          </>
        }
        lead="Two ends of your day. We check them against the dabbawala groups already running this line."
      />

      <div className="mt-9 grid gap-7 sm:mt-11 sm:max-w-[560px]">
        <LocationField
          label="Home"
          icon={Home}
          value={home}
          onChange={setHome}
          suggestions={locationSuggestions.home}
          hint="Morning pickup"
        />
        <LocationField
          label="Office"
          icon={Building2}
          value={office}
          onChange={setOffice}
          suggestions={locationSuggestions.office}
          hint="Lunch delivered"
        />
      </div>

      {status === 'checking' && (
        <div className="mt-8 sm:max-w-[560px]">
          <TrainLoader label="Checking the Western Line for a covering route" />
        </div>
      )}

      {status === 'idle' && (
        <div className="mt-10 border-t border-line pt-6 sm:max-w-[560px]">
          <span className="eyebrow">What we check</span>
          <ul className="mt-4 space-y-3.5">
            {CHECKS.map((checkItem) => (
              <li key={checkItem} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-3">
                  <Check size={13} strokeWidth={2.6} aria-hidden="true" />
                </span>
                <span className="text-[14.5px] leading-snug text-ink-2">{checkItem}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] leading-snug text-quiet">
            We only match you when one group covers both ends. No partial routes, no handoffs to a
            second carrier.
          </p>
        </div>
      )}

      {covered && (
        <div ref={resultRef} className="mt-8 space-y-6">
          <Reveal>
            <Board>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-line px-4 py-3.5 sm:px-6">
                <StatusPill tone="covered" icon={Check}>
                  Route covered
                </StatusPill>
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-quiet">
                  {route.from} → {route.to}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 px-4 pt-6 sm:px-6">
                <div className="min-w-0">
                  <h2 className="display text-[clamp(2.2rem,9.5vw,3.2rem)] text-ink">
                    Western Line
                  </h2>
                  <p className="mt-2.5 max-w-[34ch] text-[14.5px] leading-snug text-quiet">
                    3 dabbawala groups already run this corridor. One covers both your ends.
                  </p>
                </div>
                <Mascot
                  pose="ride"
                  lift={false}
                  delay={0.15}
                  className="h-[84px] shrink-0 sm:h-[112px]"
                  alt="The SETU dabbawala on his bicycle, carrying stainless-steel tiffins."
                />
              </div>

              <div className="px-3 py-7 sm:px-6 sm:py-8">
                <RouteLine orientation="horizontal" stops={route.stops} />
              </div>

              <div className="flex items-center gap-3.5 border-t border-line px-4 py-4 sm:px-6">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-tile bg-ink font-display text-[19px] font-semibold leading-none text-paper"
                >
                  {carrier.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold leading-snug text-ink">
                    Matched with Santosh's route
                  </p>
                  <p className="text-[12.5px] text-quiet">
                    {carrier.group} · pickup {carrier.pickup}
                  </p>
                </div>
                <CodePlate>{carrier.code}</CodePlate>
              </div>
            </Board>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-t border-line pt-5">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <span className="eyebrow">Monthly</span>
                  <p className="mt-2 text-[13.5px] leading-snug text-quiet">
                    {inr(pricing.dabbawala)} to Santosh + {inr(pricing.plus)} SETU Plus
                  </p>
                </div>
                <div className="numeric shrink-0 text-[34px] leading-none text-ink">
                  {inr(pricing.total)}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-[13.5px] font-semibold text-ink-3 underline decoration-line-2 decoration-1 underline-offset-4 transition-colors hover:text-ink"
            >
              Check a different route
            </button>
          </Reveal>
        </div>
      )}

      {status !== 'checking' && (
        <StickyCTA
          note={
            covered
              ? 'Next: the carrier and the exact timings.'
              : 'No account needed. This is a demo with mock data.'
          }
        >
          {covered ? (
            <Button to="/match" size="lg" iconRight={ArrowRight} fullWidth>
              Choose my days
            </Button>
          ) : (
            <Button size="lg" iconRight={ArrowRight} onClick={check} fullWidth>
              Check route
            </Button>
          )}
        </StickyCTA>
      )}
    </AppShell>
  )
}
