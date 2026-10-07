/**
 * The original SETU artwork, straight from the pitch deck. Nothing here is
 * redrawn or substituted. Sizes are the real intrinsic sizes of the files, so
 * the browser can reserve the right box before they load.
 */
export const ART = {
  mascotRunning: { src: '/assets/setu-mascot.png', w: 900, h: 819 },
  mascotTiffin: { src: '/assets/setu-mascot-tiffin.png', w: 608, h: 900 },
  mascotRide: { src: '/assets/setu-mascot-ride.png', w: 269, h: 317 },
  mascotLunch: { src: '/assets/setu-mascot-lunch.png', w: 231, h: 284 },
  mascotFace: { src: '/assets/setu-mascot-face.png', w: 127, h: 175 },
  logoLight: { src: '/assets/setu-logo-light.png', w: 718, h: 535 },
  logoDark: { src: '/assets/setu-logo.png', w: 534, h: 142 },
  markLight: { src: '/assets/setu-mark-light.png', w: 607, h: 340 },
  markDark: { src: '/assets/setu-mark.png', w: 230, h: 142 },
  tiffin: { src: '/assets/setu-tiffin.png', w: 376, h: 520 },
  train: { src: '/assets/setu-train.png', w: 640, h: 383 },
  qr: { src: '/assets/setu-qr.png', w: 480, h: 480 },
}

/**
 * The mascot as a 2.5D layer: a flat PNG that is given depth by parallax,
 * scale, blur and clipping. He is never turned into a low-quality 3D model.
 */
export function Mascot({ pose = 'mascotRunning', className = '', style, eager = false }) {
  const art = ART[pose]
  return (
    <img
      src={art.src}
      alt=""
      aria-hidden="true"
      width={art.w}
      height={art.h}
      draggable="false"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={style}
      className={`pointer-events-none select-none object-contain object-bottom ${className}`}
    />
  )
}
