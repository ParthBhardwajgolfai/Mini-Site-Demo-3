import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import { tournament } from '@/data/tournament';
import { withAlpha, type LeaderboardViewProps } from './shared';

// ════════════════════════════════════════════════════════════════════════
// ENGRAVING — ported from Scoring-Tournament `apps/leaderboard-ui` Family C
// (`EngravingBoard.tsx`, handoff screen 3A). "The page is an engraved trophy
// plate: bone and ink, gold hairlines instead of boxes, didone numerals at
// trophy scale, wide-tracked caps. No cards, no shadows, no rounded corners,
// no motion." Rounds are Roman numerals; the expansion carries the family's
// pencil notation (○ under, □ over) and its ○ UNDER □ OVER legend.
// ════════════════════════════════════════════════════════════════════════

const GOLD = '#A8873F';
const PLATE = '#F2EDE3';
const PLATE_OPEN = '#EDE6D9';
const INK = '#171512';
const INK_SOFT = '#5F584A';
const INK_TERTIARY = '#9A9182';
const RED = '#B3261E'; // under par on the plate
const RULE = 'rgba(23,21,18,0.13)';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const roman = (n: number) => ROMAN[n] ?? String(n);

// The source family's 3A phone plate tracks, scaled for desktop.
const BOARD_CSS = `
.eng-row { display: grid; grid-template-columns: 26px minmax(0,1fr) 36px 26px 64px 14px; gap: 7px; }
.eng-pad { padding-left: 16px; padding-right: 16px; }
@media (min-width: 1024px) {
  .eng-row { grid-template-columns: 56px minmax(0,1fr) 76px 64px 130px 26px; gap: 10px; }
  .eng-pad { padding-left: 26px; padding-right: 26px; }
}
`;

function label(size: number, tracking: string, color: string, weight = 500): React.CSSProperties {
  return { fontSize: size, fontWeight: weight, letterSpacing: tracking, textTransform: 'uppercase', color };
}

function scoreColor(rtp: number | null): string {
  if (rtp == null || rtp === 0) return INK;
  return rtp < 0 ? RED : INK;
}

/** Pencil notation: circle under par (ringed at eagle-or-better), bare par, square over par. */
function PencilMark({ strokes, rtp }: { strokes: number | null; rtp: number | null }) {
  const text = strokes == null ? '—' : String(strokes);
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 30, height: 30, boxSizing: 'border-box', margin: '0 auto',
    fontFamily: 'Fraunces, Georgia, serif', fontSize: 15, fontWeight: 500,
    color: strokes == null ? INK_TERTIARY : scoreColor(rtp),
    fontVariantNumeric: 'tabular-nums',
  };
  if (rtp == null || strokes == null) return <span style={base}>{text}</span>;
  if (rtp <= -2) {
    return (
      <span style={{ ...base, border: `1px solid ${RED}`, borderRadius: '50%', boxShadow: `0 0 0 2.5px ${withAlpha(RED, 0.28)}` }}>
        {text}
      </span>
    );
  }
  if (rtp === -1) return <span style={{ ...base, border: `1px solid ${RED}`, borderRadius: '50%' }}>{text}</span>;
  if (rtp === 0) return <span style={base}>{text}</span>;
  if (rtp === 1) return <span style={{ ...base, border: `1px solid ${withAlpha(INK, 0.45)}` }}>{text}</span>;
  return <span style={{ ...base, border: `1px solid ${INK}`, background: withAlpha(INK, 0.1) }}>{text}</span>;
}

/** Leader-strip round mark: filled circle under, muted square level, outlined square over. */
function RoundMark({ rtp }: { rtp: number | null }) {
  if (rtp == null) return null;
  const side = rtp < 0 ? 'under' : rtp === 0 ? 'level' : 'over';
  return (
    <span
      style={{
        display: 'block', width: 9, height: 9, flex: 'none', boxSizing: 'border-box',
        borderRadius: side === 'under' ? '50%' : 0,
        background: side === 'under' ? RED : side === 'level' ? withAlpha(INK, 0.22) : 'transparent',
        border: side === 'over' ? `1px solid ${withAlpha(INK, 0.35)}` : 'none',
      }}
    />
  );
}

export default function EngravingLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const leader = entries[0];
  const roundNo = roman(round + 1);
  const meta = [
    roundNo ? `ROUND ${roundNo} OF IV` : null,
    `PAR ${tournament.par}`,
    `${entries.length} PLAYERS`,
  ].filter((m): m is string => m != null);

  return (
    <div className="overflow-hidden border" style={{ background: PLATE, color: INK, borderColor: withAlpha(GOLD, 0.55) }}>
      <style>{BOARD_CSS}</style>
      {/* masthead */}
      <div style={{ padding: '22px 26px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ ...label(10, '.34em', GOLD), minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tournament.venue.toUpperCase()} · {tournament.city.toUpperCase()}
          </span>
          <span style={label(10, '.24em', INK_SOFT, 400)}>{tournament.status.toUpperCase()}</span>
        </div>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 32, lineHeight: 1.1, letterSpacing: '-.01em', marginTop: 10 }}>
          {tournament.name}
        </div>
        <div style={{ height: 1, background: GOLD, marginTop: 16 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
          {meta.map((m) => (
            <span key={m} style={{ ...label(10, '.20em', INK_SOFT, 400), fontVariantNumeric: 'tabular-nums' }}>{m}</span>
          ))}
        </div>
      </div>

      {/* leading block */}
      {leader && (
        <div style={{ padding: '22px 26px 24px', borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={label(9, '.32em', GOLD)}>LEADING</span>
              <span style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.25, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                {leader.name}
              </span>
              <span style={{ ...label(11, '.14em', INK_SOFT, 400), fontVariantNumeric: 'tabular-nums' }}>
                {[leader.country, 'THRU F'].join(' — ')}
              </span>
            </div>
            <div style={{ flex: 'none', fontFamily: 'Fraunces, Georgia, serif', fontSize: 84, fontWeight: 500, lineHeight: 0.92, letterSpacing: '-.01em', textAlign: 'right', color: scoreColor(leader.toPar), fontVariantNumeric: 'tabular-nums' }}>
              {leader.toParDisplay}
            </div>
          </div>
          {leader.rounds.some((s) => s != null) && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 20 }}>
              <span style={{ ...label(9, '.24em', INK_TERTIARY, 400), marginRight: 6 }}>ROUNDS</span>
              {leader.roundPars.map((rtp, i) => (
                <RoundMark key={i} rtp={rtp} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* column header */}
      <div className="eng-row eng-pad" style={{ paddingTop: 13, paddingBottom: 11 }}>
        <div style={label(9, '.22em', INK_TERTIARY)}>POS</div>
        <div style={label(9, '.22em', INK_TERTIARY)}>PLAYER</div>
        <div style={{ ...label(9, '.22em', INK_TERTIARY), textAlign: 'right' }}>TODAY</div>
        <div style={{ ...label(9, '.22em', INK_TERTIARY), textAlign: 'right' }}>THRU</div>
        <div style={{ ...label(9, '.22em', INK_TERTIARY), textAlign: 'right' }}>TOTAL</div>
        <div />
      </div>

      {entries.map((p) => {
        const mv = movement.get(p.id);
        const open = openId === p.id;
        const today = p.roundPars[round];
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
              style={{
                alignItems: 'center', height: 62,
                cursor: 'pointer', borderTop: `1px solid ${RULE}`,
                background: open ? withAlpha(GOLD, 0.09) : 'transparent',
              }}
              className="eng-row eng-pad"
            >
              <div style={{ ...label(12, '.08em', INK_SOFT), fontVariantNumeric: 'tabular-nums' }}>{p.pos}</div>
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </span>
                {/* the family's tick rule under the name — 18px when moving, 10px flat */}
                <div style={{ width: mv != null && mv !== 0 ? 18 : 10, height: 1, background: withAlpha(INK, 0.3) }} />
              </div>
              <div style={{ fontSize: 13, textAlign: 'right', color: scoreColor(today), fontVariantNumeric: 'tabular-nums' }}>
                {today == null ? '' : (today === 0 ? 'E' : today > 0 ? `+${today}` : `${today}`)}
              </div>
              <div style={{ fontSize: 11, textAlign: 'right', color: INK_TERTIARY, fontVariantNumeric: 'tabular-nums' }}>F</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, fontWeight: 500, lineHeight: 0.92, letterSpacing: '-.01em', textAlign: 'right', color: scoreColor(p.toPar), fontVariantNumeric: 'tabular-nums' }}>
                {p.toParDisplay}
              </div>
              <div style={{ textAlign: 'center', fontSize: 10, color: INK_TERTIARY }}>{open ? '—' : '+'}</div>
            </div>

            {/* open plate — pencil notation + legend */}
            <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 500ms cubic-bezier(0.22,1,0.36,1)' }} aria-hidden={!open}>
              <div style={{ minHeight: 0, overflow: 'hidden' }}>
                <div style={{ padding: '10px 26px 24px', background: PLATE_OPEN, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={label(9, '.26em', GOLD)}>{roundNo ? `ROUND ${roundNo} CARD` : 'CARD'}</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(168,135,63,0.42)' }} />
                    <span style={{ ...label(9, '.18em', INK_SOFT, 400), fontVariantNumeric: 'tabular-nums' }}>
                      TOTAL {p.totalDisplay}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, maxWidth: 360 }}>
                    {p.rounds.map((s, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <span style={{ ...label(9, '.06em', INK_TERTIARY, 400), fontVariantNumeric: 'tabular-nums' }}>
                          {`R${i + 1}`}
                        </span>
                        <PencilMark strokes={s} rtp={p.roundPars[i]} />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ ...label(9, '.18em', INK_TERTIARY, 400) }}>○ UNDER</span>
                    <span style={{ ...label(9, '.18em', INK_TERTIARY, 400) }}>□ OVER</span>
                    <div style={{ flex: 1, height: 1, background: withAlpha(INK, 0.12) }} />
                  </div>

                  <Expand open={open}>
                    <div className="pt-2">
                      <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
                    </div>
                  </Expand>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ height: 14 }} />
    </div>
  );
}
