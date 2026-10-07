import { motion, useReducedMotion } from 'framer-motion'

export const EASE = [0.22, 0.61, 0.36, 1]
export const SPRING = { type: 'spring', stiffness: 420, damping: 42, mass: 0.9 }

/** Fade + short rise. The only entrance motion in the product. */
export default function Reveal({ children, delay = 0, y = 12, className = '', ...rest }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      {...rest}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.18 : 0.42, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}
