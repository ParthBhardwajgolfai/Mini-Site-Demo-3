import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import { fmtToPar, tournament } from '@/data/tournament';
import type { LeaderboardEntry } from '@/data/tournament';
import { MovementBadge, type LeaderboardViewProps } from './shared';

function groupByScore(entries: LeaderboardEntry[]) {
  const groups = new Map<number, LeaderboardEntry[]>();
  entries.forEach((entry) => groups.set(entry.toPar, [...(groups.get(entry.toPar) ?? []), entry]));
  const scores = [...groups.keys()].sort((a, b) => a - b);
  if (!scores.length) return [];
  const top = scores[0];
  const bottom = scores[scores.length - 1];
  const axis = Array.from({ length: bottom - top + 1 }, (_, index) => top + index);
  return axis.map((score) => ({ score, entries: groups.get(score) ?? [] }));
}

/** A vertical score-to-par axis: the standings' shape is visible before the names. */
export default function ScoringLadderLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const ladder = groupByScore(entries);

  return (
    <section className="overflow-hidden border border-[#b7a16b] bg-[#f2ede3] text-[#171512]">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#a8873f]/60 px-5 py-5 sm:px-7">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#a8873f]">Championship shape</p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">Scoring ladder</h2>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#5f584a]">Round {round + 1} · {tournament.venue} · par {tournament.par}</p>
        </div>
        <p className="max-w-xs text-right text-xs leading-relaxed text-[#5f584a]">Each rung is an actual score to par. Shared scores hang together.</p>
      </header>

      <div className="px-4 py-5 sm:px-7 sm:py-7">
        {ladder.map(({ score, entries: rung }) => (
          <div key={score} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-5">
            <div className="relative flex justify-end border-r border-[#a8873f]/60 pr-3 sm:pr-5">
              <span className={`relative z-10 -mt-1 bg-[#f2ede3] pr-1 font-serif text-xl font-medium tabular-nums sm:text-2xl ${score < 0 ? 'text-[#b3261e]' : score > 0 ? 'text-[#71695b]' : ''}`}>
                {fmtToPar(score)}
              </span>
              <span className={`absolute -right-[5px] top-1.5 h-2 w-2 rounded-full ${rung.length ? 'bg-[#a8873f]' : 'bg-[#d3c8b6]'}`} />
            </div>
            <div className="min-w-0 pb-4 sm:pb-5">
              {rung.length ? (
                <div className="grid gap-2 xl:grid-cols-2">
                  {rung.map((entry) => {
                    const open = openId === entry.id;
                    return (
                      <div key={entry.id} className="border border-[#171512]/15 bg-[#f8f5ee]">
                        <button
                          type="button"
                          onClick={() => onToggle(entry.id)}
                          aria-expanded={open}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-[#ede6d9] sm:px-4"
                        >
                          <span className="w-7 shrink-0 text-sm font-semibold tabular-nums text-[#5f584a]">{entry.pos}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-serif text-base font-medium sm:text-lg">{entry.name}</span>
                            <span className="mt-0.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-[#71695b]">
                              <img src={entry.flag} alt="" className="h-2.5 w-3.5 object-cover" /> {entry.country}
                            </span>
                          </span>
                          <MovementBadge mv={movement.get(entry.id)} size={11} />
                          <span className="text-right font-serif text-xl font-medium tabular-nums text-[#b3261e]">{entry.toParDisplay}</span>
                        </button>
                        <Expand open={open}>
                          <div className="border-t border-[#171512]/10 bg-[#ede6d9]">
                            <Scorecard playerId={entry.id} playerName={entry.name} position={entry.pos} total={entry.total} toParDisplay={entry.toParDisplay} initialRound={round + 1} />
                          </div>
                        </Expand>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#9a9182]">No players</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <footer className="border-t border-[#a8873f]/50 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6759] sm:px-7">
        Under par is accented · even is neutral · over par is restrained
      </footer>
    </section>
  );
}
