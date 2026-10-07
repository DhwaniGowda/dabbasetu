/**
 * Keyframe interpolation for the WebGL camera and the tiffin.
 *
 * Every key is anchored to a film position, so the object's whole journey
 * through the eight chapters is one continuous track rather than eight
 * unrelated scenes. Easing is applied *within* each segment, which gives the
 * camera its settle-and-move rhythm.
 */
export const lerp = (a, b, t) => a + (b - a) * t
export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
export const clamp01 = (v) => clamp(v, 0, 1)
export const smoothstep = (t) => t * t * (3 - 2 * t)

const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]

/**
 * Sample a keyframed track.
 * Keys: [{ f, pos?, rot?, scale?, opacity?, spread? }, …] sorted by f.
 * `spread` is the tiffin's layer separation, used once, mid-story.
 */
export function track(keys, f, out = {}) {
  const first = keys[0]
  if (f <= first.f) return assign(out, first, first)
  const last = keys[keys.length - 1]
  if (f >= last.f) return assign(out, last, last)

  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (f >= a.f && f <= b.f) {
      const span = b.f - a.f || 1
      const t = smoothstep(clamp01((f - a.f) / span))
      return assign(out, a, b, t)
    }
  }
  return assign(out, last, last)
}

function assign(out, a, b, t = 0) {
  out.pos = a.pos && b.pos ? lerp3(a.pos, b.pos, t) : (b.pos ?? a.pos ?? [0, 0, 0])
  out.rot = a.rot && b.rot ? lerp3(a.rot, b.rot, t) : (b.rot ?? a.rot ?? [0, 0, 0])
  out.scale = lerp(a.scale ?? 1, b.scale ?? 1, t)
  out.opacity = lerp(a.opacity ?? 1, b.opacity ?? 1, t)
  out.spread = lerp(a.spread ?? 0, b.spread ?? 0, t)
  return out
}

export const emptyState = () => ({
  pos: [0, 0, 0],
  rot: [0, 0, 0],
  scale: 1,
  opacity: 1,
  spread: 0,
})

/**
 * The tiffin's whole-screen journey, in film units (0 → 8).
 *
 * 0 prelude · 1 tiffin · 2 travel · 3 friction · 4 bridge
 * 5 product · 6 track · 7 delivery · 8 end
 */
export const TIFFIN_TRACK = [
  // Prelude: hidden, waiting far off stage while the railway line draws itself.
  { f: 0.0, pos: [0, -0.2, -9], rot: [0.2, -0.7, 0], scale: 1.0, opacity: 0 },
  { f: 0.62, pos: [0, -0.2, -9], rot: [0.2, -0.7, 0], scale: 1.0, opacity: 0 },
  // The word LUNCH reveals it: it arrives from the dark, enormous.
  { f: 0.95, pos: [0, 0, -7.4], rot: [0.06, -0.32, 0], scale: 1.5, opacity: 0.55 },
  { f: 1.0, pos: [0, 0, -7.2], rot: [0.05, -0.3, 0], scale: 1.55, opacity: 1 },
  // Slow push-in through chapter 1, layers still closed.
  { f: 1.9, pos: [0.1, -0.05, -2.3], rot: [0.02, 0.26, 0], scale: 1.32, opacity: 1 },
  // Chapter 2: pulled back and lowered onto the rail, then the world slides past.
  { f: 2.15, pos: [-0.18, -0.31, -1.15], rot: [0.08, -0.2, 0], scale: 0.78, opacity: 1 },
  { f: 2.55, pos: [0.1, -0.29, -0.95], rot: [0.06, 0.12, 0], scale: 0.78, opacity: 1 },
  { f: 2.85, pos: [-0.08, -0.31, -0.95], rot: [0.06, 0.44, 0], scale: 0.78, opacity: 1 },
  { f: 3.0, pos: [0.14, -0.29, -1.2], rot: [0.06, 0.72, 0], scale: 0.76, opacity: 1 },
  // Chapter 3: the machine stops. The tiffin drifts out of frame.
  { f: 3.3, pos: [1.6, -0.1, -3.2], rot: [0.06, 1.05, 0], scale: 0.62, opacity: 0 },
  { f: 4.6, pos: [0, 0, -9], rot: [0, 0, 0], scale: 1, opacity: 0 },
  // Chapter 5: back, small, sitting beside the product frame.
  { f: 5.05, pos: [-2.5, -0.28, -1.6], rot: [0.14, -0.5, 0], scale: 0.6, opacity: 0 },
  { f: 5.5, pos: [-2.3, -0.26, -1.3], rot: [0.12, -0.35, 0], scale: 0.68, opacity: 1 },
  { f: 5.98, pos: [-2.45, -0.3, -1.5], rot: [0.14, -0.62, 0], scale: 0.64, opacity: 0.9 },
  // Chapter 6: the four checkpoints. The layers open once to show the QR.
  { f: 6.1, pos: [-0.5, -0.31, -1.05], rot: [0.07, -0.22, 0], scale: 0.78, opacity: 1 },
  { f: 6.4, pos: [0.06, -0.29, -0.9], rot: [0.05, 0.16, 0], scale: 0.8, opacity: 1, spread: 0.2 },
  { f: 6.7, pos: [-0.06, -0.31, -0.9], rot: [0.05, 0.5, 0], scale: 0.8, opacity: 1, spread: 0 },
  { f: 6.98, pos: [0.1, -0.29, -1.05], rot: [0.05, 0.8, 0], scale: 0.78, opacity: 1 },
  // Chapter 7: it settles at the last node, then hands over to the mascot.
  { f: 7.3, pos: [0.2, -0.42, -1.8], rot: [0.02, 0.12, 0], scale: 0.9, opacity: 1 },
  { f: 7.8, pos: [0.7, -0.44, -2.4], rot: [0, -0.08, 0], scale: 0.84, opacity: 1 },
  { f: 8.0, pos: [1.0, -0.48, -3.0], rot: [0, -0.18, 0], scale: 0.78, opacity: 0 },
]

/**
 * Camera track. The viewer is directed, never free: a push-in, a lateral
 * track, a top-down look at the friction, then back down to the floor.
 */
export const CAMERA_TRACK = [
  { f: 0.0, pos: [0, 0, 6.4], rot: [0, 0, 0] },
  { f: 1.0, pos: [0, 0.05, 6.0], rot: [0.02, 0.02, 0] },
  { f: 1.9, pos: [0.15, 0.1, 2.9], rot: [-0.02, -0.05, 0] },
  { f: 2.4, pos: [0.2, 0.35, 4.6], rot: [-0.06, 0.02, 0] },
  { f: 3.0, pos: [-0.15, 0.4, 4.9], rot: [-0.06, -0.04, 0] },
  // Looking down at the crowded question field.
  { f: 3.6, pos: [0, 2.5, 3.3], rot: [-0.68, 0, 0] },
  // Back level, wide, for the gap with no bridge.
  { f: 4.15, pos: [0, 0.1, 7.4], rot: [0, 0, 0] },
  // Close on the bridge arch.
  { f: 4.85, pos: [0, 0.25, 4.2], rot: [-0.08, 0, 0] },
  { f: 5.3, pos: [0, 0.1, 6.2], rot: [0, 0, 0] },
  // Settle low for the tracking rail.
  { f: 6.4, pos: [0, 0.55, 4.4], rot: [-0.14, 0, 0] },
  { f: 7.2, pos: [0, 0.35, 4.9], rot: [-0.08, 0, 0] },
  { f: 8.0, pos: [0, 0.2, 5.6], rot: [-0.04, 0, 0] },
]
