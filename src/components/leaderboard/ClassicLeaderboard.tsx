import { Fragment } from 'react';
import { ChevronDown, Minus, MoveDown, MoveUp } from 'lucide-react';
import Expand from '@/components/Expand';
import PlayerAvatar from '@/components/PlayerAvatar';
import Scorecard from '@/components/Scorecard';
import { playerImageById, posNum, type LeaderboardViewProps } from './shared';

/**
 * The original leaderboard, extracted verbatim from the page. Desktop renders
 * the full table; mobile renders the stacked list. Do not restyle — this is
 * the reference design the other visualizations branch away from.
 */
export default function ClassicLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const toggle = onToggle;
  return (
    <>
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
            {entries.map((p) => {
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
        {entries.map((p) => {
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
    </>
  );
}
