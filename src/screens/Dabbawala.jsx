import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Check, QrCode, Wifi, WifiOff } from 'lucide-react'
import { CodePlate } from '../components/StatusPill'
import { EASE, SPRING } from '../components/Reveal'
import Logo from '../components/Logo'
import { dabbawalaQueue, statusCopy } from '../data/demo'

const STATUS_TONE = {
  green: 'text-green',
  quiet: 'text-quiet',
  faint: 'text-faint',
}

/**
 * The carrier's own screen. Deliberately not the consumer product:
 * orange header, cream body, charcoal being the only ink, and one huge
 * scan control. Fast, obvious, rugged.
 */
export default function Dabbawala() {
  const reduce = useReducedMotion()
  const [offline, setOffline] = useState(true)
  const [queued, setQueued] = useState(3)
  const [scanned, setScanned] = useState(12)
  const [queue, setQueue] = useState(dabbawalaQueue)
  const [stage, setStage] = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const startScan = () => {
    setStage('framing')
    timers.current.push(
      window.setTimeout(() => {
        setStage(offline ? 'queued' : 'saved')
        timers.current.push(
          window.setTimeout(() => {
            setStage(null)
            setScanned((prev) => prev + 1)
            setQueue((prev) =>
              prev.map((item) => (item.status === 'pending' ? { ...item, status: 'ready' } : item)),
            )
            if (offline) setQueued((prev) => prev + 1)
          }, 1500),
        )
      }, 1100),
    )
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto w-full max-w-[560px] pb-44 lg:border-x lg:border-line">
        {/* Orange header */}
        <header className="bg-orange text-ink">
          <div className="px-5 pb-6 pt-5 lg:px-7">
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/app"
                className="-ml-2 flex h-11 items-center gap-1.5 rounded-[10px] px-2 text-[14px] font-semibold text-ink/75 transition-colors hover:text-ink"
              >
                <ArrowLeft size={17} strokeWidth={2.4} aria-hidden="true" />
                Home
              </Link>

              <div
                role="group"
                aria-label="Connection mode"
                className="flex gap-1 rounded-[10px] border border-ink/25 p-1"
              >
                <ModeButton active={!offline} onClick={() => setOffline(false)} label="Online" />
                <ModeButton active={offline} onClick={() => setOffline(true)} label="Offline" />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-6">
              <div>
                <h1 className="display text-[clamp(3.4rem,20vw,5rem)] leading-[0.78] text-ink">
                  17
                </h1>
                <p className="mt-3 font-deva text-[16px] leading-snug text-ink/75">आजचे डबे</p>
              </div>
              <div className="pb-1 text-right">
                <p className="eyebrow text-ink/70">Today</p>
                <p className="numeric mt-2 text-[15px] leading-none text-ink">
                  {scanned} scanned · {queued} queued
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Cream body */}
        <div className="px-5 pt-5 lg:px-7">
          <div className="flex items-center justify-between gap-4 border-b border-ink pb-3">
            <span className="eyebrow text-ink">Kandivali group</span>
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-quiet">
              WESTERN LINE → LOWER PAREL
            </span>
          </div>

          <ul className="mt-1">
            {queue.map((item) => {
              const status = statusCopy[item.status]
              const ready = item.status === 'ready'
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-4 border-b border-line py-4"
                  style={{ minHeight: 76 }}
                >
                  <span
                    aria-hidden="true"
                    className={`grid size-12 shrink-0 place-items-center rounded-tile border-2 ${
                      ready
                        ? 'border-green bg-green text-paper'
                        : item.status === 'paused'
                          ? 'border-dashed border-line-2 text-faint'
                          : 'border-line-2 text-faint'
                    }`}
                  >
                    {ready ? (
                      <Check size={22} strokeWidth={3} />
                    ) : (
                      <span className="size-3 rounded-full border-2 border-current" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2.5">
                      <CodePlate tone="outline">{item.code}</CodePlate>
                      <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-quiet">
                        {item.hub}
                      </span>
                    </span>
                    <span className="mt-2 block truncate font-deva text-[15px] leading-snug text-ink-2">
                      {item.address}
                    </span>
                    <span
                      className={`mt-1.5 flex items-center gap-2 text-[13.5px] font-semibold ${
                        STATUS_TONE[status.tone]
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`size-2 shrink-0 rounded-full ${
                          ready ? 'bg-green' : item.status === 'paused' ? 'bg-line-2' : 'bg-line'
                        }`}
                      />
                      <span className="font-deva">{status.mr}</span>
                      <span className="text-faint">·</span>
                      <span>{status.en}</span>
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>

          <p className="mt-6 text-[13px] leading-snug text-quiet">
            5 of 17 dabbas in this demo. Scans queue while offline and sync when the network
            returns.
          </p>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
            <Logo height={24} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-faint">
              Carrier mode
            </span>
          </div>
        </div>
      </div>

      {/* Rugged action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/96 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[560px] px-5 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-4 lg:px-7">
          <button
            type="button"
            data-surface="ink"
            onClick={startScan}
            aria-label="Scan a dabba QR code"
            className="flex h-[86px] w-full items-center justify-center gap-4 rounded-panel bg-ink text-paper transition-transform duration-150 active:scale-[0.99] motion-reduce:active:scale-100"
          >
            <QrCode size={30} strokeWidth={2.2} aria-hidden="true" className="text-orange" />
            <span className="font-deva text-[27px] font-semibold leading-none text-paper">स्कॅन</span>
            <span className="font-display text-[26px] font-semibold uppercase leading-none tracking-[0.18em] text-paper">
              Scan
            </span>
          </button>

          <div className="mt-3.5 flex items-center justify-between gap-4">
            <button
              type="button"
              className="flex h-11 items-center gap-2 text-[14px] font-semibold text-ink-3 transition-colors hover:text-ink"
            >
              <AlertTriangle size={15} strokeWidth={2.2} aria-hidden="true" />
              Report problem
            </button>
            <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-quiet">
              {offline ? (
                <WifiOff size={14} strokeWidth={2.2} aria-hidden="true" />
              ) : (
                <Wifi size={14} strokeWidth={2.2} aria-hidden="true" />
              )}
              {offline ? `Offline · ${queued} queued` : 'Online · synced'}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {stage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            data-surface="ink"
            className="fixed inset-0 z-50 grid place-items-center bg-ink px-7"
          >
            <div className="w-full max-w-[340px] text-center">
              {stage === 'framing' ? (
                <>
                  <p className="font-deva text-[15px] text-paper/70">डब्यावरील QR फ्रेम करा</p>
                  <p className="eyebrow mt-2 text-paper/45">Framing the QR</p>

                  <div className="relative mx-auto mt-7 grid size-[240px] place-items-center">
                    {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(
                      (position) => (
                        <span
                          key={position}
                          aria-hidden="true"
                          className={`absolute ${position} size-11 rounded-[6px] border-orange`}
                          style={{
                            borderTopWidth: position.includes('top') ? 4 : 0,
                            borderBottomWidth: position.includes('bottom') ? 4 : 0,
                            borderLeftWidth: position.includes('left') ? 4 : 0,
                            borderRightWidth: position.includes('right') ? 4 : 0,
                          }}
                        />
                      ),
                    )}

                    {!reduce && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-x-3 h-[3px] rounded-full bg-orange/80"
                        initial={{ top: 12 }}
                        animate={{ top: 216 }}
                        transition={{ duration: 1.1, ease: 'easeInOut' }}
                      />
                    )}

                    <span className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-paper/55">
                      3-BO-19 · LP
                    </span>
                  </div>

                  <p className="mt-7 font-mono text-[10.5px] tracking-[0.04em] text-paper/40">
                    DEMO OVERLAY — NO CAMERA IS USED
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduce ? { duration: 0.15 } : SPRING}
                >
                  <span className="mx-auto grid size-[72px] place-items-center rounded-full bg-green text-paper">
                    <Check size={38} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <p className="mt-6 font-deva text-[22px] font-semibold leading-none text-paper">
                    {stage === 'queued' ? 'ऑफलाइन सेव्ह झाले' : 'स्कॅन सेव्ह झाले'}
                  </p>
                  <p className="mt-3 text-[16px] font-semibold text-paper">
                    {stage === 'queued' ? 'Saved offline · will sync later' : 'Scan saved'}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-snug text-paper/55">
                    3-BO-19 · LP marked ready for today
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ModeButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-9 rounded-[9px] px-3.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.09em] transition-colors duration-150 ${
        active ? 'bg-ink text-paper' : 'text-ink/70 hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}
