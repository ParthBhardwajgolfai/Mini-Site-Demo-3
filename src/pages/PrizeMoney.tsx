import { useMemo, useState } from 'react';
import { Search, Trophy } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { prizes, players, tournament } from '@/data/tournament';

const medalStyles = [
  'bg-gold text-fairway-deep',
  'bg-surface-2 text-foreground',
  'bg-surface-2 text-foreground',
];

/** Circular player portrait; falls back to the generic golfer placeholder. */
function PlayerFace({ name, className }: { name: string; className: string }) {
  const player = players.find((p) => p.name === name);
  return (
    <img
      src={player?.image || '/assets/players/placeholder.svg'}
      alt={player?.image ? name : ''}
      loading="lazy"
      className={`rounded-full border border-border bg-surface-2 object-cover object-top ${className}`}
    />
  );
}

export default function PrizeMoney() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? prizes.filter((p) => p.name.toLowerCase().includes(q)) : prizes;
  }, [query]);

  const podium = prizes.slice(0, 3);
  const rest = filtered.filter((p) => !podium.some((x) => x.name === p.name && x.pos === p.pos) || query);
  const champion = players.find((p) => p.name === tournament.champion.name);

  return (
    <div>
      {/* ── Champion hero ── */}
      <section className="border-b border-border bg-surface-2/40 dark:bg-surface/40">
        <div className="container-x grid items-center gap-10 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-24 lg:pt-44">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <div className="eyebrow">The Purse · {tournament.purse}</div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-serif text-[2.75rem] font-light leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                {tournament.champion.name.split(' ')[0]}{' '}
                <span className="italic text-fairway dark:text-gold-soft">
                  {tournament.champion.name.split(' ').slice(1).join(' ')}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-soft">
                {champion && <img src={champion.flag} alt="" className="h-3.5 w-5 rounded-[1px] object-cover" />}
                {tournament.champion.country} · Champion
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-7">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">Score</div>
                  <div className="mt-2 font-serif text-5xl font-light text-fairway dark:text-gold-soft lg:text-6xl">
                    {tournament.champion.score}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">Total</div>
                  <div className="mt-2 font-serif text-5xl font-light lg:text-6xl">{tournament.champion.total}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">Margin</div>
                  <div className="mt-2 font-serif text-5xl font-light lg:text-6xl">3</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">Champion’s Share</div>
                  <div className="mt-1.5 font-serif text-4xl font-light text-gold lg:text-5xl">{tournament.champion.prize}</div>
                </div>
                <div className="flex items-center gap-3 text-gold">
                  <Trophy size={38} strokeWidth={1} />
                  <div className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-ink-soft">
                    Winner · DP World Players
                    <br />
                    Championship 2026
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <p className="mt-10 max-w-xl text-base leading-relaxed text-ink-soft lg:text-lg">
                Official prize distribution of the {tournament.fullName} — {tournament.purseFull} shared across the top
                62 finishers at {tournament.venue}.
              </p>
            </Reveal>
          </div>

          <Reveal image className="overflow-hidden">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -bottom-4 -right-4 hidden h-full w-full border border-gold/40 lg:block" aria-hidden="true" />
              <img
                src={tournament.champion.image}
                alt={`${tournament.champion.name}, champion of the ${tournament.fullName}`}
                className="aspect-[4/5] w-full bg-surface object-cover object-top"
              />
              <div className="absolute bottom-4 left-4 bg-background/90 px-4 py-2.5 backdrop-blur">
                <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold">Winner’s Cheque</div>
                <div className="font-serif text-xl font-medium">{tournament.champion.prize}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Podium ── */}
      <section className="container-x pt-16 lg:pt-24">
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {podium.map((p, i) => (
            <Reveal key={p.name} delay={i * 100} className="bg-surface">
              <div className={`relative flex h-full flex-col p-8 lg:p-10 ${i === 0 ? 'md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3'}`}>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full font-serif text-xl font-semibold ${medalStyles[i]}`}>
                    {p.pos}
                  </div>
                  <PlayerFace name={p.name} className="h-16 w-16" />
                </div>
                <div className="mt-6 font-serif text-2xl font-medium lg:text-3xl">{p.name}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">{p.country} · {p.toPar}</div>
                <div className="mt-6 font-serif text-4xl font-light text-fairway dark:text-gold-soft lg:text-5xl">{p.display}</div>
                {i === 0 && (
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-gold">Champion’s share</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Full table ── */}
      <section className="mt-16 border-t border-border bg-surface-2/40 py-16 dark:bg-surface/40 lg:mt-24 lg:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-3xl font-light tracking-tight">Complete distribution</h2>
            <div className="relative sm:w-64">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a player…"
                className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-gold"
              />
            </div>
          </div>

          <Reveal>
            <div className="mt-10 overflow-hidden border border-border">
              {(query ? filtered : rest).map((p) => (
                <div
                  key={`${p.pos}-${p.name}`}
                  className="lb-row grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 border-b border-border bg-surface px-4 py-3.5 last:border-0 sm:grid-cols-[5rem_1fr_7rem_9rem] lg:px-6"
                >
                  <span className="font-serif text-lg text-fairway dark:text-gold-soft">{p.pos || '—'}</span>
                  <span className="flex items-center gap-3">
                    <PlayerFace name={p.name} className="h-9 w-9 shrink-0" />
                    <span>
                      <span className="block font-medium leading-tight">{p.name}</span>
                      <span className="text-[9px] uppercase tracking-[0.18em] text-ink-soft">{p.country}</span>
                    </span>
                  </span>
                  <span className="hidden text-sm tabular-nums text-ink-soft sm:block">{p.toPar}</span>
                  <span className="text-right font-serif text-lg tabular-nums">{p.display}</span>
                </div>
              ))}
            </div>
          </Reveal>
          {(query ? filtered : rest).length === 0 && (
            <div className="py-24 text-center font-serif text-2xl font-light italic text-ink-soft">
              No prize entries match your search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
