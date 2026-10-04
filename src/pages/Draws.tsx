import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { draws } from '@/data/tournament';

const roundInfo = [
  { label: 'Round 1', date: 'Tuesday · 10 February' },
  { label: 'Round 2', date: 'Wednesday · 11 February' },
  { label: 'Round 3', date: 'Thursday · 12 February' },
  { label: 'Final Round', date: 'Friday · 13 February' },
];

/** Group draw entries into tee-time flights (consecutive players sharing a tee time). */
function groupFlights(items: typeof draws[0]['items']) {
  const flights: { time: string; tee: string; players: typeof draws[0]['items'] }[] = [];
  items.forEach((it) => {
    const key = `${it.teeTime}|${it.tee}`;
    const last = flights[flights.length - 1];
    if (last && `${last.time}|${last.tee}` === key) {
      last.players.push(it);
    } else {
      flights.push({ time: it.teeTime ?? '—', tee: it.tee ?? '1', players: [it] });
    }
  });
  return flights;
}

export default function Draws() {
  const [round, setRound] = useState(3);
  const [tee, setTee] = useState<'all' | '1' | '10'>('all');
  const [query, setQuery] = useState('');

  const flights = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = draws[round].items;
    if (tee !== 'all') items = items.filter((i) => i.tee === tee);
    if (q) items = items.filter((i) => i.name.toLowerCase().includes(q));
    return groupFlights(items);
  }, [round, tee, query]);

  return (
    <div>
      <PageHero
        eyebrow="Tee Times"
        title={
          <>
            The championship
            <br />
            <span className="italic text-fairway dark:text-gold-soft">draw</span>
          </>
        }
        intro="Official starting times and groupings for every round — first and tenth tee starts across the week at Qutab Golf Course."
      />

      {/* Controls */}
      <div className="sticky top-16 z-30 border-y border-border bg-background/90 backdrop-blur-xl lg:top-20">
        <div className="container-x flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {roundInfo.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setRound(i)}
                className={`flex h-11 shrink-0 flex-col justify-center rounded-full border px-5 transition-colors ${
                  round === i
                    ? 'border-fairway bg-fairway text-primary-foreground dark:border-gold dark:bg-gold dark:text-fairway-deep'
                    : 'border-border text-ink-soft hover:border-ink-soft'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{r.label}</span>
                <span className={`text-[9px] tracking-[0.12em] ${round === i ? 'opacity-70' : 'text-ink-soft/60'}`}>{r.date}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-border p-1">
              {(['all', '1', '10'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTee(t)}
                  className={`h-9 rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${
                    tee === t ? 'bg-fairway text-primary-foreground dark:bg-gold dark:text-fairway-deep' : 'text-ink-soft'
                  }`}
                >
                  {t === 'all' ? 'All tees' : `Tee ${t}`}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-56">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a player…"
                className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-gold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline of flights */}
      <div className="container-x py-14 lg:py-20">
        <div className="relative border-l border-border pl-0">
          {flights.map((f, fi) => (
            <div key={`${f.time}-${f.tee}-${fi}`} className="relative mb-3 ml-5 border border-border bg-surface transition-colors hover:border-gold/50 lg:ml-8">
              <div className="absolute -left-[26px] top-7 h-2.5 w-2.5 rounded-full border-2 border-gold bg-background lg:-left-[34px]" />
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center lg:p-6">
                <div className="flex w-32 shrink-0 items-baseline gap-3">
                  <span className="font-serif text-2xl font-medium tabular-nums">{f.time}</span>
                  <span className="whitespace-nowrap rounded-full bg-surface-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                    Tee {f.tee}
                  </span>
                </div>
                  <div className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-3">
                    {f.players.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 sm:border-0 sm:pb-0">
                        <div>
                          <div className="text-sm font-semibold">{p.name}</div>
                          <div className="text-[9px] uppercase tracking-[0.16em] text-ink-soft">{p.country}</div>
                        </div>
                        {p.position && (
                          <div className="text-right text-[10px] font-semibold text-ink-soft">
                            <span className="mr-2 text-foreground">Pos {p.position}</span>
                            <span className={parseInt(p.toPar) < 0 ? 'score-under' : ''}>{p.toPar}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          ))}
        </div>
        {flights.length === 0 && (
          <div className="py-24 text-center font-serif text-2xl font-light italic text-ink-soft">
            No tee times match your filters.
          </div>
        )}
        <div className="mt-8 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          {flights.length} groups · {roundInfo[round].label} · {roundInfo[round].date}
        </div>
      </div>
    </div>
  );
}
