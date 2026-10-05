import Expand from '@/components/Expand';
import PlayerAvatar from '@/components/PlayerAvatar';
import Scorecard from '@/components/Scorecard';
import type { LeaderboardEntry } from '@/data/tournament';
import { CountryLine, ExpandChevron, MovementBadge, playerImageById, toParClass, type LeaderboardViewProps } from './shared';

/**
 * Podium view: the leading trio is presented as centred podium cards while the
 * complete ranking stays available underneath — nothing is removed.
 */
export default function PodiumLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const podium = entries.slice(0, 3);
  const champion = podium[0];
  const tournamentOver = round === 3;

  return (
    <div>
      {/* podium */}
      {podium.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
          {[podium[1], podium[0], podium[2]].filter((p): p is LeaderboardEntry => Boolean(p)).map((p) => {
            const isChampion = p.id === champion.id;
            const mv = movement.get(p.id);
            return (
              <div
                key={p.id}
                className={`flex flex-col border bg-surface text-center ${
                  isChampion ? 'order-first border-gold/60 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] sm:order-none lg:-translate-y-3' : ''
                }`}
              >
                <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-7">
                  {isChampion && tournamentOver && (
                    <span className="eyebrow mb-3 text-[9px] tracking-[0.3em]">Champion</span>
                  )}
                  <div className={`relative shrink-0 overflow-hidden rounded-full border bg-surface-2 ring-2 ring-background ${isChampion ? 'h-20 w-20 border-gold/60 ring-4 ring-gold/20' : 'h-16 w-16 border-border'}`}>
                    <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className={`font-serif text-3xl leading-none ${isChampion ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>
                      {p.pos}
                    </span>
                    <MovementBadge mv={mv} size={11} />
                  </div>

                  <div className="mt-2 font-serif text-xl leading-tight">{p.name}</div>
                  <CountryLine entry={p} className="mt-1.5 justify-center text-[9px]" />

                  <div className="mt-4 flex items-center gap-1.5 text-sm tabular-nums text-ink-soft">
                    {p.rounds.map((r, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-ink-soft/40">·</span>}
                        {r ?? '—'}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex w-full items-end justify-center gap-6 border-t border-border pt-4">
                    <div>
                      <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-ink-soft">Total</div>
                      <div className="mt-0.5 font-serif text-2xl tabular-nums leading-none">{p.totalDisplay}</div>
                    </div>
                    <span className="h-8 w-px self-center bg-border" aria-hidden="true" />
                    <div>
                      <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-ink-soft">To Par</div>
                      <div className={`mt-0.5 font-serif text-2xl font-semibold tabular-nums leading-none ${toParClass(p)}`}>{p.toParDisplay}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* full ranking */}
      <div className="mb-4 flex items-center gap-4">
        <span className="eyebrow shrink-0">Full Leaderboard</span>
        <span className="hairline flex-1" aria-hidden="true" />
      </div>

      <div className="divide-y divide-border border border-border">
        {entries.map((p) => {
          const mv = movement.get(p.id);
          const open = openId === p.id;
          const top = podium.some((t) => t.id === p.id);
          return (
            <div key={p.id} className={p.pos === '1' ? 'bg-gold/10' : ''}>
              <button
                onClick={() => onToggle(p.id)}
                aria-expanded={open}
                aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
                className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-2/40 lg:px-6"
              >
                <div className="flex w-10 shrink-0 items-center gap-1.5">
                  <span className={`font-serif text-base ${top ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>{p.pos}</span>
                  <MovementBadge mv={mv} size={9} />
                </div>
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2">
                  <PlayerAvatar name={p.name} image={playerImageById.get(p.id) ?? null} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-[15px] leading-tight">{p.name}</div>
                  <CountryLine entry={p} className="mt-0.5 text-[8px] lg:hidden" />
                </div>
                <div className="hidden shrink-0 items-center gap-5 lg:flex">
                  {p.rounds.map((r, i) => (
                    <span key={i} className="w-7 text-center text-sm tabular-nums text-ink-soft">
                      {r ?? <span className="text-ink-soft/40">—</span>}
                    </span>
                  ))}
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0 lg:gap-6">
                  <span className="font-serif text-base tabular-nums">{p.totalDisplay}</span>
                  <span className={`w-12 text-right font-serif text-lg font-semibold tabular-nums ${toParClass(p)}`}>{p.toParDisplay}</span>
                  <ExpandChevron open={open} size={13} />
                </div>
              </button>
              <Expand open={open}>
                <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
              </Expand>
            </div>
          );
        })}
      </div>
    </div>
  );
}
