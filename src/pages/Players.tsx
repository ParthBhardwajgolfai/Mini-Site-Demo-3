import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import PlayerAvatar from '@/components/PlayerAvatar';
import { players } from '@/data/tournament';

export default function Players() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('All');

  const countries = useMemo(() => {
    const set = new Map<string, number>();
    players.forEach((p) => set.set(p.country, (set.get(p.country) ?? 0) + 1));
    return ['All', ...[...set.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter(
      (p) =>
        (country === 'All' || p.country === country) &&
        (!q || p.name.toLowerCase().includes(q)),
    );
  }, [query, country]);

  return (
    <div>
      <PageHero
        eyebrow="The Field"
        title={
          <>
            126 professionals.
            <br />
            <span className="italic text-fairway dark:text-gold-soft">One trophy.</span>
          </>
        }
        intro="The complete field of the DP World Players Championship 2026 — India’s finest alongside challengers from eleven nations."
      />

      {/* Controls */}
      <div className="sticky top-16 z-30 border-y border-border bg-background/90 backdrop-blur-xl lg:top-20">
        <div className="container-x flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a player…"
              className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-gold"
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`h-11 shrink-0 rounded-full border px-4 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  country === c
                    ? 'border-fairway bg-fairway text-primary-foreground dark:border-gold dark:bg-gold dark:text-fairway-deep'
                    : 'border-border text-ink-soft hover:border-ink-soft'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-x py-14 lg:py-20">
        <div className="mb-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
          {filtered.length} player{filtered.length === 1 ? '' : 's'}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 10) * 40}>
              <div className="group" data-cursor="VIEW">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
                  <PlayerAvatar
                    name={p.name}
                    image={p.image}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-end justify-between text-white">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em]">
                        Pos <span className="font-serif text-base normal-case tracking-normal">{p.position}</span>
                      </div>
                      <div className="font-serif text-xl">{p.scoreDisplay}</div>
                    </div>
                  </div>
                  {p.position === '1' && (
                    <div className="absolute left-3 top-3 bg-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-fairway-deep">
                      Champion
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <img src={p.flag} alt="" className="h-3 w-4 rounded-[1px] object-cover" loading="lazy" />
                  <div className="min-w-0">
                    <div className="truncate font-serif text-base font-medium leading-tight">{p.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">{p.country}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-24 text-center font-serif text-2xl font-light italic text-ink-soft">
            No players match your search.
          </div>
        )}
      </div>
    </div>
  );
}
