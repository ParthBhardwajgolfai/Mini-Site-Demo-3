import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import Expand from '@/components/Expand';
import PlayerAvatar from '@/components/PlayerAvatar';
import Scorecard from '@/components/Scorecard';
import type { LeaderboardEntry } from '@/data/tournament';
import { CountryLine, MovementBadge, playerImageById, posNum, type LeaderboardViewProps } from './shared';

/** Round score tint: softly emphasised when under par, quiet otherwise. */
function roundClass(rtp: number | null): string {
  if (rtp === null) return 'text-ink-soft';
  if (rtp < 0) return 'font-medium text-fairway dark:text-gold-soft';
  if (rtp > 0) return 'text-ink-soft';
  return 'text-foreground/80';
}

/**
 * Premium tour-editorial leaderboard: generous rhythm, a strong ruled header,
 * stacked movement under the position, and to-par set as a quiet medal.
 */
export default function ScorecardLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  return (
    <>
      {/* Desktop editorial table */}
      <div className="hidden overflow-hidden border border-border lg:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gold/50 bg-fairway-deep text-[10px] font-bold uppercase tracking-[0.24em] text-ivory/85 dark:bg-surface-2 dark:text-ink-soft">
              <th className="w-24 px-6 py-5 text-left">Pos</th>
              <th className="px-5 py-5 text-left">Player</th>
              <th className="w-16 px-3 py-5 text-center">R1</th>
              <th className="w-16 px-3 py-5 text-center">R2</th>
              <th className="w-16 px-3 py-5 text-center">R3</th>
              <th className="w-16 px-3 py-5 text-center">R4</th>
              <th className="w-24 px-5 py-5 text-right">Total</th>
              <th className="w-24 px-5 py-5 text-right">To Par</th>
              <th className="w-14" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {entries.map((p) => {
              const mv = movement.get(p.id);
              const top = posNum(p.pos) <= 10;
              const open = openId === p.id;
              const leader = p.pos === '1';
              return (
                <Fragment key={p.id}>
                  <tr
                    className={`lb-row cursor-pointer select-none border-b border-border/70 transition-colors last:border-b-0 ${
                      leader ? 'bg-gold/10' : ''
                    } ${open ? 'bg-surface-2/60' : 'hover:bg-surface-2/40'}`}
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
                    <td className="px-6 py-5 align-middle">
                      <div className="flex flex-col items-start">
                        <span className={`font-serif text-2xl leading-none ${top ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>
                          {p.pos}
                        </span>
                        <span className="mt-1.5 ml-0.5">
                          <MovementBadge mv={mv} size={10} />
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2 ring-2 ring-background">
                          <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                        </div>
                        <div>
                          <div className={`font-serif text-lg leading-tight ${top ? 'font-medium' : ''}`}>{p.name}</div>
                          <CountryLine entry={p} className="mt-1.5 text-[9px]" />
                        </div>
                      </div>
                    </td>
                    {p.rounds.map((r, i) => (
                      <td key={i} className={`px-3 py-5 text-center text-[15px] tabular-nums ${r === null ? 'text-ink-soft/40' : roundClass(p.roundPars[i])}`}>
                        {r ?? '—'}
                      </td>
                    ))}
                    <td className="px-5 py-5 text-right font-serif text-lg tabular-nums font-medium">{p.totalDisplay}</td>
                    <td className="px-5 py-5 text-right">
                      <ToParMedal entry={p} />
                    </td>
                    <td className="pr-5 text-right">
                      <ChevronDown size={15} className={`text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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

      {/* Mobile editorial list */}
      <div className="divide-y divide-border border-y border-border lg:hidden">
        {entries.map((p) => {
          const mv = movement.get(p.id);
          const open = openId === p.id;
          return (
            <div key={p.id} className={p.pos === '1' ? 'bg-gold/10' : ''}>
              <button onClick={() => onToggle(p.id)} aria-expanded={open} className="w-full px-1 py-4 text-left">
                <div className="flex items-center gap-3.5">
                  <div className="flex w-9 shrink-0 flex-col items-center">
                    <span className="font-serif text-xl leading-none text-ink-soft">{p.pos}</span>
                    <span className="mt-1">
                      <MovementBadge mv={mv} size={9} />
                    </span>
                  </div>
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2 ring-2 ring-background">
                    <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif text-base font-medium leading-tight">{p.name}</div>
                    <CountryLine entry={p} className="mt-1 text-[8px]" />
                  </div>
                  <div className="shrink-0 text-right">
                    <ToParMedal entry={p} />
                    <div className="mt-1 text-[10px] tabular-nums text-ink-soft">Total {p.totalDisplay}</div>
                  </div>
                  <ChevronDown size={15} className={`shrink-0 text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </div>
                <div className="mt-3 flex gap-2 border-t border-border/70 pt-2.5">
                  {p.rounds.map((r, i) => (
                    <div key={i} className="flex-1 text-center">
                      <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-ink-soft">R{i + 1}</div>
                      <div className={`mt-0.5 text-sm tabular-nums ${r === null ? 'text-ink-soft/40' : roundClass(p.roundPars[i])}`}>{r ?? '—'}</div>
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

function ToParMedal({ entry: p }: { entry: LeaderboardEntry }) {
  const cls =
    p.toPar < 0
      ? 'border-fairway/40 text-fairway dark:border-gold-soft/50 dark:text-gold-soft'
      : p.toPar > 0
        ? 'border-destructive/40 text-destructive'
        : 'border-border text-ink-soft';
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 font-serif text-sm font-semibold tabular-nums ${cls}`}>
      {p.toParDisplay}
    </span>
  );
}
