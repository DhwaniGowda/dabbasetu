/**
 * The story clock.
 *
 * ScrollTrigger writes into this object on every frame; the WebGL scene, the
 * cursor and the nav read out of it. It is a plain mutable object on purpose —
 * scrolling must never trigger a React re-render, or the whole film drops
 * frames.
 */
export const CHAPTERS = [
  { id: 'prelude', tone: 'ink', height: 220 },
  { id: 'tiffin', tone: 'ink', height: 340 },
  { id: 'travel', tone: 'paper', height: 420 },
  { id: 'friction', tone: 'ink', height: 320 },
  { id: 'bridge', tone: 'ink', height: 300 },
  { id: 'product', tone: 'paper', height: 420 },
  { id: 'track', tone: 'ink', height: 400 },
  { id: 'delivery', tone: 'paper', height: 320 },
]

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id)

export const story = {
  /** 0..1 across the whole document */
  progress: 0,
  /** 0..CHAPTERS.length — the film position the 3D scene is keyed to */
  film: 0,
  /** per-chapter crossing progress, 0..1 */
  chapters: Object.fromEntries(CHAPTERS.map((c) => [c.id, 0])),
  /** normalised pointer, -1..1 */
  pointer: { x: 0, y: 0 },
  /** viewport in pixels */
  viewport: { w: 0, h: 0 },
  /** false when reduced motion is on: the scene holds a single still frame */
  static: false,
  /** 0 disables all WebGL animation (tab hidden, landing offscreen) */
  awake: 1,
  /** scroll is held still while the loader is up */
  locked: true,
  /** true on coarse pointers / narrow screens — art direction + perf switch */
  compact: false,
  /** the chapter nearest the middle of the viewport, for the nav */
  current: 0,
}

/**
 * Film position from the per-chapter crossing values.
 *
 * Chapter i owns the film range [i, i+1]. We walk forwards and stop at the
 * first chapter that has not finished, so the one-viewport overlap between
 * adjacent chapters can never push the total backwards. This keeps the camera
 * continuous no matter how tall any chapter happens to be at a given
 * breakpoint.
 */
export function computeFilm() {
  if (story.static) return 1.45
  let index = 0
  for (let i = 0; i < CHAPTER_IDS.length; i++) {
    const p = story.chapters[CHAPTER_IDS[i]]
    index = i
    if (p < 1) return i + p
  }
  return index + 1
}

/** Recompute the derived values. Call after any chapter progress changes. */
export function refreshFilm() {
  story.film = computeFilm()
  story.current = Math.min(CHAPTERS.length - 1, Math.max(0, Math.round(story.film - 0.5)))
}
