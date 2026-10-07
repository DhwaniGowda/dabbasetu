import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, Pause } from 'lucide-react'
import { EASE } from './Reveal'

const ToastContext = createContext(() => {})

export const useToast = () => useContext(ToastContext)

const TONES = {
  ink: { body: 'bg-ink text-paper', chip: 'bg-green/30 text-green-tint', Icon: Check },
  pause: { body: 'bg-ink text-paper', chip: 'bg-orange/30 text-orange-tint', Icon: Pause },
  note: { body: 'bg-ink text-paper', chip: 'bg-paper/20 text-paper/80', Icon: Info },
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])

  const push = useCallback((message, options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setItems((prev) => [...prev, { id, message, tone: options.tone ?? 'ink' }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, options.duration ?? 3400)
  }, [])

  const value = useMemo(() => push, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+92px)] z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-8"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const tone = TONES[item.tone] ?? TONES.ink
            const { Icon } = tone
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.26, ease: EASE }}
                className={`pointer-events-auto flex w-fit max-w-[min(92vw,26rem)] items-center gap-3 rounded-tile px-4 py-3 text-[14px] font-medium leading-snug shadow-lift ${tone.body}`}
              >
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full ${tone.chip}`}
                >
                  <Icon size={13} strokeWidth={3} aria-hidden="true" />
                </span>
                <span>{item.message}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
