import { useEffect, useState } from 'react';
import { getHoleData, type HoleScore, type PlayerHoleData } from '@/data/tournament';
import { fmtToPar } from '@/data/tournament';

/** Golf notation glyph: circle for under par (double for eagle), square for over (double for 2+). */
function ScoreGlyph({ h }: { h: HoleScore }) {
  const base =
    'relative flex h-7 w-7 items-center justify-center text-[13px] font-semibold tabular-nums';
  if (h.delta < 0) {
    const double = h.delta <= -2;
    return (
      <span className={`${base} rounded-full border border-fairway text-fairway dark:border-gold-soft dark:text-gold-soft`}>
        {double && (
          <span className="absolute inset-[3px] rounded-full border border-fairway/70 dark:border-gold-soft/70" />
        )}
        {h.score}
      </span>
    );
  }
  if (h.delta > 0) {
    const double = h.delta >= 2;
    return (
      <span className={`${base} rounded-[4px] border border-destructive/60 text-destructive`}>
        {double && <span className="absolute inset-[3px] rounded-[2px] border border-destructive/60" />}
        {h.score}
      </span>
    );
  }
  return <span className={`${base} text-foreground`}>{h.score}</span>;
}

function NineBlock({
  title,
  holes,
  total,
  parTotal,
}: {
  title: string;
  holes: HoleScore[];
  total: number;
  parTotal: number;
}) {
  if (!holes.length) return null;
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">{title}</span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          Par <span className="font-semibold text-foreground">{parTotal}</span> ·{' '}
          <span className={total < parTotal ? 'score-under' : total > parTotal ? 'text-destructive' : 'font-semibold'}>
            {fmtToPar(total - parTotal)}
          </span>
        </span>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[300px]">
          {/* hole numbers */}
          <div className="grid grid-cols-[2.2rem_repeat(9,1fr)_2.6rem] gap-px">
            <span />
            {holes.map((h) => (
              <span key={h.hole} className="py-1 text-center text-[9px] font-bold uppercase tracking-wider text-ink-soft/70">
                {h.hole}
              </span>
            ))}
            <span />
          </div>
          {/* par */}
          <div className="grid grid-cols-[2.2rem_repeat(9,1fr)_2.6rem] gap-px border-t border-border">
            <span className="flex items-center py-1.5 text-[9px] font-bold uppercase tracking-wider text-ink-soft">Par</span>
            {holes.map((h) => (
              <span key={h.hole} className="py-1.5 text-center text-[11px] tabular-nums text-ink-soft">
                {h.par}
              </span>
            ))}
            <span className="py-1.5 text-center text-[11px] font-semibold tabular-nums text-ink-soft">{parTotal}</span>
          </div>
          {/* score */}
          <div className="grid grid-cols-[2.2rem_repeat(9,1fr)_2.6rem] items-center gap-px border-t border-border bg-surface-2/40">
            <span className="py-1.5 text-[9px] font-bold uppercase tracking-wider text-ink-soft">Score</span>
            {holes.map((h) => (
              <span key={h.hole} className="flex justify-center py-1.5">
                <ScoreGlyph h={h} />
              </span>
            ))}
            <span className={`py-1.5 text-center font-serif text-sm font-semibold tabular-nums ${total < parTotal ? 'score-under' : ''}`}>
              {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScorecardProps {
  playerId: number;
  playerName: string;
  position: string;
  total: number;
  toParDisplay: string;
  initialRound: number;
}

/**
 * Hole-by-hole scorecard panel shown inside an expanded leaderboard row.
 * Front 9 / back 9 blocks with par row, score glyphs and nine/round totals.
 */
export default function Scorecard({ playerId, playerName, position, total, toParDisplay, initialRound }: ScorecardProps) {
  const rounds = [1, 2, 3, 4].filter((r) => getHoleData(playerId, r));
  const [round, setRound] = useState(rounds.includes(initialRound) ? initialRound : rounds[rounds.length - 1] ?? initialRound);

  // follow the page-level round selector when the panel (re)opens
  useEffect(() => {
    if (rounds.includes(initialRound)) setRound(initialRound);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRound]);

  const card: PlayerHoleData | null = getHoleData(playerId, round);
  if (!card) {
    return (
      <div className="border-t border-border bg-surface px-6 py-8 text-center text-sm italic text-ink-soft">
        No hole-by-hole data recorded for this player.
      </div>
    );
  }

  const front = card.holes.filter((h) => h.hole <= 9);
  const back = card.holes.filter((h) => h.hole > 9);
  const frontPar = front.reduce((a, h) => a + h.par, 0);
  const backPar = back.reduce((a, h) => a + h.par, 0);
  const birdies = card.holes.filter((h) => h.delta === -1).length;
  const bogeys = card.holes.filter((h) => h.delta === 1).length;
  const others = card.holes.filter((h) => Math.abs(h.delta) >= 2).length;

  return (
    <div className="border-t border-border bg-surface">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border px-5 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="eyebrow">{playerName}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Pos {position} · Total {total} ({toParDisplay})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((r) => {
            const rc = getHoleData(playerId, r);
            return (
              <button
                key={r}
                onClick={() => setRound(r)}
                disabled={!rc}
                className={`flex h-9 flex-col justify-center rounded-full border px-3.5 transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                  round === r
                    ? 'border-fairway bg-fairway text-primary-foreground dark:border-gold dark:bg-gold dark:text-fairway-deep'
                    : 'border-border text-ink-soft hover:border-ink-soft'
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.14em]">{r === 4 ? 'Final' : `R${r}`}</span>
                <span className="text-[9px] tabular-nums leading-none">{rc ? `${rc.roundScore} · ${fmtToPar(rc.roundToPar)}` : '—'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* today strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border px-5 py-3 lg:px-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          Today {card.roundScore} ({fmtToPar(card.roundToPar)})
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Out {card.out} · In {card.in} · Round {card.roundScore}
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          {birdies} {birdies === 1 ? 'birdie' : 'birdies'} · {bogeys} {bogeys === 1 ? 'bogey' : 'bogeys'}
          {others ? ` · ${others} other` : ''}
        </span>
      </div>

      {/* hole grid */}
      <div className="flex flex-col gap-6 px-5 py-5 lg:flex-row lg:gap-8 lg:px-6">
        <NineBlock title="Front Nine" holes={front} total={card.out} parTotal={frontPar} />
        <NineBlock title="Back Nine" holes={back} total={card.in} parTotal={backPar} />
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft lg:px-6">
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full border border-fairway dark:border-gold-soft" /> Birdie
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative h-3.5 w-3.5 rounded-full border border-fairway dark:border-gold-soft">
            <span className="absolute inset-[2px] rounded-full border border-fairway/70 dark:border-gold-soft/70" />
          </span>
          Eagle+
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-[2px] border border-destructive/60" /> Bogey
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative h-3.5 w-3.5 rounded-[2px] border border-destructive/60">
            <span className="absolute inset-[2px] rounded-[1px] border border-destructive/60" />
          </span>
          Double+
        </span>
      </div>
    </div>
  );
}
