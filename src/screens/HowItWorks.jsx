import { ArrowRight, QrCode } from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import RouteLine from '../components/RouteLine'
import Reveal from '../components/Reveal'
import { Board, PageHead, RailRule, StickyCTA } from '../components/PageParts'
import { brand, trackingStages } from '../data/demo'

const MISSED_EXAMPLE = [
  {
    id: 'done',
    code: 'KANDIVALI',
    label: 'Sorted at Kandivali',
    time: '09:51',
    note: 'Crate K4-07 · scanned',
    state: 'done',
  },
  {
    id: 'missed',
    code: 'LOWER PAREL',
    label: 'On its way',
    time: '—',
    note: 'Not confirmed yet. Scans normally land by 11:45.',
    state: 'paused',
  },
]

const NOT_LIST = [
  'No GPS device riding in your tiffin',
  'No camera looking inside your kitchen',
  'No third-party location tracking',
]

export default function HowItWorks() {
  return (
    <AppShell
      nav={false}
      back={{ to: '/journey', label: 'Today' }}
      aside={
        <>
          <section className="rounded-panel border border-line bg-surface p-5">
            <span className="eyebrow">What is not attached</span>
            <ul className="mt-4 space-y-3">
              {NOT_LIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-ink"
                  />
                  <span className="text-[14px] leading-snug text-ink-2">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            data-surface="ink"
            className="relative overflow-hidden rounded-panel bg-ink p-5 text-paper grain grain-dark"
          >
            <p className="display text-[26px] leading-[1.02]">{brand.line}</p>
            <p className="mt-3 text-[12.5px] leading-snug text-paper/60">
              Dabbawalas have moved Mumbai's lunch for over a century. SETU adds a bridge, not a
              replacement.
            </p>
          </section>
        </>
      }
    >
      <PageHead
        eyebrow="How tracking works"
        title={
          <>
            A few scans. That's it<span className="text-orange-ink">.</span>
          </>
        }
        lead="No GPS. No device attached to your dabba. Four QR checkpoints tell you where your lunch has reached."
      />

      <Reveal className="mt-11 sm:max-w-[620px]">
        <ol>
          {trackingStages.map((stage) => (
            <li
              key={stage.n}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-line py-5 last:border-b"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-tile border border-line bg-surface text-ink-3">
                <QrCode size={17} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-[16.5px] font-semibold leading-snug text-ink">
                    {stage.title}
                  </h2>
                  <span className="font-deva text-[13.5px] leading-snug text-quiet">
                    {stage.deva}
                  </span>
                  <span className="numeric ml-auto text-[15px] text-faint">{stage.n}</span>
                </div>
                <p className="mt-1.5 max-w-[54ch] text-[14px] leading-relaxed text-quiet">
                  {stage.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.08} className="mt-12 sm:max-w-[620px]">
        <RailRule
          label="When a scan is missed"
          states={['done', 'done', 'upcoming', 'upcoming', 'upcoming']}
        />

        <Board className="mt-7">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3.5 sm:px-5">
            <span className="eyebrow text-ink-3">Example</span>
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-quiet">
              TUE · 24 SEP
            </span>
          </div>
          <div className="px-4 py-7 sm:px-5">
            <RouteLine showCodes stops={MISSED_EXAMPLE} />
          </div>
        </Board>

        <p className="mt-6 text-[14.5px] leading-relaxed text-ink-3">
          A missed scan shows as{' '}
          <span className="font-semibold text-ink">“on its way — not confirmed yet”</span> rather
          than pretending we know its exact location. What SETU shows you is always something a
          dabbawala actually scanned.
        </p>
      </Reveal>

      <StickyCTA note="Four scans, nothing else.">
        <Button to="/journey" size="lg" iconRight={ArrowRight} fullWidth>
          Back to today
        </Button>
      </StickyCTA>
    </AppShell>
  )
}
