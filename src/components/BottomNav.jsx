import { NavLink } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, Home, Route, User } from 'lucide-react'

export const TABS = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/journey', label: 'Journey', icon: Route },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/profile', label: 'Profile', icon: User },
]

/**
 * Phone navigation. Cream bar, stone hairline on top, and the active tab
 * is a station node sitting on that rail — no floating pills.
 */
export default function BottomNav() {
  const reduce = useReducedMotion()

  return (
    <nav
      aria-label="Main"
      className="pad-safe-b fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper lg:hidden"
    >
      <ul className="mx-auto grid max-w-[520px] grid-cols-4">
        {TABS.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className="relative flex h-16 flex-col items-center justify-center gap-1.5 transition-colors"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="tab-node"
                      aria-hidden="true"
                      className="absolute -top-[4px] left-1/2 size-[7px] -translate-x-1/2 rounded-full bg-orange"
                      transition={
                        reduce ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 38 }
                      }
                    />
                  )}
                  <tab.icon
                    size={21}
                    strokeWidth={isActive ? 2.4 : 1.9}
                    aria-hidden="true"
                    className={isActive ? 'text-ink' : 'text-quiet'}
                  />
                  <span
                    className={`font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] ${
                      isActive ? 'text-ink' : 'text-quiet'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
