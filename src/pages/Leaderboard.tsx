import { useMemo, useState } from 'react';
import { MoveUp, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import PartnerMark from '@/components/PartnerMark';
import { LeaderboardDesignSelector, LeaderboardRenderer, type LeaderboardDesignId } from '@/components/leaderboard';
import { leaderboard, partners, tournament } from '@/data/tournament';

const roundLabels = ['Round 1', 'Round 2', 'Round 3', 'Final Round'];
const roundDates = ['Tue 10 Feb', 'Wed 11 Feb', 'Thu 12 Feb', 'Fri 13 Feb'];

const stripItems: ({ label: string } | { partner: string })[] = [
  { label: 'Champion — Honey Baisoya · −23' },
  { partner: partners.title.name },
  { label: `${tournament.venue} · ${tournament.city}` },
  { partner: 'IndusInd Bank' },
  { label: `${tournament.purse} Prize Purse` },
  { partner: 'Amul' },
  { label: '126 Players · 56 Made the Cut' },
  { partner: 'Campa' },
  { label: `Par ${tournament.par} · ${tournament.yardage}` },
  { partner: 'Victorious Choice' },
  { label: tournament.format },
  { partner: 'Electro+' },
  { partner: 'Golf Plus Monthly' },
];

function posNum(pos: string): number {
  const n = parseInt(pos.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? 999 : n;
}

export default function Leaderboard() {
  const [round, setRound] = useState(3); // default: final round
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const [design, setDesign] = useState<LeaderboardDesignId>('classic');

  const board = leaderboard[round].items;
  const prevBoard = round > 0 ? leaderboard[round - 1].items : null;

  const movement = useMemo(() => {
    if (!prevBoard) return new Map<number, number>();
    const prev = new Map(prevBoard.map((p) => [p.id, posNum(p.pos)]));
    const map = new Map<number, number>();
    board.forEach((p) => {
      const before = prev.get(p.id);
      if (before !== undefined) map.set(p.id, before - posNum(p.pos));
    });
    return map;
  }, [board, prevBoard]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? board.filter((p) => p.name.toLowerCase().includes(q)) : board;
  }, [board, query]);

  const toggle = (id: number) => setOpenId((o) => (o === id ? null : id));

  return (
    <div>
      <PageHero
        eyebrow="Live Scoring"
        title={
          <>
            The <span className="italic text-fairway dark:text-gold-soft">leaderboard</span>
          </>
        }
        intro={`Complete scoring from all four rounds at ${tournament.venue}. The cut fell after Round 2, reducing the field to the top 50 and ties. Select any player for their hole-by-hole scorecard.`}
      />

      {/* Tournament & partner information strip */}
      <div className="overflow-hidden border-y border-border bg-background py-3.5" aria-hidden="true">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[0, 1].map((n) => (
            <div key={n} className="flex items-center gap-10 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
              {stripItems.map((item) => (
                <span key={'partner' in item ? item.partner : item.label} className="flex items-center gap-10">
                  {'partner' in item ? <PartnerMark name={item.partner} size="sm" /> : item.label}
                  <span className="h-1 w-1 rounded-full bg-gold" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Partner band */}
      <div className="border-b border-border bg-surface-2/40 dark:bg-surface/40">
        <div className="container-x flex flex-col items-center gap-4 py-6 lg:flex-row lg:justify-between lg:gap-10">
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.28em] text-ink-soft">
            Tournament Partners
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <PartnerMark name={partners.title.name} className="pr-2" />
            <span className="hidden h-5 w-px bg-border lg:block" />
            {[...partners.official, ...partners.supporting].map((p) => (
              <PartnerMark key={p.name} name={p.name} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-xl lg:top-20">
        <div className="container-x flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {roundLabels.map((l, i) => (
              <button
                key={l}
                onClick={() => setRound(i)}
                className={`flex h-11 shrink-0 flex-col justify-center rounded-full border px-5 transition-colors ${
                  round === i
                    ? 'border-fairway bg-fairway text-primary-foreground dark:border-gold dark:bg-gold dark:text-fairway-deep'
                    : 'border-border text-ink-soft hover:border-ink-soft'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{l}</span>
                <span className={`text-[9px] tracking-[0.12em] ${round === i ? 'opacity-70' : 'text-ink-soft/60'}`}>{roundDates[i]}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leaderboard…"
              className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-gold"
            />
          </div>
        </div>
      </div>

      <div className="container-x py-12 lg:py-16">
        {/* Leaderboard visualization selector */}
        <LeaderboardDesignSelector value={design} onChange={setDesign} className="mb-8" />

        {/* Active visualization — all designs consume the same data */}
        <div key={design} className="lb-design-enter">
          <LeaderboardRenderer
            design={design}
            entries={filtered}
            movement={movement}
            openId={openId}
            onToggle={toggle}
            round={round}
          />
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center font-serif text-2xl font-light italic text-ink-soft">
            No players match your search.
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          <span>{board.length} players · {roundLabels[round]}</span>
          <span className="flex items-center gap-1.5"><MoveUp size={11} className="text-fairway dark:text-gold-soft" /> positions gained vs previous round</span>
          <span className="flex items-center gap-1.5">Select a player for the hole-by-hole scorecard</span>
        </div>
      </div>
    </div>
  );
}
