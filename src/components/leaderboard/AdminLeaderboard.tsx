import { ChevronDown, ChevronUp } from 'lucide-react';
import Expand from '@/components/Expand';
import PlayerAvatar from '@/components/PlayerAvatar';
import Scorecard from '@/components/Scorecard';
import { playerImageById, type LeaderboardViewProps } from './shared';

// ════════════════════════════════════════════════════════════════════════
// ADMIN — ported from Scoring-Tournament `apps/admin-web` `LeaderboardRow.tsx`
// (the Live Command Center leaderboard). A dense operator table on white:
// 11-column grid, avatar initials, a category-chip slot, "±Par" with a GOLD
// accent for under-par (the source's explicit rule: never red/green for
// score-to-par), a gold 4px left border on the leader, Thru / Round columns,
// and the movement chevron sitting inside the Total cell. Rows with a status
// ride at 50% opacity — none exist in this payload, so no dimming appears.
// The Round column is the selected round's gross; Thru reads F because the
// tournament is complete.
// ════════════════════════════════════════════════════════════════════════

const GOLD = '#B45309'; // the source's under-par accent, warmed to pass AA on white

const GRID =
  'minmax(0,1fr) 44px repeat(4, 44px) 56px 64px 64px 72px 26px';

function MovementGlyph({ mv }: { mv: number | undefined }) {
  if (mv == null || mv === 0) return null;
  const Icon = mv > 0 ? ChevronUp : ChevronDown;
  return (
    <span className="inline-flex items-center text-[10px] tabular-nums text-gray-400">
      <Icon className="h-3 w-3" strokeWidth={2.25} />
      {Math.abs(mv)}
    </span>
  );
}

export default function AdminLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  return (
    <>
      {/* Desktop — the operator grid */}
      <div className="hidden overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm lg:block">
        {/* header — same grid as the rows so labels line up with values */}
        <div
          className="grid items-center gap-x-3 border-b border-gray-200 bg-gray-50 py-2 text-[11px] font-medium uppercase tracking-wider text-gray-500"
          style={{ gridTemplateColumns: GRID, paddingLeft: 12, paddingRight: 12 }}
        >
          <span>Player</span>
          <span className="text-right">Pos</span>
          {['R1', 'R2', 'R3', 'R4'].map((r) => (
            <span key={r} className="text-right tabular-nums">{r}</span>
          ))}
          <span className="text-right">±Par</span>
          <span className="text-right">Thru</span>
          <span className="text-right">Round</span>
          <span className="text-right">Total</span>
          <span aria-hidden />
        </div>

        {entries.map((p) => {
          const mv = movement.get(p.id);
          const open = openId === p.id;
          const leader = p.pos === '1';
          const today = p.rounds[round];
          return (
            <div key={p.id}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
                onClick={() => onToggle(p.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(p.id); }
                }}
                className={`grid cursor-pointer items-center gap-x-3 border-b border-gray-100 py-1.5 transition-colors hover:bg-amber-50/60 ${
                  open ? 'bg-amber-50/80' : 'bg-white'
                } ${leader ? 'border-l-4 border-l-gold' : ''}`}
                style={{ gridTemplateColumns: GRID, paddingLeft: leader ? 9 : 12, paddingRight: 12 }}
              >
                {/* player */}
                <div className="flex min-w-0 items-center gap-2">
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-100 text-[9px]">
                    <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                  </div>
                  <span className="truncate text-[13px] font-semibold text-gray-900">{p.name}</span>
                  <img src={p.flag} alt="" className="h-2.5 w-3.5 shrink-0 rounded-[1px] object-cover" loading="lazy" />
                </div>

                {/* position */}
                <div className="text-right text-[13px] font-medium tabular-nums text-gray-900">{p.pos}</div>

                {/* rounds */}
                {p.rounds.map((v, i) => (
                  <div key={i} className={`text-right text-[13px] tabular-nums ${v != null ? 'text-gray-500' : 'text-gray-300'}`}>
                    {v ?? '—'}
                  </div>
                ))}

                {/* ±Par — gold when under par, never red */}
                <div className={`text-right text-[13px] font-medium tabular-nums ${p.toPar < 0 ? '' : 'text-gray-900'}`} style={p.toPar < 0 ? { color: GOLD } : undefined}>
                  {p.toParDisplay}
                </div>

                {/* thru */}
                <div className="text-right text-[13px] tabular-nums text-gray-500">F</div>

                {/* round — the selected round's gross */}
                <div className="text-right text-[13px] font-semibold tabular-nums text-gray-900">
                  {today ?? '—'}
                </div>

                {/* total + movement glyph */}
                <div className="flex items-center justify-end gap-1 text-right text-sm font-semibold tabular-nums text-gray-900">
                  {p.totalDisplay}
                  <MovementGlyph mv={mv} />
                </div>

                <ChevronDown size={13} className={`justify-self-end text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
              </div>

              <div className={open ? 'border-b border-gray-100' : ''}>
                <Expand open={open}>
                  <div className="bg-white">
                    <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
                  </div>
                </Expand>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile — the source's 2-line stacked variant */}
      <div className="space-y-2 lg:hidden">
        {entries.map((p) => {
          const mv = movement.get(p.id);
          const open = openId === p.id;
          const leader = p.pos === '1';
          const today = p.rounds[round];
          return (
            <div key={p.id} className={`rounded-md border border-gray-200 bg-white shadow-sm ${leader ? 'border-l-4 border-l-gold' : ''}`}>
              <button onClick={() => onToggle(p.id)} aria-expanded={open} className="w-full px-4 py-2.5 text-left">
                <div className="flex items-baseline gap-2">
                  <span className="w-8 shrink-0 text-[13px] font-medium tabular-nums text-gray-900">{p.pos}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-gray-900">{p.name}</span>
                  <img src={p.flag} alt="" className="h-2.5 w-3.5 shrink-0 rounded-[1px] object-cover" loading="lazy" />
                </div>
                <div className="mt-1 flex items-baseline gap-3 text-[13px] tabular-nums">
                  <span className="w-10 shrink-0 font-medium" style={p.toPar < 0 ? { color: GOLD } : undefined}>
                    {p.toParDisplay}
                  </span>
                  <span className="shrink-0 text-gray-500">F</span>
                  {today != null && <span className="shrink-0 text-gray-500">R{round + 1}: {today}</span>}
                  <span className="ml-auto flex items-center gap-1 font-semibold text-gray-900">
                    {p.totalDisplay}
                    <MovementGlyph mv={mv} />
                  </span>
                  <ChevronDown size={13} className={`shrink-0 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <Expand open={open}>
                <div className="border-t border-gray-100">
                  <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
                </div>
              </Expand>
            </div>
          );
        })}
      </div>

      {/* legend — the source's column semantics, stated once */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        <span>Under par shown in gold · Thru F — tournament complete</span>
        <span>Round column follows the selected round above</span>
      </div>
    </>
  );
}
