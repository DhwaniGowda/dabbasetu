import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from './Reveal'

/**
 * The SETU dabbawala — the original character asset from the pitch deck.
 *
 * Exact source files, never redrawn, never re-illustrated. One <img> with
 * `object-fit: contain`, so the character can never be stretched.
 * Size him by giving the wrapper a height (and let the width follow).
 */
const MASCOTS = {
  running: { src: '/assets/setu-mascot.png', width: 900, height: 819 },
  tiffin: { src: '/assets/setu-mascot-tiffin.png', width: 608, height: 900 },
  ride: { src: '/assets/setu-mascot-ride.png', width: 269, height: 317 },
  lunch: { src: '/assets/setu-mascot-lunch.png', width: 231, height: 284 },
  face: { src: '/assets/setu-mascot-face.png', width: 127, height: 175 },
}


export default function Mascot({
  pose = 'running',
  alt = '',
  mirror = false,
  delay = 0,
  lift = true,
  className = '',
  imgClassName = '',
}) {
  const reduce = useReducedMotion()
  const art = MASCOTS[pose] ?? MASCOTS.running

  return (
    <motion.span
      className={`block ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduce ? 0.2 : 0.62,
        ease: EASE,
        delay: reduce ? 0 : delay,
      }}
    >
      <img
        src={art.src}
        alt={alt}
        aria-hidden={alt ? undefined : 'true'}
        width={art.width}
        height={art.height}
        decoding="async"
        draggable="false"
        className={`block h-full w-auto max-w-full select-none object-contain object-bottom ${
          lift
            ? 'transition-transform duration-500 ease-[var(--ease-setu)] motion-safe:md:hover:-translate-y-1.5'
            : ''
        } ${mirror ? '-scale-x-100' : ''} ${imgClassName}`}
      />
    </motion.span>
  )
}
