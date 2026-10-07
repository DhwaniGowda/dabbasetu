# SETU — Mumbai's Dabba Connection

A presentation-quality frontend prototype of **SETU**, a digital layer that connects
Mumbai commuters with the dabbawala network that already runs their route.

It opens with a **cinematic landing film** at `/` — one continuous scroll-driven story
built from eight chapters, DOM typography and a persistent WebGL tiffin — and then
hands off into the product prototype at `/app`.

SETU does not cook food, does not employ riders and does not replace the dabbawala
network. It makes the existing network easier to reach.

> The network already exists. We are building the bridge to it.

**This is a prototype: there is no backend, no database, no auth, no API calls, no
Maps, no GPS, no camera and no payment gateway.** Everything is hardcoded demo data
and local React state. Refreshing the browser resets the demo — that is expected.

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

Production build:

```bash
npm run build
npm run preview
```

## The routes

| Screen | Route | What it shows |
| --- | --- | --- |
| **Landing film** | `/` | The eight-chapter cinematic introduction — see below |
| Welcome | `/app` | Charcoal brand hero, Western Line board, Kandivali → Lower Parel |
| Check your route | `/route` | Two locations, mock suggestions, simulated line check, "Route covered" |
| The carrier | `/match` | Santosh's Kandivali group, the morning run, timings |
| Office days | `/days` | Mon–Fri selector, per-lunch maths, presets |
| Plan + payment | `/plan` | Monthly ledger, mock UPI Autopay bottom sheet, "You're connected." |
| Today | `/journey` | Charcoal hero, railway timeline, pause tomorrow, get help |
| How tracking works | `/how-it-works` | The four QR checkpoints and what a missed scan looks like |
| Schedule | `/schedule` | Edit office days, pause a single day |
| Profile | `/profile` | Aarav, plan summary, manage list, About SETU |
| Dabbawala mode | `/dabbawala` | आजचे डबे — deliberately simpler carrier screen with a fake scan overlay |

Every screen also renders standalone, so you can deep-link to any route while
presenting.

**Today has one extra control.** The journey is the only part of the demo that moves,
so Today carries a small dashed "Demo · stage 01 / 03" strip with `Next scan` and
`Reset`. It walks the dabba from *on the train* → *off the train* → *delivered*, which
is what makes the delivered moment (and the dabbawala holding the tiffin) reachable
while presenting. Nothing is behind it except local state.

## The landing film

`/` is not a landing page. It is a short interactive film about the network, and it
ends by handing the visitor into the product.

It plays as **eight chapters on one scroll**, driven by a single Lenis + GSAP
ScrollTrigger timeline:

| # | Chapter | The beat |
| --- | --- | --- |
| 0 | Prelude | A departure board at 07:58, a railway line drawing itself, an abstract train crossing, then `MUMBAI / MOVES.`; the word `LUNCH` opens onto the tiffin |
| 1 | The tiffin | Giant type in the layer *behind* the WebGL canvas, so the steel tiffin passes in front of the words. The mascot's first appearance. Numbers as title cards, never stat boxes |
| 2 | The machine that isn't a machine | `IT ALREADY WORKS.` / `NO APP. NO GPS.` The world moves sideways while you scroll down: five station nodes slide past a fixed tiffin, easing to a stop at each |
| 3 | The friction | Movement stops. `GREAT SYSTEM. / HARD TO GET IN.`, then five real questions arriving from depth until the frame is crowded, then a hard cut to nothing |
| 4 | SETU | A single orange line travels across the gap, arches, and hands over to the real logo at matched geometry. Then `SETU.` and a lot of empty space |
| 5 | The digital journey | A device turns to face the viewer while the real SETU components play a choreographed sequence inside it — nothing to click |
| 6 | Track the dabba | Four QR checkpoints in WebGL, each flashing orange then settling green; `4 QUICK SCANS. / NO GPS NEEDED.` |
| 7 | Delivery | The node goes green, the mascot returns with the tiffin, and the two lines the story has been walking towards land: `THE NETWORK ALREADY EXISTS. / WE'RE BUILDING THE BRIDGE TO IT.` |

### How it is put together

- **One WebGL canvas for the whole film**, `position: fixed` at `z-index: 10`. DOM
  chapters place their content either *under* it (`z-index: 5`, where the giant type
  goes) or *over* it (`z-index: 20`). That layering is what lets the tiffin read as a
  single object travelling through one continuous world rather than one object per
  section. Neither the chapters nor any ancestor may gain a transform, filter or
  `z-index` from an animation, or the sandwich collapses.
- **The camera and the tiffin are keyframed against one film clock.** Each chapter
  reports how far it has crossed the viewport; those values sum into `story.film`
  (0 → 8) in `src/landing/story.js`. `src/landing/film.js` holds the tiffin and camera
  tracks, so chapter heights can change with the breakpoint without touching the 3D.
- **Scroll never re-renders React.** `story` is a plain mutable object written by
  ScrollTrigger and read inside `useFrame` and by the cursor. Only the nav tone and
  the compact flag are React state.
- **The tiffin is primitives and lathe profiles**, not a GLTF — there is no mesh
  decode on the critical path, and the painted `3-BO / 12·LP` code is a canvas
  texture. Lighting is a soft warm key, an orange reflected accent, a cream rim, and
  a `Lightformer` environment (no HDR file to fetch).
- **The mascot stays 2.5D.** He is the deck's PNG given depth by parallax, scale,
  blur and clipping. He is never turned into a 3D model.

### Performance

- The whole WebGL bundle is **code-split** behind the loader: `Landing` and `Scene`
  arrive as separate chunks, so first paint is typography.
- Adaptive DPR (`[1, 1.75]` desktop, `[1, 1.3]` on coarse pointers), one canvas for
  the entire page, lathe meshes of 40 segments, a 128 px environment cube rendered
  once (`frames={1}`), and no particle systems.
- rAF stops with the tab (`story.awake`), and the canvas unmounts completely when you
  leave for `/app`.
- A `SceneBoundary` means a missing or slow GPU cannot take the film down: the loader
  has a hard ceiling, and every chapter is DOM.

### Reduced motion

`prefers-reduced-motion` swaps the film for `StaticStory`: the same eight beats, the
same copy and the same assets as a plain readable column, with **no WebGL at all**.
The tiffin appears as the deck's own tiffin graphic. This is deliberately a separate
render path — absolutely positioned cinematic layers cannot degrade gracefully, and
the story has to work with no animation.

### Entering the product

`Check my route` and `Explore the app` (and the nav's `Enter SETU`) run a screen wipe
— the orange route line draws across, the screen washes to warm cream, the router
navigates at the peak, and the cream lifts onto the real SETU screen. The overlay
lives in `App` above `<Routes>`, so it survives the route change it is covering.
Under reduced motion the navigation is immediate.

## Demo data

One coherent story, identical on every screen:

- **Customer:** Aarav
- **Home:** Kandivali West · near station
- **Office:** Kamala Mills · Lower Parel
- **Route:** Western Line, Kandivali Group → Lower Parel
- **Carrier:** Santosh — morning pickup 09:00, desk by 12:30
- **Money:** ₹1,800 dabbawala fee + ₹149 SETU Plus = **₹1,949 / month**
- **Office days:** Tue · Wed · Thu (today is TUE · 24 SEP)

Payment runs monthly, so pausing a day never changes the fee — the copy says so
instead of implying a discount.

## Brand identity

The visual system is taken directly from the original SETU pitch deck: the site and
the deck are meant to read as one brand.

### Colour

These are the deck's own values, byte for byte.

| Token | Value | Meaning in the product |
| --- | --- | --- |
| `paper` | `#FAF7EF` | Warm cream — the default surface |
| `ink` | `#1A1A1A` | Charcoal — the other half of the identity, and all authority text |
| `surface` | `#FFFDF8` | Very light surface for the few real containers |
| `orange` | `#F97316` | **The** action colour: primary CTAs, the active route node, the current journey state, selected days |
| `orange-deep` | `#EA6812` | Orange hover / pressed |
| `orange-ink` | `#C2410C` | Burnt orange for orange **text on cream** (passes AA where `#F97316` would not) |
| `orange-tint` | `#FDE3CF` | Light orange surface |
| `green` | `#2F6B4F` | One meaning only: covered · confirmed · delivered |
| `quiet` | `#6B6259` | Warm grey for supporting text, timestamps, metadata |
| `line` | `#D9D0C1` | Light stone for borders, dividers, inactive rail segments |

Cream and charcoal carry most of the identity. Orange stays precious and deliberate —
no screen is orange. Blue, purple, cyan, cold greys, neon and SaaS gradients are gone.

**Dark regions are deliberate and few:** the Welcome hero, the Today hero, the About
SETU block on Profile, and the carrier-mode scan overlay. Everything else is cream.

### Typography

All four faces are self-hosted. **No webfont is fetched from a CDN**, so the prototype
still works offline.

| Face | Where it comes from | Used for |
| --- | --- | --- |
| **Big Shoulders Display Black** | `public/fonts/`, from the deck | Headlines, station names, all large numerals |
| **JetBrains Mono** | `public/fonts/`, from the deck | Transport micro labels: `WESTERN LINE`, `3-BO-12 · LP`, `12:20 ETA`, `.eyebrow` |
| **Manrope** (variable) | `@fontsource-variable/manrope` | Body copy and interface text |
| **Noto Sans Devanagari** (variable) | `@fontsource-variable/noto-sans-devanagari` | Marathi (आजचे डबे) |

Big Shoulders is a single black-weight file, so `@font-face` declares it across the
whole weight range — that stops the browser synthesising a fake bold on top of it.

### Assets

Everything under `public/assets/` is the **original artwork from the SETU pitch deck**,
extracted from `SETU_Pitch_Deck_Short.pptx` and trimmed to its alpha bounds. Nothing
here was redrawn, re-illustrated or substituted with a stock image.

| File | What it is |
| --- | --- |
| `setu-logo.png` | Horizontal SETU lockup for light backgrounds |
| `setu-logo-light.png` | Stacked cream lockup for charcoal backgrounds |
| `setu-mark.png` / `setu-mark-light.png` | The tiffin-bridge mark alone, both colourways |
| `setu-mascot.png` | The dabbawala running with a stack of tiffins |
| `setu-mascot-tiffin.png` | The dabbawala presenting a tiffin with his DELIVERED stamp |
| `setu-mascot-ride.png` | The dabbawala on his bicycle |
| `setu-mascot-lunch.png` | The dabbawala sitting down to his own lunch |
| `setu-mascot-face.png` | Head-and-cap crop |
| `setu-tiffin.png`, `setu-train.png`, `setu-qr.png` | Supporting deck graphics |

`public/favicon.png` is the cream mark on a charcoal tile, cropped from the logo.

### The dabbawala as a brand character

He is SETU's guide, not decoration, so he appears **five times** across the whole
experience — Welcome hero, route covered, payment success, delivered, About SETU — and
never as Santosh's photograph. Santosh is a real conceptual carrier; the mascot
represents the network.

`<Mascot pose="…" />` renders exactly one `<img>` with `object-fit: contain`, so the
character can never be stretched. Size him by giving the wrapper a height. His only
motion is a 14 px fade-and-rise on entry and a 6 px lift on desktop hover; everything
is disabled under `prefers-reduced-motion`.

### The railway system

`RouteLine` is the signature component, in three forms:

- `RouteLine` — the working line. Vertical is a timetable (time · node · station);
  horizontal is the departure board. Completed segments are green, the segment into
  the current station is orange, the rest is a thin charcoal rail.
- `RailStrip` — the pure deck motif, `────────○────────●────────○────────`, used
  decoratively behind the Welcome hero.
- `RailRule` — the same rail as section furniture, used only where the rail *means*
  something (the route board, today's journey, the carrier's run, a missed scan,
  office days as stations).

Dabbawala codes (`3-BO-12 · LP`, `K4-07`) are rendered as stamped mono plates.

## Structure

```
public/
  assets/               original SETU artwork, straight from the pitch deck
  fonts/                the deck's display + mono faces (OFL)
  favicon.png
src/
  data/demo.js          single source of demo truth (incl. the three journey stages)
  state/DemoState.jsx   days, pausing, plan status, demo journey stage
  lib/                  rupee formatting, day labels, the screen-wipe channel
  components/           AppShell, Logo, Mascot, Button, RouteLine (+ RailStrip, Node),
                        StatusPill/CodePlate, DaySelector, JourneyTimeline,
                        LocationField, BottomSheet, Toast, DabbawalaCard, AsideCards,
                        BottomNav, DesktopRail, PageParts, Reveal, TrainLoader,
                        ScreenWipe
  screens/              one file per product screen
  index.css             design tokens (@theme) + @font-face + base + components
  landing/              the film (own lazy chunk, own stylesheet)
    Landing.jsx         page shell: loader, nav, cursor, canvas, chapter order
    story.js            the film clock + chapter registry
    film.js             tiffin and camera keyframe tracks
    useStory.js         Lenis + ScrollTrigger wiring, useScene, reduced-motion path
    Loader.jsx  Nav.jsx  Cursor.jsx  ChapterShell.jsx  StaticStory.jsx  assets.jsx
    chapters/           Ch0Prelude … Ch7Delivery, one file per chapter
    webgl/              Scene (canvas + lights + camera rig), Tiffin, Rail,
                        steel (procedural textures), SceneBoundary
```

Motion is Framer Motion only: 150–620 ms fades and short rises, a spring bottom sheet,
a train travelling the line while a route is checked. Every looping animation is
disabled under `prefers-reduced-motion`.

## Responsive behaviour

Art-directed per breakpoint, not just resized.

- **Landing film:** the poster type is sized with `min(vw, vh)` so it fills the width
  on a wide screen and stays inside the frame on a short one. Phone: vertical film
  language, tighter chapters, the mascot in the corner rather than beside the words.
  Tablet and laptop: the same framing with fewer overlapping objects. Desktop 1440+:
  the full compositions.
- **Product, phones (≈375–430 px):** bottom tab bar whose active tab is a station node
  on the rail, 48 px+ touch targets, sticky primary CTAs, safe-area padding, mascot
  capped at 150–224 px and kept clear of the CTAs.
- **Product, tablet (768 px):** single column, larger hero mascot (300 px), wider
  timelines.
- **Product, desktop (≥1024 px):** left navigation rail, primary content column, sticky
  contextual column (trip summary, live route panel, demo path index). Max content
  width 1180 px so nothing stretches.

Verified at 375, 430, 768, 1024, 1440 and 1920 px, in both the film and the
reduced-motion story: no horizontal overflow (`scrollWidth === clientWidth`) and no
console errors. The product screens were additionally verified at all five original
breakpoints.

## Tech

React 19 · Vite · Tailwind CSS v4 (CSS-first tokens) · Framer Motion (product) ·
**Three.js + React Three Fiber + drei** (the film's canvas) · **GSAP + ScrollTrigger**
(choreography) · **Lenis** (smooth scroll, landing only) · Lucide React · React Router ·
Manrope + Noto Sans Devanagari via `@fontsource`.

The product screens deliberately do **not** depend on three, GSAP or Lenis — Lenis is
created on the landing and destroyed on unmount, so `/app` keeps native scrolling.
