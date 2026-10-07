import { useNavigate } from 'react-router-dom'
import { ART, Mascot } from './assets.jsx'
import { Tag } from './ChapterShell'
import { wipe } from '../lib/wipe'

/**
 * The story without the film.
 *
 * Under `prefers-reduced-motion` the whole experience becomes a static
 * composition: the same eight beats, the same copy, the same assets, in a plain
 * readable column. This is deliberately a separate render path rather than a
 * frozen timeline — absolute-positioned cinematic layers cannot degrade
 * gracefully, and the story has to make sense with no animation at all.
 */
export default function StaticStory() {
  const navigate = useNavigate()
  const enter = (to) => () => wipe.play(() => navigate(to))

  return (
    <main className="relative mx-auto w-full max-w-[1180px] px-5 pb-32 pt-28 sm:px-8">
      <section className="border-b border-paper/15 pb-20">
        <Tag className="text-paper/45">A weekday morning · Mumbai</Tag>
        <h1 className="t-xl display mt-6 text-paper">
          MUMBAI MOVES.
          <br />
          <span className="text-orange">LUNCH MOVES TOO.</span>
        </h1>
        <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-paper/70">
          Almost a crore train rides happen every day. Inside those trains, lunch is moving too.
        </p>
        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          <div>
            <p className="t-md display text-paper">
              MUMBAI’S LUNCH HAS MOVED THIS WAY SINCE 1890.
            </p>
          </div>
          <div className="space-y-6">
            {[
              ['~3,000', 'Dabbawalas'],
              ['50K – 1 LAKH', 'Lunchboxes, every day'],
              ['BEFORE 1 PM', 'Nobody has ever missed it'],
            ].map(([n, label]) => (
              <div key={n} className="border-t border-paper/15 pt-4">
                <p className="numeric t-stat text-paper">{n}</p>
                <Tag className="mt-2 block text-paper/50">{label}</Tag>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 max-w-[420px]">
          <Mascot pose="mascotRunning" className="h-auto w-full" eager />
        </div>
      </section>

      <section className="border-b border-paper/15 py-20">
        <h2 className="t-xl display text-paper">
          IT ALREADY WORKS<span className="text-orange">.</span>
        </h2>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
          {['No app', 'No GPS', 'No new riders'].map((t) => (
            <Tag key={t} className="text-paper/50">
              {t}
            </Tag>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-12">
          {/* The tiffin, as the deck draws it, when there is no WebGL to build it. */}
          <img
            src={ART.tiffin.src}
            alt="A stainless-steel Mumbai tiffin carrier, stamped 3-BO and 12·LP"
            width={ART.tiffin.w}
            height={ART.tiffin.h}
            className="h-[240px] w-auto sm:h-[300px]"
          />
          <ol className="min-w-[280px] flex-1 space-y-4">
            {[
              ['09:00', 'HOME', 'Picked up at the door'],
              ['09:45', 'KANDIVALI', 'Sorted into crate K4-07'],
              ['10:15', 'LOCAL TRAIN', 'On the Western Line'],
              ['11:30', 'LOWER PAREL', 'Off the train'],
              ['12:30', 'DESK', 'Handed over'],
            ].map(([time, name, note]) => (
              <li
                key={name}
                className="grid grid-cols-[5rem_1fr] items-baseline gap-4 border-t border-paper/15 pt-4"
              >
                <span className="numeric text-[18px] text-paper/80">{time}</span>
                <span>
                  <span className="display block text-[26px] leading-none text-paper">{name}</span>
                  <span className="mt-1 block text-[14px] text-paper/55">{note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-paper/15 py-20">
        <h2 className="t-xl display text-paper">
          GREAT SYSTEM.
          <br />
          <span className="text-orange">HARD TO GET IN.</span>
        </h2>
        <ul className="mt-10 space-y-4">
          {[
            'How do I even find a dabbawala?',
            'Does he cover my home AND my office?',
            'Cash every month?',
            'Where is my lunch right now?',
            'I only go to office 3 days a week.',
          ].map((q) => (
            <li key={q} className="text-[clamp(1.1rem,2.4vw,1.8rem)] font-semibold text-paper/80">
              {q}
            </li>
          ))}
        </ul>
        <p className="t-lg display mt-14 text-paper">
          BOTH SIDES WANT EACH OTHER.
          <br />
          <span className="text-paper/70">NOTHING CONNECTS THEM.</span>
        </p>
      </section>

      <section className="border-b border-paper/15 py-20 text-center">
        <img
          src={ART.logoLight.src}
          alt="SETU"
          width={ART.logoLight.w}
          height={ART.logoLight.h}
          className="mx-auto w-[min(320px,60vw)]"
        />
        <h2 className="t-xl display mt-10 text-paper">
          SETU<span className="text-orange">.</span>
        </h2>
        <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-paper/55">
          Mumbai’s Dabba Connection
        </p>
        <p className="mx-auto mt-10 max-w-[30ch] text-[clamp(1rem,1.9vw,1.45rem)] leading-snug text-paper/70">
          An app that connects you to Mumbai’s dabbawalas.
        </p>
      </section>

      <section className="border-b border-paper/15 py-20">
        <h3 className="t-lg display text-paper">4 QUICK SCANS.</h3>
        <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-paper/50">
          No GPS needed
        </p>
        <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {[
            ['9:12', 'Collected from home'],
            ['9:51', 'Kandivali'],
            ['10:14', 'On the local'],
            ['11:40', 'Lower Parel'],
            ['12:30', 'Desk'],
          ].map(([time, what]) => (
            <li key={time} className="flex items-baseline gap-2">
              <span className="numeric text-[18px] text-paper/80">{time}</span>
              <Tag className="text-paper/40">{what}</Tag>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-[42ch] text-[16px] leading-relaxed text-paper/60">
          Nothing is attached to your tiffin. Four people scan a code, and that is the whole tracking
          system.
        </p>
      </section>

      <section className="py-24">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Tag className="text-green">Delivered · 12:18</Tag>
            <h2 className="t-xl display mt-4 text-paper">
              LUNCH HAS ARRIVED<span className="text-green">.</span>
            </h2>
          </div>
          <div className="w-[min(260px,50vw)]">
            <Mascot pose="mascotTiffin" className="h-auto w-full" />
          </div>
        </div>

        <p className="t-xl display mt-24 text-paper">THE NETWORK ALREADY EXISTS.</p>
        <p className="t-xl display mt-16 text-paper">
          WE’RE BUILDING THE BRIDGE TO IT<span className="text-orange">.</span>
        </p>

        <div className="mt-24 flex flex-col items-center text-center">
          <img
            src={ART.logoLight.src}
            alt="SETU — Mumbai’s Dabba Connection"
            width={ART.logoLight.w}
            height={ART.logoLight.h}
            className="h-[44px] w-auto sm:h-[54px]"
          />
          <div className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={enter('/route')}
              className="inline-flex h-[58px] w-full items-center justify-center rounded-panel border border-orange bg-orange px-7 text-[1rem] font-semibold text-ink sm:w-auto"
            >
              Check my route
            </button>
            <button
              type="button"
              onClick={enter('/app')}
              className="inline-flex h-[58px] w-full items-center justify-center rounded-panel border border-paper/70 px-7 text-[1rem] font-semibold text-paper sm:w-auto"
            >
              Explore the app
            </button>
          </div>
          <p className="mt-8 max-w-[46ch] text-[12.5px] leading-snug text-paper/55">
            A frontend prototype. Mock data only — no backend, no payments, no maps, no GPS.
          </p>
        </div>
      </section>
    </main>
  )
}
