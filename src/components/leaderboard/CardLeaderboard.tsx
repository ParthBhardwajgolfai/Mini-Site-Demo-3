import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import { CountryLine, ExpandChevron, MovementBadge, PlayerBubble, posNum, toParClass, type LeaderboardViewProps } from './shared';

/**
 * Player-card leaderboard: every row is a self-contained card with a prominent
 * position, identity block and score stack. Same data, stronger hierarchy.
 */
export default function CardLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  return (
    <div className="space-y-3">
      {entries.map((p) => {
        const mv = movement.get(p.id);
        const top = posNum(p.pos) <= 10;
        const open = openId === p.id;
        const leader = p.pos === '1';
        return (
          <div
            key={p.id}
            className={`border bg-surface transition-colors ${
              leader ? 'border-gold/50 border-l-2 border-l-gold bg-gold/5' : 'hover:border-ink-soft/40'
            } ${open ? 'border-ink-soft/40' : ''}`}
          >
            <button
              onClick={() => onToggle(p.id)}
              aria-expanded={open}
              aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
              className="w-full p-4 text-left lg:px-6 lg:py-5"
            >
              <div className="flex items-center gap-4 lg:gap-6">
                {/* position */}
                <div className="flex w-10 shrink-0 flex-col items-center lg:w-12">
                  <span className={`font-serif text-3xl leading-none lg:text-4xl ${top ? 'font-medium text-fairway dark:text-gold-soft' : 'text-ink-soft'}`}>
                    {p.pos}
                  </span>
                  <span className="mt-1.5">
                    <MovementBadge mv={mv} size={10} />
                  </span>
                </div>

                <span className="hidden w-px self-stretch bg-border lg:block" aria-hidden="true" />

                {/* identity */}
                <PlayerBubble entry={p} sizeClass="h-12 w-12 lg:h-14 lg:w-14" />
                <div className="min-w-0">
                  <div className={`truncate font-serif text-lg leading-tight lg:text-xl ${top ? 'font-medium' : ''}`}>{p.name}</div>
                  <CountryLine entry={p} className="mt-1.5 text-[9px] lg:text-[10px]" />
                </div>

                {/* scores */}
                <div className="ml-auto flex items-center gap-5 lg:gap-8">
                  <div className="hidden items-stretch gap-5 lg:flex">
                    {p.rounds.map((r, i) => (
                      <div key={i} className="text-center">
                        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-ink-soft">R{i + 1}</div>
                        <div className="mt-1 text-lg tabular-nums text-ink-soft">{r ?? <span className="text-ink-soft/40">—</span>}</div>
                      </div>
                    ))}
                  </div>
                  <span className="hidden w-px self-stretch bg-border lg:block" aria-hidden="true" />
                  <div className="text-right">
                    <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-ink-soft">Total</div>
                    <div className="mt-0.5 font-serif text-2xl tabular-nums leading-none">{p.totalDisplay}</div>
                    <div className={`mt-1 font-serif text-lg tabular-nums leading-none font-semibold ${toParClass(p)}`}>{p.toParDisplay}</div>
                  </div>
                  <ExpandChevron open={open} />
                </div>
              </div>

              {/* compact rounds strip on small screens */}
              <div className="mt-3 flex gap-2 border-t border-border pt-3 lg:hidden">
                {p.rounds.map((r, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-ink-soft">R{i + 1}</div>
                    <div className="mt-0.5 text-sm tabular-nums text-ink-soft">{r ?? '—'}</div>
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
  );
}
