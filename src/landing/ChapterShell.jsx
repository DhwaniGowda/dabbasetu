import { forwardRef } from 'react'

/**
 * A tall chapter with a full-viewport sticky stage.
 *
 * `under` is the layer that sits BEHIND the WebGL canvas — that is where the
 * giant type goes when the tiffin has to pass in front of it. It can only work
 * because neither the chapter nor any ancestor creates a stacking context
 * other than the two explicit z-indexes below, so the fixed canvas (z-10) lands
 * exactly between them.
 *
 * Nothing here may gain a transform/opacity/z-index from an animation, or the
 * layer sandwich collapses.
 */
export const Stage = forwardRef(function Stage(
  { id, height, tone = 'ink', under, className = '', stageClassName = '', children },
  ref,
) {
  return (
    <section
      ref={ref}
      data-chapter={id}
      data-tone={tone}
      style={{ height: `${height}vh` }}
      className={`relative ${className}`}
    >
      {under ? <div className="story-under">{under}</div> : null}
      {/* Transparent on purpose: an opaque stage would paint over the WebGL
          canvas and the tiffin would disappear behind it. Chapter colour goes on
          the section, which sits below the canvas. */}
      <div
        className={`sticky top-0 z-20 flex h-dvh items-center justify-center overflow-hidden ${stageClassName}`}
      >
        {children}
      </div>
    </section>
  )
})

/**
 * A tall chapter that simply flows — used where content has to accumulate
 * (the question pile, one sentence per viewport at the end).
 */
export const Flow = forwardRef(function Flow(
  { id, height, tone = 'ink', className = '', children },
  ref,
) {
  return (
    <section
      ref={ref}
      data-chapter={id}
      data-tone={tone}
      style={{ height: `${height}vh` }}
      className={`relative z-20 ${className}`}
    >
      {children}
    </section>
  )
})

/** Inline masked line, ready for a GSAP yPercent reveal. */
export function MaskLine({ children, className = '', ...rest }) {
  return (
    <span className={`mask ${className}`} {...rest}>
      <span data-mask-line>{children}</span>
    </span>
  )
}

/**
 * A poster word. `vw` and `vh` are both given so the type can fill the width on
 * a wide screen and still be held inside the frame on a short one — which is
 * how the type is allowed to "leave the viewport" without clipping badly.
 */
export function Poster({ children, vw = 20, vh = 28, className = '', style, ...rest }) {
  return (
    <span
      className={`display block ${className}`}
      style={{ fontSize: `min(${vw}vw, ${vh}vh)`, lineHeight: 0.84, ...style }}
      {...rest}
    >
      {children}
    </span>
  )
}

/** Small transport micro label, matching the product's own mono tags. */
export function Tag({ children, className = '' }) {
  return (
    <span
      className={`font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] ${className}`}
    >
      {children}
    </span>
  )
}
