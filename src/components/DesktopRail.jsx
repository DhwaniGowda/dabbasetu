import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Logo from './Logo'
import { RailStrip } from './RouteLine'
import { TABS } from './BottomNav'

/** Desktop navigation rail. Phones get the bottom bar instead. */
export default function DesktopRail() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-line bg-paper px-5 py-7 lg:flex">
      <Link to="/app" className="w-fit rounded-[10px]" aria-label="SETU home">
        <Logo height={30} />
      </Link>

      <RailStrip
        className="mt-7"
        dotSize={8}
        states={['done', 'done', 'current', 'upcoming', 'upcoming', 'upcoming']}
      />

      <nav aria-label="Main" className="mt-7">
        <ul className="space-y-1">
          {TABS.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-tile px-3 py-2.5 text-[15px] transition-colors duration-150 ${
                    isActive
                      ? 'bg-surface font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-line)]'
                      : 'text-ink-3 hover:bg-paper-2 hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 size-[7px] -translate-y-1/2 rounded-full bg-orange"
                      />
                    )}
                    <tab.icon size={18} strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
                    {tab.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        to="/dabbawala"
        className="group mt-6 flex items-center justify-between gap-2 border-t border-line pt-5 pr-1 text-[14px] font-semibold text-ink-3 transition-colors hover:text-ink"
      >
        Dabbawala demo
        <ArrowUpRight
          size={16}
          strokeWidth={2.2}
          aria-hidden="true"
          className="text-orange transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>

      <div className="mt-auto space-y-4 pt-8">
        <div className="rounded-tile border border-line bg-surface p-3.5">
          <span className="eyebrow">Prototype</span>
          <p className="mt-2 text-[12.5px] leading-snug text-quiet">
            Mock data only — no backend, no payments, no GPS.
          </p>
        </div>
        <p className="font-mono text-[10.5px] leading-snug tracking-[0.02em] text-faint">
          WESTERN LINE · KANDIVALI GROUP
        </p>
        <p className="text-[12px] font-semibold leading-snug text-ink-3">
          The network already exists. We are building the bridge to it.
        </p>
      </div>
    </aside>
  )
}
