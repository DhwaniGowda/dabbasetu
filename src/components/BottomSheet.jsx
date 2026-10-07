import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { SPRING } from './Reveal'

/** Bottom sheet on phones, centred sheet on desktop. One component, both. */
export default function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  titleId = 'setu-sheet-title',
}) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: '100%', opacity: 0.4 }}
            transition={reduce ? { duration: 0.15 } : SPRING}
            className="relative z-10 max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-sheet border border-line bg-surface px-5 pb-[calc(env(safe-area-inset-bottom,0px)+22px)] pt-3 shadow-sheet sm:mb-6 sm:max-w-[460px] sm:rounded-sheet sm:px-6 sm:pb-6 sm:pt-5"
          >
            <div
              aria-hidden="true"
              className="mx-auto mb-4 h-[5px] w-11 rounded-full bg-line-2 sm:hidden"
            />

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 id={titleId} className="display text-[27px] text-ink">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-2 text-[14px] leading-snug text-quiet">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-10 shrink-0 place-items-center rounded-full text-quiet transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5">{children}</div>
            {footer && <div className="mt-5 space-y-2.5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
