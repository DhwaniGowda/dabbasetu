import { ArrowRight, Clock, Info } from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import DabbawalaCard from '../components/DabbawalaCard'
import RouteLine from '../components/RouteLine'
import Reveal from '../components/Reveal'
import { StatusPill } from '../components/StatusPill'
import { PageHead, RailRule, StickyCTA } from '../components/PageParts'
import { FlowIndexCard, TripCard } from '../components/AsideCards'
import { carrier, carrierRun, route } from '../data/demo'

const RUN = carrierRun.map((stop, index) => ({
  ...stop,
  state: index === 0 ? 'current' : 'upcoming',
}))

export default function Match() {
  return (
    <AppShell
      nav={false}
      back={{ to: '/route', label: 'Route' }}
      step={[2, 5]}
      aside={
        <>
          <TripCard
            days={['tue', 'wed', 'thu']}
            statusPill={
              <StatusPill tone="covered" dot>
                Carrier matched
              </StatusPill>
            }
          />
          <FlowIndexCard activeTo="/match" />
        </>
      }
    >
      <PageHead
        eyebrow="Step 02 · Your carrier"
        title={
          <>
            Handled by Santosh's Kandivali group<span className="text-orange-ink">.</span>
          </>
        }
        lead="One group already walks this exact corridor every morning. SETU just tells them which days you are in."
      />

      <Reveal className="mt-9 sm:mt-11">
        <DabbawalaCard />
      </Reveal>

      <Reveal delay={0.08} className="mt-11 sm:mt-14">
        <RailRule
          label="The morning run"
          states={['current', 'upcoming', 'upcoming', 'upcoming', 'upcoming']}
        />

        <div className="mt-8 sm:max-w-[520px]">
          <RouteLine stops={RUN} />
        </div>

        <p className="mt-7 flex items-start gap-3 border-t border-line pt-5 text-[13px] leading-snug text-quiet sm:max-w-[520px]">
          <Info
            size={15}
            strokeWidth={2.2}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-ink-3"
          />
          These are the group's standard timings. Yours can shift by a few minutes on a busy
          morning — the scan trail always shows what actually happened.
        </p>
      </Reveal>

      <Reveal delay={0.12} className="mt-11 sm:max-w-[560px]">
        <div className="grid grid-cols-2 gap-x-8 border-t border-line pt-6">
          <div>
            <span className="eyebrow flex items-center gap-2">
              <Clock size={12} strokeWidth={2.6} aria-hidden="true" />
              Pickup window
            </span>
            <p className="numeric mt-3 text-[26px] leading-none text-ink sm:text-[30px]">
              09:00 – 09:20
            </p>
            <p className="mt-2 text-[12.5px] leading-snug text-quiet">
              Keep the dabba ready at the door.
            </p>
          </div>
          <div>
            <span className="eyebrow">Your desk by</span>
            <p className="numeric mt-3 text-[26px] leading-none text-ink sm:text-[30px]">
              {carrier.delivery}
            </p>
            <p className="mt-2 text-[12.5px] leading-snug text-quiet">
              {route.to} · 4th floor reception
            </p>
          </div>
        </div>
      </Reveal>

      <StickyCTA note="Next: pick the days you are in the office.">
        <Button to="/days" size="lg" iconRight={ArrowRight} fullWidth>
          Continue
        </Button>
      </StickyCTA>
    </AppShell>
  )
}
