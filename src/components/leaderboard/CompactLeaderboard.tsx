import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import Expand from '@/components/Expand';
import PlayerAvatar from '@/components/PlayerAvatar';
import Scorecard from '@/components/Scorecard';
import { playerImageById, posNum, toParClass, type LeaderboardViewProps } from './shared';

/**
 * Dense professional leaderboard: minimal row height, small avatars, inline
 * identity. Built for scanning many players at once while keeping every data
 * column of the classic table.
 */
export default function CompactLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  return (
    <>
      {/* Desktop dense table */}
      <div className="hidden overflow-hidden border border-border lg:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gold/40 bg-fairway-deep text-[9px] font-bold uppercase tracking-[0.22em] text-ivory/80 dark:bg-surface-2 dark:text-ink-soft">
              <th className="w-14 px-3 py-2.5 text-left">Pos</th>
              <th className="px-3 py-2.5 text-left">Player</th>
              <th className="w-12 px-2 py-2.5 text-center">R1</th>
              <th className="w-12 px-2 py-2.5 text-center">R2</th>
              <th className="w-12 px-2 py-2.5 text-center">R3</th>
              <th className="w-12 px-2 py-2.5 text-center">R4</th>
              <th className="w-16 whitespace-nowrap px-3 py-2.5 text-right">Total</th>
              <th className="w-16 whitespace-nowrap px-3 py-2.5 text-right">To Par</th>
              <th className="w-9" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {entries.map((p, idx) => {
              const mv = movement.get(p.id);
              const top = posNum(p.pos) <= 10;
              const open = openId === p.id;
              return (
                <Fragment key={p.id}>
                  <tr
                    className={`lb-row cursor-pointer select-none transition-colors ${
                      p.pos === '1' ? 'bg-gold/10' : idx % 2 === 1 ? 'bg-surface-2/25' : ''
                    } ${open ? 'bg-surface-2/60' : 'hover:bg-surface-2/50'}`}
                    onClick={() => onToggle(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle(p.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={open}
                    aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
                  >
                    <td className="px-3 py-[7px]">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-serif text-[15px] ${top ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>
                          {p.pos}
                        </span>
                        {mv !== undefined && mv !== 0 && (
                          <span className={`text-[8px] font-bold ${mv > 0 ? 'text-fairway dark:text-gold-soft' : 'text-destructive'}`}>
                            {mv > 0 ? '▲' : '▼'}{Math.abs(mv)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-[7px]">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2">
                          <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                        </div>
                        <span className={`whitespace-nowrap font-serif text-sm leading-none ${top ? 'font-medium' : ''}`}>{p.name}</span>
                        <img src={p.flag} alt={p.country} title={p.country} className="h-2.5 w-3.5 rounded-[1px] object-cover opacity-90" loading="lazy" />
                      </div>
                    </td>
                    {p.rounds.map((r, i) => (
                      <td key={i} className="px-2 py-[7px] text-center text-[13px] tabular-nums text-ink-soft">
                        {r ?? <span className="text-ink-soft/40">—</span>}
                      </td>
                    ))}
                    <td className="px-3 py-[7px] text-right font-serif text-sm tabular-nums">{p.totalDisplay}</td>
                    <td className={`px-3 py-[7px] text-right text-sm font-semibold tabular-nums ${toParClass(p)}`}>
                      {p.toParDisplay}
                    </td>
                    <td className="pr-3 text-right">
                      <ChevronDown size={13} className={`ml-auto text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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

      {/* Mobile dense list */}
      <div className="divide-y divide-border border-y border-border lg:hidden">
        {entries.map((p) => {
          const mv = movement.get(p.id);
          const open = openId === p.id;
          return (
            <div key={p.id} className={p.pos === '1' ? 'bg-gold/10' : ''}>
              <button onClick={() => onToggle(p.id)} aria-expanded={open} className="w-full px-1 py-2.5 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 shrink-0 text-center font-serif text-[15px] text-ink-soft">{p.pos}</span>
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2">
                    <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif text-sm font-medium leading-tight">{p.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[8px] uppercase tracking-[0.14em] text-ink-soft">
                      <img src={p.flag} alt="" className="h-2.5 w-3.5 rounded-[1px] object-cover" loading="lazy" />
                      {p.country}
                      {mv !== undefined && mv !== 0 && (
                        <span className={`ml-1 font-bold ${mv > 0 ? 'text-fairway dark:text-gold-soft' : 'text-destructive'}`}>
                          {mv > 0 ? '▲' : '▼'}{Math.abs(mv)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden shrink-0 gap-2.5 text-center text-[13px] tabular-nums text-ink-soft min-[420px]:flex">
                    {p.rounds.map((r, i) => (
                      <span key={i} className="w-5">
                        {r ?? <span className="text-ink-soft/40">—</span>}
                      </span>
                    ))}
                  </div>
                  <div className="shrink-0 text-right leading-tight">
                    <span className={`font-serif text-[15px] font-semibold tabular-nums ${toParClass(p)}`}>{p.toParDisplay}</span>
                    <div className="text-[10px] tabular-nums text-ink-soft">{p.totalDisplay}</div>
                  </div>
                  <ChevronDown size={13} className={`shrink-0 text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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
