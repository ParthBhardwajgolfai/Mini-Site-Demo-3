import Reveal from '@/components/Reveal';
import PageHero from '@/components/PageHero';
import { scorecard, tournament } from '@/data/tournament';

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="About the Championship"
        title={
          <>
            Where history meets
            <br />
            <span className="italic text-fairway dark:text-gold-soft">a new tradition</span>
          </>
        }
        intro="In February 2026, the DP World PGTI added a new name to its calendar — and New Delhi’s oldest championship venue provided the perfect stage."
        meta={[tournament.dates, tournament.venue, tournament.city, tournament.purse, tournament.format]}
      />

      {/* Intro editorial */}
      <section className="container-x grid gap-12 pb-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:pb-32">
        <div>
          <Reveal>
            <p className="font-serif text-2xl font-light leading-relaxed lg:text-[2rem] lg:leading-[1.4]">
              The DP World Players Championship arrived on the DP World PGTI schedule as a celebration of the
              professional game in India — a 72-hole stroke-play championship carrying a purse of ₹1.5 crore
              and Official World Golf Ranking points.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 max-w-xl leading-relaxed text-ink-soft">
              One hundred and twenty-six professionals teed it up across four days at Qutab Golf Course,
              with the field cut to the top fifty and ties after thirty-six holes. The championship delivered
              on every promise — a course-record opening round, a bogey-free halfway leader from overseas,
              and a home champion who ended a five-year wait in emphatic style.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-10 sm:grid-cols-4">
              {[
                ['126', 'Player field'],
                ['56', 'Made the cut'],
                ['62', 'Course record'],
                ['−23', 'Winning score'],
              ].map(([v, k]) => (
                <div key={k}>
                  <div className="font-serif text-4xl font-light text-fairway dark:text-gold-soft lg:text-5xl">{v}</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">{k}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal image delay={100} className="overflow-hidden">
          <img src="/assets/gen/about.jpg" alt="The eighteenth green at dusk" className="h-full min-h-[320px] w-full object-cover" data-cursor="VIEW" />
        </Reveal>
      </section>

      {/* Venue */}
      <section className="border-y border-border bg-surface-2/50 dark:bg-surface/40">
        <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-24 lg:py-32">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="eyebrow">The Venue</div>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">Qutab Golf Course</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-7 max-w-xl leading-relaxed text-ink-soft">
                Set in the shadow of the Qutub Minar — the tallest brick minaret in the world — the Qutab
                Golf Course is among India’s most storied public championship venues. Its narrow,
                tree-lined fairways and small, well-guarded greens reward precision over power, a fact
                borne out by a week where course management separated the field.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-9 grid grid-cols-3 gap-6">
                {[
                  ['Par', String(scorecard.totals.par)],
                  ['Yardage', scorecard.totals.yardage.toLocaleString('en-IN')],
                  ['Holes', '18'],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-border pt-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">{k}</div>
                    <div className="mt-2 font-serif text-2xl font-medium">{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal image delay={120} className="order-1 overflow-hidden lg:order-2">
            <img src="/assets/gen/hero.jpg" alt="Qutab Golf Course at dawn, the Qutub Minar beyond" className="aspect-[4/3] w-full object-cover" data-cursor="VIEW" />
          </Reveal>
        </div>
      </section>

      {/* Scorecard */}
      <section className="container-x py-20 lg:py-32">
        <Reveal>
          <div className="eyebrow">Championship Scorecard</div>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">The card of the course</h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12 overflow-x-auto pb-2">
            <table className="w-full min-w-[760px] border-collapse text-center text-sm">
              <thead>
                <tr className="border-b-2 border-fairway text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft dark:border-gold">
                  <th className="py-3 text-left">Hole</th>
                  {scorecard.par.map((_, i) => (
                    <th key={i} className="py-3">{i + 1}</th>
                  ))}
                  <th className="py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['Par', scorecard.par, scorecard.totals.par],
                    ['Yards', scorecard.yardage, scorecard.totals.yardage],
                    ['Stroke Index', scorecard.strokeIndex, null],
                  ] as const
                ).map(([label, vals, total]) => (
                  <tr key={label} className="border-b border-border">
                    <td className="py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={`py-3.5 ${label === 'Par' ? 'font-serif text-base font-medium' : 'text-ink-soft'}`}>{v}</td>
                    ))}
                    <td className="py-3.5 font-serif text-base font-semibold text-fairway dark:text-gold-soft">{total ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Pull quote + format */}
      <section className="border-t border-border bg-fairway-deep text-ivory">
        <div className="container-x grid gap-16 py-20 lg:grid-cols-2 lg:py-32">
          <Reveal>
            <blockquote className="font-serif text-3xl font-light italic leading-snug lg:text-[2.6rem] lg:leading-[1.25]">
              “A worthy new addition to the calendar — the course asked questions all week, and only one man
              had every answer.”
            </blockquote>
            <div className="mt-8 text-[10px] font-bold uppercase tracking-[0.26em] text-gold-soft">
              Championship week · New Delhi
            </div>
          </Reveal>
          <div className="space-y-8">
            {[
              ['Format', '72-hole individual stroke play across four championship rounds, Tuesday to Friday.'],
              ['The Cut', 'After 36 holes, the field of 126 was reduced to the top 50 professionals and ties — 56 players advanced to the weekend.'],
              ['Stakes', 'A purse of ₹1.5 crore, Official World Golf Ranking points, and valuable DP World PGTI Order of Merit standing.'],
            ].map(([k, v], i) => (
              <Reveal key={k} delay={i * 80}>
                <div className="border-l border-white/20 pl-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-gold-soft">{k}</div>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/75">{v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
