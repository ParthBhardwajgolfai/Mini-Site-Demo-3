import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import Expand from '@/components/Expand';
import PageHero from '@/components/PageHero';
import { results } from '@/data/tournament';

export default function Results() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const [cutFilter, setCutFilter] = useState<'all' | 'made' | 'mc'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return results.filter(
      (r) =>
        (cutFilter === 'all' || (cutFilter === 'made' ? r.madeCut : !r.madeCut)) &&
        (!q || r.name.toLowerCase().includes(q)),
    );
  }, [query, cutFilter]);

  return (
    <div>
      <PageHero
        eyebrow="Official Results"
        title={
          <>
            Final standings,
            <br />
            <span className="italic text-fairway dark:text-gold-soft">round by round</span>
          </>
        }
        intro="Complete results of the DP World Players Championship 2026. Expand any player to reveal their round-by-round scorecard."
      />

      {/* Controls */}
      <div className="sticky top-16 z-30 border-y border-border bg-background/90 backdrop-blur-xl lg:top-20">
        <div className="container-x flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-full border border-border p-1">
            {(
              [
                ['all', 'Full field'],
                ['made', 'Made the cut'],
                ['mc', 'Missed cut'],
              ] as const
            ).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setCutFilter(v)}
                className={`h-9 rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  cutFilter === v ? 'bg-fairway text-primary-foreground dark:bg-gold dark:text-fairway-deep' : 'text-ink-soft'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search results…"
              className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-gold"
            />
          </div>
        </div>
      </div>

      <div className="container-x py-12 lg:py-16">
        <div className="overflow-hidden border border-border">
          {filtered.map((r) => {
            const open = openId === r.id;
            return (
              <div key={r.id} className={`border-b border-border last:border-0 ${r.pos === '1' ? 'bg-gold/10' : ''}`}>
                  <button
                    onClick={() => setOpenId(open ? null : r.id)}
                    className={`grid w-full grid-cols-[3.2rem_1fr_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-2/60 sm:grid-cols-[4rem_1fr_7rem_6rem_2rem] lg:px-6 ${
                      !r.madeCut ? 'opacity-70' : ''
                    }`}
                  >
                    <span className={`font-serif text-lg ${r.madeCut ? 'text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>
                      {r.pos}
                    </span>
                    <span>
                      <span className="block font-serif text-base font-medium leading-tight lg:text-lg">{r.name}</span>
                      <span className="text-[9px] uppercase tracking-[0.18em] text-ink-soft">{r.country}</span>
                    </span>
                    <span className="hidden text-sm tabular-nums text-ink-soft sm:block">
                      {r.rounds.map((x) => x ?? '—').join(' · ')}
                    </span>
                    <span className={`text-right font-serif text-lg font-semibold tabular-nums ${(r.toPar ?? 1) < 0 ? 'score-under' : ''}`}>
                      {r.toParDisplay}
                      {r.prize && <span className="mt-0.5 block text-[9px] font-sans font-bold uppercase tracking-[0.14em] text-ink-soft">{r.prize}</span>}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`hidden justify-self-end text-ink-soft transition-transform duration-300 sm:block ${open ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <Expand open={open}>
                    <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-5">
                      {r.rounds.map((sc, ri) => (
                        <div key={ri} className="bg-surface p-5 text-center">
                          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-soft">Round {ri + 1}</div>
                          <div className="mt-1.5 font-serif text-2xl font-medium tabular-nums">{sc ?? '—'}</div>
                        </div>
                      ))}
                      <div className="bg-fairway-deep p-5 text-center text-ivory dark:bg-surface-2 dark:text-foreground">
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70">Total</div>
                        <div className="mt-1.5 font-serif text-2xl font-semibold tabular-nums">{r.total}</div>
                      </div>
                    </div>
                  </Expand>
                </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-24 text-center font-serif text-2xl font-light italic text-ink-soft">
            No results match your search.
          </div>
        )}
        <div className="mt-8 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          {filtered.length} players · Tap a row to expand the scorecard</div>
      </div>
    </div>
  );
}
