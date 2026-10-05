import { useMemo } from 'react';
import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import { CountryLine, ExpandChevron, MovementBadge, PlayerBubble, posNum, toParClass, type LeaderboardViewProps } from './shared';

/**
 * Visual leaderboard: each round renders as a small bar whose length follows
 * the round's score relative to par (the existing roundPars data). Bars never
 * replace the printed scores — they sit beneath them for instant comparison.
 */
export default function VisualLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  // Shared bar scale so bar lengths are comparable across every player.
  const scale = useMemo(() => {
    let max = 6;
    entries.forEach((p) => p.roundPars.forEach((rtp) => { if (rtp !== null && Math.abs(rtp) > max) max = Math.abs(rtp); }));
    return max;
  }, [entries]);

  return (
    <div className="border border-border">
      {/* header strip */}
      <div className="hidden items-center gap-5 border-b border-border bg-fairway-deep px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.22em] text-ivory/80 dark:bg-surface-2 dark:text-ink-soft lg:flex">
        <span className="w-12">Pos</span>
        <span className="w-64">Player</span>
        <span className="flex-1">Rounds vs Par</span>
        <span className="text-right">Total</span>
        <span className="w-16 text-right">To Par</span>
        <span className="w-5" aria-hidden="true" />
      </div>

      <div className="divide-y divide-border">
        {entries.map((p) => {
          const mv = movement.get(p.id);
          const top = posNum(p.pos) <= 10;
          const open = openId === p.id;
          return (
            <div key={p.id} className={p.pos === '1' ? 'bg-gold/10' : ''}>
              <button
                onClick={() => onToggle(p.id)}
                aria-expanded={open}
                aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
                className="w-full px-4 py-4 text-left transition-colors hover:bg-surface-2/40 lg:px-6"
              >
                <div className="flex items-center gap-5">
                  <div className="hidden w-12 shrink-0 items-center gap-1.5 lg:flex">
                    <span className={`font-serif text-lg ${top ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>{p.pos}</span>
                    <MovementBadge mv={mv} size={10} />
                  </div>

                  <PlayerBubble entry={p} sizeClass="h-10 w-10" />

                  <div className="hidden w-64 shrink-0 lg:block">
                    <div className={`font-serif text-base leading-tight ${top ? 'font-medium' : ''}`}>{p.name}</div>
                    <CountryLine entry={p} className="mt-1 text-[9px]" />
                  </div>

                  {/* round bars */}
                  <div className="hidden flex-1 items-end gap-6 lg:flex">
                    {p.rounds.map((r, i) => {
                      const rtp = p.roundPars[i];
                      const under = rtp !== null && rtp < 0;
                      const over = rtp !== null && rtp > 0;
                      const pct = rtp === null ? 0 : Math.max(12, (Math.abs(rtp) / scale) * 100);
                      return (
                        <div key={i} className="w-16">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-ink-soft">R{i + 1}</span>
                            <span className={`text-[13px] tabular-nums ${r === null ? 'text-ink-soft/40' : under ? 'font-medium text-fairway dark:text-gold-soft' : 'text-foreground/80'}`}>
                              {r ?? '—'}
                            </span>
                          </div>
                          <div className="mt-1 h-[3px] w-full bg-border/60" aria-hidden="true">
                            <div
                              className={`h-full ${under ? 'bg-fairway dark:bg-gold-soft' : over ? 'bg-destructive/70' : 'bg-ink-soft/40'}`}
                              style={{ width: `${rtp === null ? 0 : pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* identity on mobile */}
                  <div className="min-w-0 flex-1 lg:hidden">
                    <div className="flex items-center gap-2">
                      <span className="w-6 shrink-0 font-serif text-base text-ink-soft">{p.pos}</span>
                      <span className="truncate font-serif text-sm font-medium leading-tight">{p.name}</span>
                      <MovementBadge mv={mv} size={9} />
                    </div>
                    <CountryLine entry={p} className="mt-1 pl-8 text-[8px]" />
                    {/* bars on mobile */}
                    <div className="mt-2 flex items-end gap-3 pl-8">
                      {p.rounds.map((r, i) => {
                        const rtp = p.roundPars[i];
                        const under = rtp !== null && rtp < 0;
                        const over = rtp !== null && rtp > 0;
                        const pct = rtp === null ? 0 : Math.max(14, (Math.abs(rtp) / scale) * 100);
                        return (
                          <div key={i} className="w-9">
                            <div className="text-center text-[12px] tabular-nums text-foreground/80">{r ?? '—'}</div>
                            <div className="mt-0.5 h-[3px] w-full bg-border/60" aria-hidden="true">
                              <div
                                className={`h-full ${under ? 'bg-fairway dark:bg-gold-soft' : over ? 'bg-destructive/70' : 'bg-ink-soft/40'}`}
                                style={{ width: `${rtp === null ? 0 : pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-3 lg:gap-5">
                    <div className="hidden text-right lg:block">
                      <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-ink-soft">Total</div>
                      <div className="font-serif text-lg tabular-nums leading-tight">{p.totalDisplay}</div>
                    </div>
                    <div className="text-right lg:w-16">
                      <div className={`font-serif text-xl font-semibold tabular-nums leading-none lg:text-2xl ${toParClass(p)}`}>{p.toParDisplay}</div>
                      <div className="mt-1 text-[9px] tabular-nums text-ink-soft lg:hidden">{p.totalDisplay} total</div>
                    </div>
                    <ExpandChevron open={open} />
                  </div>
                </div>
              </button>
              <Expand open={open}>
                <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
              </Expand>
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
        <span className="flex items-center gap-1.5"><span className="h-[3px] w-5 bg-fairway dark:bg-gold-soft" /> Under par</span>
        <span className="flex items-center gap-1.5"><span className="h-[3px] w-5 bg-ink-soft/40" /> Level par</span>
        <span className="flex items-center gap-1.5"><span className="h-[3px] w-5 bg-destructive/70" /> Over par</span>
        <span className="hidden lg:inline">Bar length follows each round relative to par</span>
      </div>
    </div>
  );
}
