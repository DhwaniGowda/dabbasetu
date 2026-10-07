import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Info,
  NotebookPen,
  RotateCcw,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import Mascot from '../components/Mascot'
import Reveal, { EASE } from '../components/Reveal'
import { StatusPill } from '../components/StatusPill'
import { Rule, SectionNumber } from '../components/PageParts'
import { LogoStacked } from '../components/Logo'
import { useToast } from '../components/Toast'
import { useDemo } from '../state/DemoState'
import { brand, carrier, customer, pricing, route } from '../data/demo'
import { inr } from '../lib/format'
import { formatDayList } from '../lib/dayLabels'

const ABOUT_POINTS = [
  ['No kitchen', 'Your lunch is cooked at home, exactly as it always has been.'],
  ['No new riders', 'The dabbawala network carries it. SETU adds no fleet.'],
  ['No data selling', 'Nothing here leaves the browser — this is a prototype.'],
]

export default function Profile() {
  const toast = useToast()
  const { days, connected } = useDemo()
  const [aboutOpen, setAboutOpen] = useState(true)

  const demoOnly = () =>
    toast('Demo only — this screen is not part of the prototype.', { tone: 'note' })

  return (
    <AppShell
      nav
      aside={
        <>
          <section className="rounded-panel border border-line bg-surface p-5">
            <span className="eyebrow">Demo controls</span>
            <p className="mt-3 text-[13.5px] leading-snug text-quiet">
              Refreshing the browser resets every screen, since nothing is stored.
            </p>
            <Button
              tone="secondary"
              size="sm"
              icon={RotateCcw}
              className="mt-4"
              onClick={() => window.location.assign('/app')}
            >
              Restart the demo
            </Button>
          </section>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-tile bg-ink font-display text-[26px] font-semibold leading-none text-paper"
        >
          {customer.initials}
        </span>
        <div className="min-w-0">
          <h1 className="display text-[clamp(2.4rem,9.5vw,3.4rem)] leading-none text-ink">
            {customer.name}
          </h1>
          <p className="mt-2 text-[14px] text-quiet">
            {customer.home.title} → {customer.office.title}, {customer.office.detail}
          </p>
        </div>
      </div>

      <Reveal className="mt-9 sm:mt-11">
        <div className="rounded-panel border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <span className="eyebrow">Your plan</span>
            {connected ? (
              <StatusPill tone="covered" dot>
                Active
              </StatusPill>
            ) : (
              <StatusPill tone="active" dot>
                Not set up
              </StatusPill>
            )}
          </div>

          <dl className="divide-y divide-line px-5">
            <ProfileRow
              label="Office days"
              value={formatDayList(days)}
              action="Change"
              to="/schedule"
            />
            <ProfileRow
              label="Dabbawala"
              value={`${carrier.name} · ${carrier.group}`}
              action={null}
            />
            <ProfileRow label="Route" value={route.headline} action={null} />
            <ProfileRow
              label="Monthly"
              value={`${inr(pricing.total)} · ${inr(pricing.dabbawala)} + ${inr(pricing.plus)}`}
              action={null}
            />
          </dl>
        </div>
      </Reveal>

      <Reveal delay={0.06} className="mt-11">
        <Rule
          label="Manage"
          right={<SectionNumber>05</SectionNumber>}
        />

        <ul className="mt-2">
          <MenuRow icon={CalendarDays} label="Office days" note="Tue · Wed · Thu" to="/schedule" />
          <MenuRow
            icon={CreditCard}
            label="Payment"
            note="UPI Autopay · ₹1,949 monthly"
            onClick={demoOnly}
          />
          <MenuRow
            icon={NotebookPen}
            label="Delivery instructions"
            note="4th floor reception, ask for Aarav"
            onClick={demoOnly}
          />
          <MenuRow
            icon={HelpCircle}
            label="Help"
            note="Carrier, pause, missing dabba"
            onClick={demoOnly}
          />
        </ul>
      </Reveal>

      <Reveal delay={0.1} className="mt-11">
        <div className="overflow-hidden rounded-panel border border-line bg-surface">
          <button
            type="button"
            onClick={() => setAboutOpen((prev) => !prev)}
            aria-expanded={aboutOpen}
            className="flex w-full items-center gap-3.5 px-5 py-4 text-left"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-paper-2 text-ink-3">
              <Info size={16} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold leading-snug text-ink">
                About SETU
              </span>
              <span className="block text-[13px] leading-snug text-quiet">{brand.tagline}</span>
            </span>
            <ChevronDown
              size={17}
              strokeWidth={2}
              aria-hidden="true"
              className={`shrink-0 text-quiet transition-transform duration-200 ${
                aboutOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {aboutOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="overflow-hidden"
              >
                {/* Echoes the closing slide of the deck: charcoal, the real
                    logo, and the dabbawala beside the brand line. */}
                <div
                  data-surface="ink"
                  className="relative border-t border-line bg-ink px-5 pb-6 pt-6 text-paper grain grain-dark"
                >
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <LogoStacked width={140} />
                      <p className="display mt-5 max-w-[22ch] text-[28px] leading-[1.02] text-paper sm:text-[32px]">
                        {brand.line}
                      </p>
                    </div>
                    <Mascot
                      pose="running"
                      mirror
                      lift={false}
                      className="h-[124px] shrink-0 sm:h-[170px]"
                      alt="The SETU dabbawala running with a stack of tiffins."
                    />
                  </div>

                  <dl className="mt-7 space-y-4 border-t border-paper/15 pt-5">
                    {ABOUT_POINTS.map(([title, note]) => (
                      <div key={title}>
                        <dt className="text-[14px] font-semibold text-paper">{title}</dt>
                        <dd className="mt-1 text-[13.5px] leading-snug text-paper/60">{note}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-8">
        <Link
          to="/dabbawala"
          className="group flex items-center justify-between gap-4 rounded-panel border border-dashed border-line-2 px-5 py-4 transition-colors hover:border-ink"
        >
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-ink">View Dabbawala Demo</span>
            <span className="mt-1 block text-[13px] leading-snug text-quiet">
              आजचे डबे · the carrier's own simple screen
            </span>
          </span>
          <ArrowUpRight
            size={18}
            strokeWidth={2.2}
            aria-hidden="true"
            className="shrink-0 text-orange transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </Reveal>

      <p className="mt-10 max-w-[46ch] font-mono text-[10.5px] leading-relaxed tracking-[0.02em] text-faint">
        SETU PROTOTYPE · ALL DATA IS MOCK DATA · NO BACKEND, NO PAYMENTS, NO MAPS, NO GPS.
      </p>
    </AppShell>
  )
}

function ProfileRow({ label, value, action, to }) {
  return (
    <div className="flex items-end justify-between gap-4 py-4">
      <div className="min-w-0">
        <dt className="eyebrow">{label}</dt>
        <dd className="mt-2 text-[15px] font-medium leading-snug text-ink">{value}</dd>
      </div>
      {action && to && (
        <Button to={to} tone="secondary" size="sm" className="shrink-0">
          {action}
        </Button>
      )}
    </div>
  )
}

function MenuRow({ icon: Icon, label, note, to, onClick }) {
  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-paper-2 text-ink-3">
        <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug text-ink">{label}</span>
        {note && <span className="block text-[13px] leading-snug text-quiet">{note}</span>}
      </span>
      <ChevronRight
        size={17}
        strokeWidth={2}
        aria-hidden="true"
        className="shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </>
  )

  const classes =
    'group flex w-full items-center gap-3.5 border-b border-line px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-paper-2'

  return (
    <li>
      {to ? (
        <Link to={to} className={classes}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={classes}>
          {inner}
        </button>
      )}
    </li>
  )
}
