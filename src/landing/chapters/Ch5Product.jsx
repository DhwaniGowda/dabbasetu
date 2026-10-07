import { useRef } from 'react'
import gsap from 'gsap'
import { MaskLine, Poster, Stage, Tag } from '../ChapterShell'
import { ART } from '../assets.jsx'
import { useScene } from '../useStory'
import { CHAPTERS } from '../story'
import RouteLine from '../../components/RouteLine'
import { CodePlate, StatusPill } from '../../components/StatusPill'
import Ledger, { LedgerRow } from '../../components/Ledger'
import { route } from '../../data/demo'

const HEIGHT = CHAPTERS[5].height

const DAYS = [
  { id: 'mon', short: 'MON', date: '23', on: false },
  { id: 'tue', short: 'TUE', date: '24', on: true },
  { id: 'wed', short: 'WED', date: '25', on: true },
  { id: 'thu', short: 'THU', date: '26', on: true },
  { id: 'fri', short: 'FRI', date: '27', on: false },
]

/**
 * CHAPTER 5 — THE DIGITAL JOURNEY
 *
 * The product, choreographed rather than clicked: a device in perspective turns
 * to face the viewer while the real SETU components play their own sequence
 * inside it. The frame is non-interactive on purpose — nothing here asks the
 * visitor to do anything. Its contents are described for screen readers.
 */
export default function Ch5Product({ enabled }) {
  const ref = useRef(null)

  useScene(
    ref,
    (q) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
        },
      })

      tl.fromTo(q('[data-head] [data-mask-line]'), { yPercent: 118 }, { yPercent: 0, duration: 0.07, ease: 'power3.out' }, 0)
      tl.fromTo(q('[data-tag]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.04)

      // The device turns to face us.
      tl.fromTo(
        q('[data-device]'),
        { rotationY: 17, rotationX: 5, scale: 0.9, y: 40 },
        { rotationY: 0, rotationX: 0, scale: 1, y: 0, duration: 0.16, ease: 'power2.inOut' },
        0.02,
      )

      // Four screens inside it.
      const stages = ['a', 'b', 'c', 'd']
      stages.forEach((stage, i) => {
        const at = 0.2 + i * 0.19
        if (i > 0) {
          tl.fromTo(q(`[data-stage="${stage}"]`), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, at)
        }
        if (i < stages.length - 1) {
          tl.to(q(`[data-stage="${stage}"]`), { autoAlpha: 0, y: -22, duration: 0.05 }, at + 0.13)
        }
      })

      // The route draws itself once the confirmation lands.
      tl.fromTo(q('[data-inside-rail]'), { scaleX: 0 }, { scaleX: 1, duration: 0.1 }, 0.39)
      // The chosen days stamp themselves.
      tl.fromTo(q('[data-day-on]'), { scale: 0.86, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 0.05, stagger: 0.03 }, 0.6)
      // And the tiffin tag ends up in the app.
      tl.fromTo(
        q('[data-qr]'),
        { autoAlpha: 0, scale: 0.7, rotationY: 45 },
        { autoAlpha: 1, scale: 1, rotationY: 0, duration: 0.09, ease: 'power2.out' },
        0.84,
      )
    },
    enabled,
  )

  return (
    <Stage ref={ref} id="product" height={HEIGHT} tone="paper" className="bg-paper">
      <div className="relative h-full w-full px-[6vw]">
        <div className="absolute inset-x-[6vw] top-[9vh] text-center">
          <Tag data-tag className="opacity-0 text-quiet">
            The product
          </Tag>
          <Poster data-head vw={7.4} vh={9.5} className="mt-3 text-ink">
            <MaskLine>THE SAME NETWORK, NOW DIGITAL.</MaskLine>
          </Poster>
        </div>

        {/* Device */}
        <div className="absolute inset-x-0 top-[26vh] flex justify-center [perspective:1500px]">
          <div
            data-device
            className="relative w-[min(320px,68vw)]"
            style={{ aspectRatio: '9 / 19', transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[34px] border border-line bg-surface shadow-[0_50px_110px_-50px_rgba(26,26,26,0.5)]">
              <div className="mx-auto mt-2 h-[5px] w-14 rounded-full bg-paper-3" />

              <div className="relative h-[calc(100%-1.5rem)] px-4 pb-5 pt-4">
                {/* A — route check */}
                <div data-stage="a" className="absolute inset-x-4 top-4">
                  <Tag className="text-quiet">Step 01 · Route check</Tag>
                  <p className="display mt-2 text-[19px] leading-[1.05] text-ink">
                    Where does your dabba travel?
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      { label: 'Home', value: 'Kandivali West', note: 'near station' },
                      { label: 'Office', value: 'Kamala Mills', note: 'Lower Parel' },
                    ].map((field) => (
                      <div key={field.label} className="rounded-tile border border-line bg-paper px-3 py-2">
                        <Tag className="text-faint">{field.label}</Tag>
                        <p className="mt-1 text-[13px] font-semibold leading-tight text-ink">
                          {field.value}
                        </p>
                        <p className="text-[11.5px] leading-tight text-quiet">{field.note}</p>
                      </div>
                    ))}
                  </div>
                  <span className="mt-3 flex h-9 w-full items-center justify-center rounded-tile bg-ink text-[12.5px] font-semibold text-paper">
                    Check route
                  </span>
                </div>

                {/* B — route covered */}
                <div data-stage="b" className="absolute inset-x-4 top-4 opacity-0">
                  <StatusPill tone="covered" dot>
                    Route covered
                  </StatusPill>
                  <p className="display mt-3 text-[26px] leading-none text-ink">Western Line</p>
                  <div className="mt-4 origin-left" data-inside-rail>
                    <RouteLine orientation="horizontal" stops={route.stops} />
                  </div>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-3">
                    <span className="grid size-8 place-items-center rounded-[9px] bg-ink font-display text-[14px] text-paper">
                      S
                    </span>
                    <span className="min-w-0 flex-1 text-[12.5px] font-semibold text-ink">
                      Santosh · Kandivali group
                    </span>
                    <CodePlate>K4-07</CodePlate>
                  </div>
                </div>

                {/* C — office days */}
                <div data-stage="c" className="absolute inset-x-4 top-4 opacity-0">
                  <Tag className="text-quiet">Step 03 · Office days</Tag>
                  <p className="display mt-2 text-[19px] leading-[1.05] text-ink">
                    Which days are you in?
                  </p>
                  <div className="mt-4 grid grid-cols-5 gap-1.5">
                    {DAYS.map((day) => (
                      <span
                        key={day.id}
                        {...(day.on ? { 'data-day-on': '' } : {})}
                        className={`flex flex-col items-center gap-1 rounded-tile border px-0.5 py-2 ${
                          day.on ? 'border-orange bg-orange text-ink' : 'border-line bg-paper text-ink-3'
                        }`}
                      >
                        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.08em]">
                          {day.short}
                        </span>
                        <span className="numeric text-[17px] leading-none">{day.date}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-[12px] leading-snug text-quiet">
                    Three office days. ₹193 per lunch on a ₹1,800 dabbawala fee.
                  </p>
                </div>

                {/* D — connected */}
                <div data-stage="d" className="absolute inset-x-4 top-4 opacity-0">
                  <span className="grid size-11 place-items-center rounded-full bg-green text-paper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="display mt-3 text-[30px] leading-none text-ink">
                    You’re connected.
                  </p>
                  <div className="mt-4">
                    <Ledger>
                      <LedgerRow label="Dabbawala" note="Santosh · in full" value="₹1,800" />
                      <LedgerRow label="SETU Plus" note="Route, scans, pausing" value="₹149" />
                    </Ledger>
                    <div className="flex items-end justify-between gap-3 border-t border-ink pt-3">
                      <Tag className="text-ink">Total</Tag>
                      <span className="numeric text-[26px] leading-none text-ink">₹1,949</span>
                    </div>
                  </div>
                  <img
                    data-qr
                    src={ART.qr.src}
                    alt=""
                    aria-hidden="true"
                    width={ART.qr.w}
                    height={ART.qr.h}
                    className="mt-4 h-16 w-16 opacity-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="absolute inset-x-[6vw] bottom-[7vh] mx-auto max-w-[40ch] text-center text-[12.5px] leading-snug text-quiet">
          Both sides already want each other. SETU is the part in between.
        </p>

        {/* Text equivalent for the choreographed screen sequence. */}
        <p className="sr-only">
          The SETU app: enter a home and an office, check the route, see that the Western Line covers
          both, pick three office days, and pay ₹1,949 a month — ₹1,800 to the dabbawala and ₹149 to
          SETU Plus.
        </p>
      </div>
    </Stage>
  )
}
