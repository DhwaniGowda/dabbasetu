import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Landmark, QrCode, ShieldCheck, Wallet } from 'lucide-react'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import BottomSheet from '../components/BottomSheet'
import Ledger, { LedgerRow } from '../components/Ledger'
import Mascot from '../components/Mascot'
import Reveal, { SPRING } from '../components/Reveal'
import { StatusPill } from '../components/StatusPill'
import { Board, PageHead, Rule, StickyCTA } from '../components/PageParts'
import { FlowIndexCard, TripCard } from '../components/AsideCards'
import { useToast } from '../components/Toast'
import { useDemo } from '../state/DemoState'
import { carrier, planFeatures, pricing, upiOptions } from '../data/demo'
import { inr } from '../lib/format'
import { formatDayList } from '../lib/dayLabels'

const METHOD_ICONS = { upi: QrCode, bank: Landmark, wallet: Wallet }

export default function Plan() {
  const navigate = useNavigate()
  const toast = useToast()
  const { days, connected, setConnected } = useDemo()
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState('choose')
  const [method, setMethod] = useState('upi')
  const timer = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const pay = () => {
    setStage('paying')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStage('done'), 1100)
  }

  const finish = () => {
    setConnected(true)
    setOpen(false)
    toast('Plan active. Your first month starts today.')
    navigate('/journey')
  }

  return (
    <AppShell
      nav={false}
      back={{ to: '/days', label: 'Days' }}
      step={[4, 5]}
      aside={
        <>
          <TripCard
            days={days}
            statusPill={
              connected ? (
                <StatusPill tone="covered" dot>
                  Plan active
                </StatusPill>
              ) : (
                <StatusPill tone="active" dot>
                  Awaiting payment
                </StatusPill>
              )
            }
          />
          <FlowIndexCard activeTo="/plan" />
        </>
      }
    >
      <PageHead
        eyebrow="Step 04 · Plan"
        title={
          <>
            Your monthly plan<span className="text-orange-ink">.</span>
          </>
        }
        lead="One payment a month. The dabbawala fee goes to Santosh in full, and a small fee runs SETU."
      />

      <Reveal className="mt-9 sm:mt-11 sm:max-w-[560px]">
        <Board>
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
            <span className="eyebrow">September</span>
            {connected ? (
              <StatusPill tone="covered" dot>
                Plan active
              </StatusPill>
            ) : (
              <StatusPill tone="quiet">Draft</StatusPill>
            )}
          </div>

          <div className="px-4 sm:px-5">
            <Ledger divider={false}>
              <LedgerRow
                label="Dabbawala"
                note={`${carrier.name} · ${carrier.group}`}
                value={inr(pricing.dabbawala)}
              />
              <LedgerRow
                label="SETU Plus"
                note="Route matching, QR updates, pausing"
                value={inr(pricing.plus)}
              />
            </Ledger>

            <div className="flex items-end justify-between gap-4 border-t border-ink py-4">
              <div>
                <span className="eyebrow text-ink">Total</span>
                <p className="mt-1.5 text-[12.5px] leading-snug text-quiet">per month, all in</p>
              </div>
              <span className="numeric text-[clamp(2.2rem,8vw,2.8rem)] leading-none text-ink">
                {inr(pricing.total)}
              </span>
            </div>
          </div>

          <p className="border-t border-line px-4 py-3.5 text-[13px] leading-snug text-ink-3 sm:px-5">
            {pricing.note}
          </p>
        </Board>
      </Reveal>

      <Reveal delay={0.06} className="mt-9 sm:max-w-[560px]">
        <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
          <div className="min-w-0">
            <span className="eyebrow">Office days</span>
            <p className="mt-2 text-[15px] font-semibold text-ink">{formatDayList(days)}</p>
          </div>
          <Button to="/days" tone="secondary" size="sm">
            Change
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-11 sm:mt-14">
        <Rule label="What you get" />
        <ul className="mt-7 grid gap-x-8 gap-y-5 sm:max-w-[600px] sm:grid-cols-2">
          {planFeatures.map((feature) => (
            <li key={feature.title} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-3">
                <Check size={13} strokeWidth={3} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold leading-snug text-ink">
                  {feature.title}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-quiet">
                  {feature.note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.14} className="mt-10 sm:max-w-[560px]">
        <p className="flex items-start gap-2.5 border-t border-line pt-5 text-[13px] leading-snug text-ink-3">
          <ShieldCheck size={15} strokeWidth={2.2} aria-hidden="true" className="mt-0.5 shrink-0" />
          This prototype never contacts a payment network. The next screen is a visual simulation of
          UPI Autopay.
        </p>
      </Reveal>

      <StickyCTA
        note={connected ? 'Your plan is active for September.' : 'Demo payment — no money moves.'}
      >
        {connected ? (
          <Button to="/journey" size="lg" iconRight={ArrowRight} fullWidth>
            View today's journey
          </Button>
        ) : (
          <Button size="lg" iconRight={ArrowRight} onClick={() => setOpen(true)} fullWidth>
            Set up UPI Autopay
          </Button>
        )}
      </StickyCTA>

      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false)
          if (stage === 'done') setStage('choose')
        }}
        title={stage === 'done' ? "You're connected." : 'UPI Autopay'}
        subtitle={
          stage === 'done'
            ? `${inr(pricing.total)} will be debited on the 1st of every month.`
            : `A monthly mandate of ${inr(pricing.total)}. Demo only — no real mandate is created.`
        }
      >
        {stage === 'choose' && (
          <div>
            <div className="flex items-baseline justify-between gap-4 rounded-tile border border-line bg-paper-2 px-4 py-3.5">
              <div>
                <span className="eyebrow">Amount</span>
                <p className="mt-2 text-[12.5px] text-quiet">Monthly · cancel anytime</p>
              </div>
              <span className="numeric text-[30px] leading-none text-ink">
                {inr(pricing.total)}
              </span>
            </div>

            <div role="radiogroup" aria-label="Payment method" className="mt-4 space-y-2">
              {upiOptions.map((option) => {
                const selected = method === option.id
                const Icon = METHOD_ICONS[option.id]
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMethod(option.id)}
                    className={`flex w-full items-center gap-3 rounded-tile border px-3.5 py-3 text-left transition-colors duration-150 ${
                      selected ? 'border-ink bg-surface' : 'border-line bg-transparent hover:border-line-2'
                    }`}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-paper-2 text-ink-2">
                      <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-semibold leading-snug text-ink">
                        {option.label}
                      </span>
                      <span className="block text-[12.5px] leading-snug text-quiet">
                        {option.note}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-[18px] shrink-0 place-items-center rounded-full border ${
                        selected ? 'border-ink bg-ink text-paper' : 'border-line-2'
                      }`}
                    >
                      {selected && <Check size={11} strokeWidth={3.5} />}
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="mt-4 text-[12.5px] leading-snug text-quiet">
              Mock handle: <span className="font-mono text-[12px] text-ink-3">aarav@setu</span>.
              Nothing leaves this browser tab.
            </p>
          </div>
        )}

        {stage === 'paying' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="relative grid size-12 place-items-center">
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-orange/25"
                animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
              />
              <span className="size-3.5 rounded-full bg-orange" />
            </span>
            <p className="text-[14.5px] font-semibold text-ink">Requesting autopay mandate…</p>
            <p className="text-[13px] text-quiet">Talking to your mock bank</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={SPRING}
                className="grid size-14 place-items-center rounded-full bg-green text-paper"
              >
                <Check size={26} strokeWidth={3} aria-hidden="true" />
              </motion.span>
              <p className="mt-4 text-[15.5px] font-semibold text-ink">
                Santosh has your {formatDayList(days)} schedule.
              </p>
              <p className="mt-1.5 text-[14px] leading-snug text-quiet">
                First pickup is tomorrow morning at {carrier.pickup}. You can pause any day before
                7 am.
              </p>
            </div>
            <Mascot
              pose="lunch"
              lift={false}
              delay={0.1}
              className="h-[108px] shrink-0 sm:h-[124px]"
              alt="The SETU dabbawala sitting down to his own lunch beside a stack of tiffins."
            />
          </div>
        )}

        <div className="mt-6 space-y-2.5">
          {stage === 'choose' && (
            <Button size="lg" iconRight={ArrowRight} fullWidth onClick={pay}>
              Confirm demo payment
            </Button>
          )}
          {stage === 'done' && (
            <Button size="lg" iconRight={ArrowRight} fullWidth onClick={finish}>
              View today's journey
            </Button>
          )}
          {stage === 'choose' && (
            <Button tone="ghost" fullWidth onClick={() => setOpen(false)}>
              Not now
            </Button>
          )}
        </div>
      </BottomSheet>
    </AppShell>
  )
}
