import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import RouteLine, { Node } from './RouteLine'
import { CodePlate, StatusPill } from './StatusPill'
import { formatDayList } from '../lib/dayLabels'
import { carrier, customer, journeyStops, pricing, route, weekdays } from '../data/demo'
import { inr } from '../lib/format'

/** Small "one glance" trip summary used in the desktop side column. */
export function TripCard({ days = [], statusPill }) {
  return (
    <section className="rounded-panel border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Your trip</span>
        {statusPill ?? (
          <StatusPill tone="covered" dot>
            Route covered
          </StatusPill>
        )}
      </div>

      <RouteLine
        className="mt-6"
        showCodes={false}
        stops={[
          {
            id: 'home',
            label: customer.home.title,
            note: customer.home.detail,
            state: 'done',
            time: '',
          },
          {
            id: 'office',
            label: customer.office.title,
            note: customer.office.detail,
            state: 'current',
            time: '',
          },
        ]}
      />

      <dl className="mt-5 space-y-3 border-t border-line pt-5 text-[13.5px]">
        <Row label="Carrier">
          {carrier.name} · {carrier.group}
        </Row>
        <Row label="Office days">{formatDayList(days, weekdays)}</Row>
        <Row label="Monthly">
          <span className="numeric text-[18px]">{inr(pricing.total)}</span>
        </Row>
      </dl>
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-quiet">{label}</dt>
      <dd className="text-right font-medium text-ink">{children}</dd>
    </div>
  )
}

/** The large live journey visualisation — desktop right column on Today. */
export function LiveRouteRail({ stops = journeyStops, stage, delivered = false }) {
  const eta = stage?.eta ?? route.etaLive
  const etaLabel = stage?.etaLabel ?? 'Desk by'
  const status = stage?.status ?? 'On the train'

  return (
    <section
      data-surface="ink"
      className="relative overflow-hidden rounded-panel bg-ink px-5 pb-5 pt-5 text-paper grain grain-dark"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-paper/55">Live route</span>
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.09em] ${
            delivered ? 'text-green-tint' : 'text-orange'
          }`}
        >
          <span
            aria-hidden="true"
            className={`size-[5px] rounded-full ${delivered ? 'bg-green' : 'bg-orange'}`}
          />
          {status}
        </span>
      </div>

      <ol className="mt-6">
        {stops.map((stop, index) => {
          const last = index === stops.length - 1
          const tone =
            stop.state === 'done'
              ? 'text-paper/55'
              : stop.state === 'current'
                ? 'text-orange'
                : 'text-paper/40'
          return (
            <li key={stop.id} className="grid grid-cols-[17px_minmax(0,1fr)] gap-3.5">
              <div className="relative">
                {!last && (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-1/2 top-[16px] w-[2px] -translate-x-1/2 ${
                      stop.state === 'done'
                        ? 'bg-green'
                        : stop.state === 'current'
                          ? 'bg-orange'
                          : 'bg-paper/18'
                    }`}
                  />
                )}
                <span className="absolute left-1/2 top-[1px] -translate-x-1/2">
                  <Node state={stop.state} size={16} surface="dark" />
                </span>
              </div>

              <div className={last ? 'pb-0' : 'pb-5'}>
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-[0.08em] ${tone}`}
                  >
                    {stop.code}
                  </span>
                  <span className="numeric text-[15px] leading-none text-paper/85">
                    {stop.time}
                  </span>
                </div>
                <p
                  className={`mt-1 text-[13px] leading-snug ${
                    stop.state === 'current' ? 'font-semibold text-paper' : 'text-paper/55'
                  }`}
                >
                  {stop.note}
                </p>
                {stop.state === 'current' && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <CodePlate tone="orange">K4-07</CodePlate>
                    <span className="font-mono text-[10px] tracking-[0.02em] text-paper/55">
                      crate scanned 09:51
                    </span>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-paper/15 pt-4">
        <div>
          <span className="eyebrow text-paper/55">{etaLabel}</span>
          <div
            className={`numeric text-[38px] leading-none ${delivered ? 'text-green-tint' : 'text-orange'}`}
          >
            {eta}
          </div>
        </div>
        <p className="text-right font-mono text-[10px] leading-relaxed tracking-[0.02em] text-paper/55">
          4 QUICK SCANS
          <br />
          NO GPS NEEDED
        </p>
      </div>
    </section>
  )
}

const DEMO_STEPS = [
  { n: '01', label: 'Check your route', to: '/route' },
  { n: '02', label: 'Meet the carrier', to: '/match' },
  { n: '03', label: 'Pick office days', to: '/days' },
  { n: '04', label: 'Demo payment', to: '/plan' },
  { n: '05', label: 'Track today', to: '/journey' },
]

/** A working index of the demo — handy when presenting on a big screen. */
export function FlowIndexCard({ activeTo }) {
  return (
    <section className="rounded-panel border border-line bg-surface p-5">
      <span className="eyebrow">Demo path</span>
      <ol className="mt-4">
        {DEMO_STEPS.map((step) => {
          const active = step.to === activeTo
          return (
            <li key={step.n}>
              <Link
                to={step.to}
                aria-current={active ? 'step' : undefined}
                className="group flex items-center gap-3 rounded-[9px] px-2 py-2.5 transition-colors hover:bg-paper-2"
              >
                <span
                  className={`numeric text-[14px] ${
                    active ? 'text-orange-ink' : 'text-faint'
                  }`}
                >
                  {step.n}
                </span>
                <span
                  className={`flex-1 text-[14px] ${active ? 'font-semibold text-ink' : 'text-ink-3'}`}
                >
                  {step.label}
                </span>
                <ChevronRight
                  size={15}
                  aria-hidden="true"
                  className="text-faint transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          )
        })}
      </ol>

      <div className="mt-4 border-t border-line pt-4">
        <Link
          to="/dabbawala"
          className="group flex items-center justify-between gap-2 text-[14px] font-semibold text-ink"
        >
          Dabbawala demo
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="text-orange transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
        <p className="mt-3 text-[12.5px] leading-snug text-quiet">
          All data on this prototype is mock data. Nothing is sent anywhere.
        </p>
      </div>
    </section>
  )
}
