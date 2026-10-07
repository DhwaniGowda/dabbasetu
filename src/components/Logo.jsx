/**
 * The original SETU logo, taken from the pitch deck.
 *
 * These are the supplied assets — never redrawn, never rebuilt out of
 * plain text. The deck ships two colourways, so the API is explicit
 * about which one a surface needs.
 */
const SETU_MARK = {
  dark: { src: '/assets/setu-mark.png', width: 230, height: 142 },
  light: { src: '/assets/setu-mark-light.png', width: 607, height: 340 },
}

const SETU_LOCKUP = {
  /* Horizontal charcoal lockup — light backgrounds. */
  horizontal: { src: '/assets/setu-logo.png', width: 534, height: 142 },
  /* Stacked cream lockup — charcoal backgrounds. */
  stacked: { src: '/assets/setu-logo-light.png', width: 718, height: 535 },
}

const ALT = 'SETU — Mumbai’s Dabba Connection'

/** Horizontal lockup. Size by height; the width follows the asset. */
export default function Logo({ height = 28, className = '', alt = ALT }) {
  const art = SETU_LOCKUP.horizontal
  return (
    <img
      src={art.src}
      alt={alt}
      width={art.width}
      height={art.height}
      style={{ height }}
      className={`w-auto select-none ${className}`}
    />
  )
}

/** Cream stacked lockup for charcoal surfaces. Size by width. */
export function LogoStacked({ width = 200, className = '', alt = ALT }) {
  const art = SETU_LOCKUP.stacked
  return (
    <img
      src={art.src}
      alt={alt}
      width={art.width}
      height={art.height}
      style={{ width }}
      className={`h-auto select-none ${className}`}
    />
  )
}

/**
 * The mark on its own — for tight spaces like the orange carrier header.
 * `tone="light"` is the cream version used on charcoal and orange.
 */
export function LogoMark({ height = 26, tone = 'dark', className = '', alt = ALT }) {
  const art = tone === 'light' ? SETU_MARK.light : SETU_MARK.dark
  return (
    <img
      src={art.src}
      alt={alt}
      width={art.width}
      height={art.height}
      style={{ height }}
      className={`w-auto select-none ${className}`}
    />
  )
}
