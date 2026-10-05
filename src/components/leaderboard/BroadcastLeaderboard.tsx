import { Fragment } from 'react';
import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import { fmtToPar, tournament } from '@/data/tournament';
import type { LeaderboardEntry } from '@/data/tournament';
import { withAlpha, type LeaderboardViewProps } from './shared';
// ════════════════════════════════════════════════════════════════════════
// BROADCAST — ported from Scoring-Tournament `apps/leaderboard-ui` Family B
// (`BroadcastBoard.tsx`). A television chyron, not a table: condensed
// uppercase, hard edges, zebra rows, skewed slabs, one saturated brand block.
// No rounded corners and no shadows anywhere in this design.
//
// Adaptation to this site's data: the movement track the source reserved is
// painted with the page's real movement figures, the LIVE slab reads FINAL
// (the tournament is complete), and "today" is the selected round's to-par
// from the entry's own roundPars. Every board below the cut-line concept the
// source draws from MC markers is omitted — this payload carries none.
// ════════════════════════════════════════════════════════════════════════

const GROUND = '#0A0E13';
const ZEBRA = '#0C1116';
const OPEN_ROW = '#16202A';
const SURFACE = '#11161C';
const RED = '#FF3B30'; // under par — the source's ramp.scoreUnder
const LEVEL = '#E8ECEF';
const OVER = '#8FA8C4'; // over par — the source's blue step
const TEXT = '#E8ECEF';
const TERTIARY = '#93A1AC';
const FAINT = '#5D6B76';
const GOLD = '#F0B429';
const GOLD_GROUND = '#1A1508';
const ACCENT = '#1E9E5A';

function scoreColor(vsPar: number | null): string {
  if (vsPar == null || vsPar === 0) return LEVEL;
  return vsPar < 0 ? RED : OVER;
}

const SKEW: React.CSSProperties = { transform: 'skewX(-12deg)' };
const UNSKEW: React.CSSProperties = { transform: 'skewX(12deg)' };

// The source family's two grids: its 2A phone tracks and the same scaled for desktop.
const BOARD_CSS = `
.bcst-row { display: grid; grid-template-columns: 3px 26px minmax(0,1fr) 34px 26px 56px 12px; gap: 6px; }
.bcst-pad { padding: 0 12px 0 0; }
.bcst-pos { padding-left: 4px; }
.bcst-leader-name { font-size: 24px; }
.bcst-meta-venue { display: none; }
@media (min-width: 1024px) {
  .bcst-row { grid-template-columns: 3px 64px minmax(0,1fr) 72px 72px 110px 28px; gap: 8px; }
  .bcst-pad { padding: 0 20px 0 0; }
  .bcst-pos { padding-left: 10px; }
  .bcst-leader-name { font-size: 30px; }
  .bcst-meta-venue { display: inline; }
}
`;

/** Square round chip — the source's `chipStyle`, coloured by the round's direction vs par. */
function chip(entry: LeaderboardEntry, i: number, height: number, size: number): React.CSSProperties {
  const rtp = entry.roundPars[i];
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height, borderRadius: 0, boxSizing: 'border-box',
    fontWeight: 700, fontSize: size, fontVariantNumeric: 'tabular-nums',
    background: 'rgba(255,255,255,0.05)',
    color: rtp == null ? FAINT : scoreColor(rtp),
  };
}

function label(size: number, tracking: string, color: string, weight = 400): React.CSSProperties {
  return { fontSize: size, fontWeight: weight, letterSpacing: tracking, color, textTransform: 'uppercase' };
}

export default function BroadcastLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const leader = entries[0];
  const meta = [
    `ROUND ${round + 1} OF 4`,
    `PAR ${tournament.par}`,
    tournament.venue.toUpperCase(),
  ];

  const rowStyle = (i: number, open: boolean, belowNone = false): React.CSSProperties => ({
    alignItems: 'center',
    background: open ? OPEN_ROW : belowNone ? GROUND : i % 2 ? ZEBRA : GROUND,
  });

  return (
    <div style={{ background: GROUND, color: TEXT, fontFamily: 'Manrope, sans-serif' }} className="overflow-hidden border border-black/40">
      <style>{BOARD_CSS}</style>
      {/* Title bar — accent block + skewed FINAL slab (the LIVE slab's slot) */}
      <div style={{ height: 56, display: 'flex', alignItems: 'stretch', background: ACCENT, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 18, minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '.02em', textTransform: 'uppercase', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tournament.name}
          </span>
        </div>
        <div style={{ flex: 'none', width: 110, background: GOLD, marginRight: -10, display: 'flex', alignItems: 'center', justifyContent: 'center', ...SKEW }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, ...UNSKEW }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD_GROUND }} />
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '.1em', color: GOLD_GROUND }}>FINAL</span>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', background: ZEBRA, borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <span style={{ flex: 'none', ...label(11, '.16em', TERTIARY) }}>{meta[0]}</span>
        <span style={{ flex: 'none', ...label(11, '.16em', TERTIARY) }}>{meta[1]}</span>
        <span className="bcst-meta-venue" style={label(11, '.16em', TERTIARY)}>{meta[2]}</span>
      </div>

      {/* Leader block */}
      {leader && (
        <div style={{ position: 'relative', padding: '20px 18px 18px', overflow: 'hidden', background: `linear-gradient(105deg, ${withAlpha(ACCENT, 0.28)} 0%, ${GROUND} 62%)` }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: ACCENT }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={label(12, '.22em', ACCENT, 700)}>TOURNAMENT LEADER</span>
              <span className="bcst-leader-name" style={{ fontWeight: 700, lineHeight: 1, textTransform: 'uppercase', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {leader.name}
              </span>
              <span style={label(13, '.1em', TERTIARY)}>
                {[leader.country, 'THRU F'].join(' · ')}
              </span>
            </div>
            <div style={{ flex: 'none', fontSize: 52, fontWeight: 700, lineHeight: 1, textAlign: 'right', color: scoreColor(leader.toPar), fontVariantNumeric: 'tabular-nums' }}>
              {leader.toParDisplay}
            </div>
          </div>
        </div>
      )}

      {/* Column header — same tracks as the rows */}
      <div className="bcst-row bcst-pad" style={{ height: 30, background: SURFACE }}>
        <div />
        <div className="bcst-pos" style={{ ...label(10, '.14em', FAINT) }}>POS</div>
        <div style={label(10, '.14em', FAINT)}>PLAYER</div>
        <div style={{ ...label(10, '.14em', FAINT), textAlign: 'right' }}>TODAY</div>
        <div style={{ ...label(10, '.14em', FAINT), textAlign: 'right' }}>THRU</div>
        <div style={{ ...label(10, '.14em', FAINT), textAlign: 'right' }}>TOTAL</div>
        <div />
      </div>

      {/* Rows */}
      <div>
        {entries.map((p, i) => {
          const mv = movement.get(p.id);
          const open = openId === p.id;
          const today = p.roundPars[round];
          return (
            <Fragment key={p.id}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
                onClick={() => onToggle(p.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(p.id); }
                }}
                style={{ ...rowStyle(i, open), height: 52, cursor: 'pointer' }}
                className="bcst-row bcst-pad"
              >
                {/* movement track — the source reserves 3px; this site has the real figures */}
                <div style={{ alignSelf: 'stretch', background: mv == null || mv === 0 ? 'rgba(255,255,255,0.08)' : mv > 0 ? ACCENT : RED }} />
                <div className="bcst-pos" style={{ fontSize: 17, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {p.pos}
                  {mv != null && mv !== 0 && (
                    <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: mv > 0 ? ACCENT : RED }}>
                      {mv > 0 ? '▲' : '▼'}{Math.abs(mv)}
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0, fontWeight: 600, fontSize: 17, lineHeight: 1.05, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 15, textAlign: 'right', color: scoreColor(today), fontVariantNumeric: 'tabular-nums' }}>
                  {fmtToPar(today)}
                </div>
                <div style={{ fontSize: 14, textAlign: 'right', color: FAINT, fontVariantNumeric: 'tabular-nums' }}>F</div>
                <div style={{ fontSize: 22, fontWeight: 700, textAlign: 'right', color: scoreColor(p.toPar), fontVariantNumeric: 'tabular-nums' }}>
                  {p.toParDisplay}
                </div>
                <div />
              </div>

              {/* Open row — the source's card: round gross + square chips */}
              <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 500ms cubic-bezier(0.22,1,0.36,1)' }} aria-hidden={!open}>
                <div style={{ minHeight: 0, overflow: 'hidden' }}>
                  <div style={{ borderLeft: `3px solid ${ACCENT}`, background: OPEN_ROW, padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={label(11, '.18em', TERTIARY)}>ROUND {round + 1} CARD</span>
                      <span style={{ ...label(11, '.18em', TERTIARY), fontVariantNumeric: 'tabular-nums' }}>
                        GROSS {p.totalDisplay}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, maxWidth: 340 }}>
                      {p.rounds.map((gross, r) => (
                        <div key={r} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                          <span style={label(9, '.06em', FAINT)}>R{r + 1}</span>
                          <span style={{ width: '100%', ...chip(p, r, 34, 17) }}>{gross ?? '—'}</span>
                        </div>
                      ))}
                    </div>
                    <Expand open={open}>
                      <div className="pt-3">
                        <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
                      </div>
                    </Expand>
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
