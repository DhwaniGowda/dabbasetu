import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Bike, QrCode, Users, Utensils } from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import Mascot from '../components/Mascot'
import RouteLine, { RailStrip } from '../components/RouteLine'
import Reveal from '../components/Reveal'
import { Board, RailRule, SectionNumber } from '../components/PageParts'
import { LogoMark } from '../components/Logo'
import { FlowIndexCard } from '../components/AsideCards'
import { brand, route } from '../data/demo'

const MANIFEST = [
  {
    n: '01',
    title: 'You tell us where you travel',
    note: 'Home in the morning, office by lunch. Two locations, nothing else.',
  },
  {
    n: '02',
    title: 'We find the group already going there',
    note: 'A dabbawala route that covers both ends of your day — no new riders, no new network.',
  },
  {
    n: '03',
    title: 'You follow the dabba by scan',
    note: 'Four QR checkpoints tell you where lunch has reached. No GPS, nothing attached to your tiffin.',
  },
]

const BOARD_FACTS = [
  { big: '4', caption: 'QR scans a day' },
  { big: '1', caption: 'carrier on your route' },
  { big: '₹1,949', caption: 'per month, incl. SETU Plus' },
]

const NOT_LIST = [
  { icon: Utensils, label: 'Not a kitchen', note: 'Your lunch is cooked at home.' },
  { icon: Bike, label: 'Not a delivery fleet', note: 'No new riders are hired.' },
  { icon: Users, label: 'Not a replacement', note: 'The dabbawala network stays as it is.' },
]

export default function Welcome() {
  return (
    <AppShell
      nav
      headerTone="ink"
      hero={<WelcomeHero />}
      aside={
        <>
          <FlowIndexCard activeTo="/app" />
          <section className="rounded-panel border border-line bg-surface p-5">
            <span className="eyebrow">What SETU is not</span>
            <ul className="mt-4 space-y-3.5">
              {NOT_LIST.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-paper-2 text-ink-3">
                    <item.icon size={15} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold leading-snug text-ink">
                      {item.label}
                    </span>
                    <span className="block text-[12.5px] leading-snug text-quiet">
                      {item.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      }
    >
      <Reveal className="mt-2">
        <Board>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3.5 sm:px-6">
            <span className="eyebrow text-ink-3">{route.line}</span>
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-quiet">
              {route.from} → {route.to}
            </span>
          </div>

          <div className="px-3 py-8 sm:px-6 sm:py-10">
            <RouteLine orientation="horizontal" stops={route.stops} />
          </div>

          <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
            {BOARD_FACTS.map((fact) => (
              <div key={fact.caption} className="px-3.5 py-4 sm:px-6 sm:py-5">
                <div className="numeric text-[23px] leading-none text-ink sm:text-[28px]">
                  {fact.big}
                </div>
                <div className="mt-2 text-[11.5px] leading-tight text-quiet sm:text-[12.5px]">
                  {fact.caption}
                </div>
              </div>
            ))}
          </div>
        </Board>
      </Reveal>

      <Reveal delay={0.16}>
        <ol className="mt-12 sm:mt-16">
          {MANIFEST.map((item) => (
            <li
              key={item.n}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-line py-5 last:border-b"
            >
              <span className="numeric text-[17px] leading-none text-orange-ink">{item.n}</span>
              <div>
                <h2 className="text-[17.5px] font-semibold leading-snug text-ink">{item.title}</h2>
                <p className="mt-1.5 max-w-[54ch] text-[14.5px] leading-snug text-quiet">
                  {item.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.22} className="mt-12 sm:mt-16">
        <RailRule
          label="Western Line · Kandivali group"
          states={['done', 'done', 'current', 'upcoming', 'upcoming']}
        />
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[36ch] text-[14.5px] leading-snug text-ink-3">{brand.short}</p>
          <Link
            to="/dabbawala"
            className="group inline-flex w-fit items-center gap-2 text-[14.5px] font-semibold text-ink"
          >
            View Dabbawala Demo
            <ArrowUpRight
              size={17}
              strokeWidth={2.2}
              aria-hidden="true"
              className="text-orange transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Reveal>
    </AppShell>
  )
}

/**
 * The opening slide as a product screen: charcoal, enormous condensed
 * type, the dabbawala carrying the tiffins, and a route line running
 * behind him.
 */
function WelcomeHero() {
  return (
    <section
      data-surface="ink"
      className="relative isolate overflow-hidden bg-ink text-paper grain grain-dark"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden opacity-60 lg:block lg:left-[46%] lg:right-[-40px] lg:top-[52%]"
      >
        <RailStrip
          surface="dark"
          dotSize={11}
          states={['done', 'done', 'current', 'upcoming', 'upcoming']}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-10 pt-9 sm:px-7 sm:pt-11 lg:px-11 lg:pb-16 lg:pt-16">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark height={26} tone="light" />
            <span className="eyebrow text-paper/55">Dabba network · since 1890</span>
          </div>
          <SectionNumber tone="paper">01</SectionNumber>
        </div>

        <div className="mt-9 grid items-end gap-7 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,430px)] lg:gap-12">
          <div>
            <h1 className="display max-w-[14ch] text-[clamp(2.9rem,12.5vw,6.4rem)] text-paper">
              Your dabba already knows the way<span className="text-orange">.</span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-[16.5px] leading-relaxed text-line sm:text-[17px]">
              Home-cooked lunch, carried the way Mumbai has always carried it. SETU finds the
              dabbawala route that already connects your home and your office.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/route" size="lg" iconRight={ArrowRight} className="w-full sm:w-auto">
                Check my route
              </Button>
              <Button
                to="/journey"
                size="lg"
                tone="ghost"
                icon={QrCode}
                className="w-full text-paper hover:bg-paper/10 sm:w-auto"
              >
                Track today's dabba
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <Mascot
              pose="running"
              className="h-[186px] sm:h-[224px] md:h-[300px] lg:h-[420px] xl:h-[462px]"
              alt="The SETU dabbawala, in his Gandhi cap and orange scarf, running with a stack of stainless-steel tiffins."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
