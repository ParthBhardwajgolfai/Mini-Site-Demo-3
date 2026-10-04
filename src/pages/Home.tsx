import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, ChevronRight, Trophy } from 'lucide-react';
import Reveal from '@/components/Reveal';
import PartnerMark from '@/components/PartnerMark';
import PlayerAvatar from '@/components/PlayerAvatar';
import { gallery, leaderboard, news, partners, players, tournament } from '@/data/tournament';

const finalBoard = leaderboard[3].items;
const featuredIds = [5266, ...leaderboard[3].items.slice(1, 8).map((p) => p.id)];
const featured = [...new Set(featuredIds)]
  .map((id) => players.find((p) => p.id === id))
  .filter(Boolean)
  .slice(0, 6) as typeof players;

const fmtNews = (iso: string) =>
  new Date(new Date(iso).getTime() + 5.5 * 3600 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setParallax(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-fairway-deep text-ivory dark:text-foreground">
        <div className="absolute inset-0 hero-img-in">
          <img
            src="/assets/gen/hero.jpg"
            alt="A golfer silhouetted against a golden dawn at Qutab Golf Course"
            className="h-full w-full object-cover"
            style={{ transform: `translateY(${parallax * 0.25}px) scale(1.05)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </div>

        <div className="container-x relative z-10 pb-20 pt-40 [text-shadow:0_1px_24px_rgba(0,0,0,0.45)] lg:pb-28">
          <div className="hero-fade eyebrow !text-gold-soft" style={{ '--d': '150ms' } as React.CSSProperties}>
            DP World PGTI · New Delhi
          </div>
          <h1
            className="hero-fade mt-6 max-w-5xl font-serif text-[13.5vw] font-light leading-[0.94] tracking-tight sm:text-7xl lg:text-[6.5rem]"
            style={{ '--d': '300ms' } as React.CSSProperties}
          >
            DP World Players
            <br />
            <span className="italic">Championship</span> <span className="text-gold-soft">2026</span>
          </h1>
          <div
            className="hero-fade mt-8 flex flex-wrap items-center gap-x-7 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75"
            style={{ '--d': '500ms' } as React.CSSProperties}
          >
            <span>{tournament.dates}</span>
            <span className="hidden h-3 w-px bg-white/30 sm:block" />
            <span>{tournament.venue} · {tournament.city}</span>
            <span className="hidden h-3 w-px bg-white/30 sm:block" />
            <span>{tournament.purse} Prize Purse</span>
            <span className="rounded-full border border-gold-soft/50 px-3 py-1 text-[10px] text-gold-soft">
              {tournament.status}
            </span>
          </div>
          <div className="hero-fade mt-10 flex flex-wrap gap-4" style={{ '--d': '680ms' } as React.CSSProperties}>
            <Link
              to="/leaderboard"
              className="group inline-flex items-center gap-3 bg-ivory px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-fairway-deep transition-colors hover:bg-gold-soft dark:bg-gold-soft dark:text-fairway-deep dark:hover:bg-gold"
            >
              Final Leaderboard
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/results"
              className="group inline-flex items-center gap-3 border border-white/40 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Full Results
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="hero-fade absolute bottom-6 right-6 z-10 hidden flex-col items-center gap-3 lg:flex" style={{ '--d': '900ms' } as React.CSSProperties}>
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/60" style={{ writingMode: 'vertical-rl' }}>
            Scroll
          </span>
          <div className="h-14 w-px overflow-hidden bg-white/20">
            <div className="scroll-hint-line h-full w-full bg-gold-soft" />
          </div>
        </div>
      </section>

      {/* ══════════ MARQUEE ══════════ */}
      <div className="overflow-hidden border-b border-border bg-background py-4">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[0, 1].map((n) => (
            <div key={n} className="flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink-soft">
              {[
                'Champion — Honey Baisoya · −23',
                'Qutab Golf Course · New Delhi',
                '₹1.5 Crore Prize Purse',
                '126 Players · 56 Made the Cut',
                'Par 70 · 6,204 Yards',
                'Stroke Play · 72 Holes',
              ].map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t}
                  <span className="h-1 w-1 rounded-full bg-gold" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ SNAPSHOT ══════════ */}
      <section className="container-x py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <Reveal>
            <div className="eyebrow">Tournament Snapshot</div>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight lg:text-5xl">
              A new stage for
              <br />
              Indian golf, <span className="italic text-fairway dark:text-gold-soft">delivered</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3">
            {[
              ['Dates', tournament.datesShort],
              ['Venue', tournament.venue],
              ['City', tournament.city],
              ['Prize Money', tournament.purse],
              ['Format', '72-hole Stroke Play'],
              ['Field', tournament.field],
            ].map(([k, v], i) => (
              <Reveal key={k} delay={i * 70}>
                <div className="border-t border-border pt-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">{k}</div>
                  <div className="mt-2 font-serif text-xl font-medium lg:text-2xl">{v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ STORY ══════════ */}
      <section className="border-y border-border bg-surface-2/50 dark:bg-surface/40">
        <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-24 lg:py-32">
          <Reveal image className="overflow-hidden">
            <img
              src="/assets/gallery/g10.jpg"
              alt="Champion Honey Baisoya receives the trophy"
              className="aspect-[4/3] w-full object-cover"
              data-cursor="VIEW"
            />
          </Reveal>
          <div>
            <Reveal>
              <div className="eyebrow">The Story</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight lg:text-5xl">
                Five years of waiting.
                <br />
                <span className="italic">Four days of mastery.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-xl leading-relaxed text-ink-soft">
                The inaugural DP World Players Championship brought 126 professionals to the historic
                fairways of Qutab Golf Course. When the final putt dropped on Friday, Honey Baisoya stood
                alone at twenty-three under par — a three-shot triumph that ended a five-year title
                drought, sealed with a closing 65 beneath the Delhi winter sun.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <Link
                to="/about"
                className="group mt-9 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-fairway dark:text-gold-soft"
              >
                Read the full story
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ CHAMPION ══════════ */}
      <section className="container-x py-20 lg:py-32">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow">Champion</div>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-6xl">
                Honey <span className="italic">Baisoya</span>
              </h2>
            </div>
            <Trophy className="mb-2 hidden text-gold sm:block" size={40} strokeWidth={1} />
          </div>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
          <Reveal image className="overflow-hidden bg-surface-2">
            <img
              src={tournament.champion.image}
              alt="Honey Baisoya"
              className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
              data-cursor="VIEW"
            />
          </Reveal>
          <div className="flex flex-col justify-center">
            <Reveal>
              <div className="font-serif text-[5rem] font-light leading-none text-fairway dark:text-gold-soft lg:text-[9rem]">
                −23
              </div>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.26em] text-ink-soft">
                257 total · Won by {tournament.champion.margin}
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-4 gap-4">
              {tournament.champion.rounds.map((rscore, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="border-t-2 border-fairway pt-3 dark:border-gold">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">Round {i + 1}</div>
                    <div className="mt-1 font-serif text-3xl font-medium lg:text-4xl">{rscore}</div>
                    <div className="score-under text-xs">{[-7, -5, -6, -5][i]}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <p className="mt-10 max-w-lg border-l-2 border-gold pl-6 font-serif text-xl font-light italic leading-relaxed text-ink-soft lg:text-2xl">
                “63, 65, 64, 65 — a masterclass in consistency, and a first title in five years.”
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ LEADERBOARD PREVIEW ══════════ */}
      <section className="border-y border-border bg-fairway-deep py-20 text-ivory dark:text-foreground lg:py-28">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="eyebrow">Final Standings</div>
                <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">The leaders</h2>
              </div>
              <Link
                to="/leaderboard"
                className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-soft"
              >
                View full leaderboard
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12">
            {finalBoard.slice(0, 5).map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <Link
                  to="/leaderboard"
                  className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-white/10 py-5 transition-colors hover:bg-white/5 sm:grid-cols-[4rem_1fr_6rem_6rem] lg:grid-cols-[5rem_1fr_8rem_8rem_6rem]"
                >
                  <span className="font-serif text-2xl font-light text-gold-soft lg:text-3xl">{p.pos}</span>
                  <span>
                    <span className="block font-serif text-xl font-normal lg:text-2xl">{p.name}</span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">{p.country}</span>
                  </span>
                  <span className="hidden text-sm text-white/60 sm:block">
                    {p.rounds.map((r) => r ?? '—').join(' · ')}
                  </span>
                  <span className="hidden text-right text-sm text-white/60 lg:block">{p.total}</span>
                  <span className="text-right font-serif text-2xl font-medium text-gold-soft lg:text-3xl">{p.toParDisplay}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED PLAYERS ══════════ */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="eyebrow">The Field</div>
                <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">Featured players</h2>
              </div>
              <Link
                to="/players"
                className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fairway dark:text-gold-soft"
              >
                All 126 players
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:px-8 lg:px-14">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 60} className="shrink-0 snap-start">
              <Link to="/players" className="group block w-[240px] lg:w-[280px]" data-cursor="VIEW">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
                  <PlayerAvatar
                    name={p.name}
                    image={p.image}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur">
                    {p.position === '1' ? 'Champion' : `Pos ${p.position}`}
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-serif text-lg font-medium leading-tight">{p.name}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-soft">{p.country}</div>
                  </div>
                  <div className="score-under font-serif text-xl">{p.scoreDisplay}</div>
                </div>
              </Link>
            </Reveal>
          ))}
          <div className="flex w-[240px] shrink-0 snap-start items-center justify-center">
            <Link
              to="/players"
              className="group flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-full border border-border text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
            >
              View all
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ JOURNEY ══════════ */}
      <section className="border-y border-border bg-surface-2/50 py-20 dark:bg-surface/40 lg:py-28">
        <div className="container-x">
          <Reveal>
            <div className="eyebrow">The Week</div>
            <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">Tournament journey</h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-7">
            {tournament.journey.map((j, i) => (
              <Reveal key={j.label} delay={i * 60} className="bg-background">
                <div className="flex h-full flex-col p-6 lg:min-h-[240px]">
                  <div className="font-serif text-4xl font-light text-gold/50 dark:text-gold-soft/50">{String(i + 1).padStart(2, '0')}</div>
                  <div className="mt-auto pt-8">
                    <div className="text-sm font-bold">{j.label}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold dark:text-gold-soft">{j.date}</div>
                    <div className="mt-3 text-xs leading-relaxed text-ink-soft">{j.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ NEWS ══════════ */}
      <section className="container-x py-20 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow">From the Press Room</div>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">Latest news</h2>
            </div>
            <Link to="/news" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fairway dark:text-gold-soft">
              All stories
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {news.slice(0, 3).map((n, i) => (
            <Reveal key={n.id} delay={i * 80}>
              <Link to="/news" className="group block" data-cursor="VIEW">
                <div className="overflow-hidden">
                  <img
                    src={n.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                  {fmtNews(n.date)}
                </div>
                <h3 className="mt-2.5 font-serif text-xl font-normal leading-snug transition-colors group-hover:text-fairway dark:group-hover:text-gold-soft">
                  {n.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ GALLERY STRIP ══════════ */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="eyebrow">In Pictures</div>
                <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">The championship in frames</h2>
              </div>
              <Link to="/gallery" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fairway dark:text-gold-soft">
                Open gallery
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="container-x mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 6, 9].map((g, i) => (
            <Reveal key={g} image delay={i * 70} className="overflow-hidden">
              <Link to="/gallery" data-cursor="EXPLORE">
                <img
                  src={gallery[g].image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.05] sm:aspect-[3/4]"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ PARTNERS ══════════ */}
      <section className="border-t border-border bg-surface-2/40 py-20 dark:bg-surface/40 lg:py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="eyebrow">Partners</div>
                <h2 className="mt-4 font-serif text-4xl font-light tracking-tight lg:text-5xl">
                  Built with <span className="italic">remarkable company</span>
                </h2>
              </div>
              <Link
                to="/partners"
                className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fairway dark:text-gold-soft"
              >
                All partners
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
              <div className="flex flex-col items-center justify-center bg-fairway-deep px-8 py-12 text-center text-ivory dark:text-foreground lg:py-16">
                <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-gold-soft">Title Partner</div>
                <PartnerMark name={partners.title.name} size="lg" className="mt-4" />
              </div>
              {partners.official.map((p) => (
                <div key={p.name} className="flex flex-col items-center justify-center gap-2 bg-background px-8 py-12 text-center lg:py-16">
                  <PartnerMark name={p.name} />
                  <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-ink-soft">{p.role}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-px grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
              {partners.supporting.map((p) => (
                <div key={p.name} className="flex flex-col items-center justify-center gap-1.5 bg-background px-6 py-8 text-center last:col-span-2 lg:last:col-span-1">
                  <PartnerMark name={p.name} size="sm" />
                  <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-ink-soft">{p.role}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
