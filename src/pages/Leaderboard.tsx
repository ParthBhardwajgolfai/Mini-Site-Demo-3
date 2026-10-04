import { Fragment, useMemo, useState } from 'react';
import { ChevronDown, Minus, MoveDown, MoveUp, Search } from 'lucide-react';
import Expand from '@/components/Expand';
import PageHero from '@/components/PageHero';
import PartnerMark from '@/components/PartnerMark';
import PlayerAvatar from '@/components/PlayerAvatar';
import Scorecard from '@/components/Scorecard';
import { leaderboard, partners, players, tournament } from '@/data/tournament';

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

const playerImageById = new Map(players.map((player) => [player.id, player.image]));

function posNum(pos: string): number {
  const n = parseInt(pos.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? 999 : n;
}

export default function Leaderboard() {
  const [round, setRound] = useState(3); // default: final round
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

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
        {/* Desktop table */}
        <div className="hidden overflow-hidden border border-border lg:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-fairway-deep text-[10px] font-bold uppercase tracking-[0.18em] text-ivory/80 dark:bg-surface-2 dark:text-ink-soft">
                <th className="px-5 py-4 text-left w-20">Pos</th>
                <th className="px-5 py-4 text-left">Player</th>
                <th className="px-3 py-4 text-center">R1</th>
                <th className="px-3 py-4 text-center">R2</th>
                <th className="px-3 py-4 text-center">R3</th>
                <th className="px-3 py-4 text-center">R4</th>
                <th className="px-5 py-4 text-right">Total</th>
                <th className="px-5 py-4 text-right">To Par</th>
                <th className="w-12" aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const mv = movement.get(p.id);
                const isLeader = p.pos === '1';
                const top = posNum(p.pos) <= 10;
                const open = openId === p.id;
                return (
                  <Fragment key={p.id}>
                    <tr
                      className={`lb-row cursor-pointer border-b border-border select-none ${isLeader ? 'bg-gold/10' : ''} ${open ? 'bg-surface-2/50' : ''}`}
                      onClick={() => toggle(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggle(p.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={open}
                      aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-serif text-lg ${top ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>
                            {p.pos}
                          </span>
                          {mv !== undefined && mv !== 0 && (
                            <span className={`flex items-center text-[9px] font-bold ${mv > 0 ? 'text-fairway dark:text-gold-soft' : 'text-destructive'}`}>
                              {mv > 0 ? <MoveUp size={11} /> : <MoveDown size={11} />}
                              {Math.abs(mv)}
                            </span>
                          )}
                          {mv === 0 && <Minus size={10} className="text-ink-soft/50" />}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2 ring-2 ring-background">
                            <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                          </div>
                          <div>
                            <div className={`font-serif text-base leading-tight ${top ? 'font-medium' : ''}`}>{p.name}</div>
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                              <img src={p.flag} alt="" className="h-3 w-4 rounded-[1px] object-cover" loading="lazy" />
                              {p.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      {p.rounds.map((r, i) => (
                        <td key={i} className="px-3 py-4 text-center tabular-nums text-ink-soft">
                          {r ?? <span className="text-ink-soft/40">—</span>}
                        </td>
                      ))}
                      <td className="px-5 py-4 text-right font-serif text-base tabular-nums">{p.totalDisplay}</td>
                      <td className={`px-5 py-4 text-right font-serif text-lg tabular-nums font-semibold ${p.toPar < 0 ? 'score-under' : p.toPar === 0 ? '' : 'text-destructive'}`}>
                        {p.toParDisplay}
                      </td>
                      <td className="pr-4 text-right">
                        <ChevronDown size={15} className={`ml-auto text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                      </td>
                    </tr>
                    <tr className={open ? 'border-b border-border' : ''}>
                      <td colSpan={9} className="p-0">
                        <Expand open={open}>
                          <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
                        </Expand>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="space-y-3 lg:hidden">
          {filtered.map((p) => {
            const mv = movement.get(p.id);
            const top = posNum(p.pos) <= 10;
            const open = openId === p.id;
            return (
              <div key={p.id} className={`border border-border ${p.pos === '1' ? 'bg-gold/10' : 'bg-surface'}`}>
                <button
                  onClick={() => toggle(p.id)}
                  aria-expanded={open}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span className={`w-8 font-serif text-xl ${top ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>
                        {p.pos}
                      </span>
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2 ring-2 ring-background">
                        <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-serif text-base font-medium leading-tight">{p.name}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-ink-soft">
                          <img src={p.flag} alt="" className="h-3 w-4 rounded-[1px] object-cover" loading="lazy" />
                          {p.country}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-right">
                      <div>
                        <div className={`font-serif text-xl font-semibold tabular-nums ${p.toPar < 0 ? 'score-under' : ''}`}>{p.toParDisplay}</div>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-ink-soft">
                          <span>{p.totalDisplay}</span>
                          {mv !== undefined && mv !== 0 && (
                            <span className={`flex items-center font-bold ${mv > 0 ? 'text-fairway dark:text-gold-soft' : 'text-destructive'}`}>
                              {mv > 0 ? <MoveUp size={10} /> : <MoveDown size={10} />}{Math.abs(mv)}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown size={15} className={`text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-border pt-3">
                    {p.rounds.map((r, ri) => (
                      <div key={ri} className="flex-1 text-center">
                        <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-ink-soft">R{ri + 1}</div>
                        <div className="mt-0.5 text-sm tabular-nums">{r ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                </button>
                <Expand open={open}>
                  <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
                </Expand>
              </div>
            );
          })}
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
