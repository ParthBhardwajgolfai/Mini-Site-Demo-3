import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import { fmtToPar, tournament } from '@/data/tournament';
import { withAlpha, type LeaderboardViewProps } from './shared';

// ════════════════════════════════════════════════════════════════════════
// EDITORIAL — ported from Scoring-Tournament `apps/leaderboard-ui` Family A
// (`EditorialBoard.tsx`, handoff screen 1A). "Magazine polish": serif player
// names, a dark night ground, generous air, soft rounded cards, a leader
// hero with a green gradient, a round-dot strip, and 1px-gap stat strips.
// Under par is red in this family; the LIVE pill's slot reads FINAL because
// this tournament is complete. The movement column the source holds empty is
// painted with this page's real movement figures.
// ════════════════════════════════════════════════════════════════════════

const GROUND = '#0A0D0B';
const SURFACE = '#0F1310';
const RED = '#FF4438'; // under par
const LEVEL = '#B8BEB6'; // level par
const OVER = '#8FA8C4'; // over par
const TEXT = '#EDEFEA';
const SECONDARY = '#B8BEB6';
const TERTIARY = '#8C948C';
const QUATERNARY = '#757C75';
const POSITIVE = '#1E9E5A';
const HAIRLINE = 'rgba(237,239,234,0.09)';

// The source family's two grids: 1A's phone tracks, scaled for desktop.
const BOARD_CSS = `
.ed-row { display: grid; grid-template-columns: 26px 12px minmax(0,1fr) 38px 30px 52px 18px; gap: 6px; }
.ed-pad { padding-left: 16px; padding-right: 16px; }
@media (min-width: 1024px) {
  .ed-row { grid-template-columns: 40px 26px minmax(0,1fr) 64px 56px 96px 28px; gap: 8px; }
  .ed-pad { padding-left: 22px; padding-right: 22px; }
}
`;

function scoreColor(vsPar: number | null): string {
  if (vsPar == null || vsPar === 0) return LEVEL;
  return vsPar < 0 ? RED : OVER;
}

function labelCls(size: number, tracking: string, color: string): React.CSSProperties {
  return { fontSize: size, fontWeight: 500, letterSpacing: tracking, textTransform: 'uppercase', color };
}

/** Round-dot strip — circle for non-par, 2px-radius square for par (handoff §1A). */
function DotStrip({ rounds }: { rounds: (number | null)[] }) {
  const rels = rounds.map((s) => s ?? null);
  const shown = rels.filter((r) => r != null);
  if (shown.length === 0) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
      <span style={labelCls(9, '.20em', TERTIARY)}>Rounds</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {rels.map((rel, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              display: 'block',
              borderRadius: rel === tournament.par ? 2 : '50%',
              background: rel == null ? HAIRLINE : scoreColor(rel - tournament.par),
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EditorialLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const leader = entries[0];
  const meta = [
    `Round ${round + 1} of 4`,
    tournament.venue,
    `Par ${tournament.par}`,
  ].join(' · ');

  return (
    <div className="overflow-hidden border border-black/40" style={{ background: GROUND, color: TEXT, fontFamily: 'Manrope, sans-serif' }}>
      <style>{BOARD_CSS}</style>
      {/* header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 22px 16px', borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tournament.name}
          </div>
          <div style={{ ...labelCls(10, '.16em', TERTIARY), marginTop: 7 }}>{meta}</div>
        </div>
        {/* the LIVE pill's slot — static dot, FINAL */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: 'none', borderRadius: 999, padding: '4px 10px', background: withAlpha(RED, 0.12) }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: RED }} />
          <span style={labelCls(10, '.20em', '#FF8078')}>Final</span>
        </span>
      </header>

      {/* leader hero */}
      {leader && (
        <section style={{ flex: 'none', padding: '20px 22px 18px', background: `linear-gradient(175deg, ${withAlpha(POSITIVE, 0.14)}, transparent 78%)` }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={labelCls(10, '.20em', POSITIVE)}>Leader</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 32, lineHeight: 1.08, marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {leader.name}
              </div>
              <div style={{ ...labelCls(10, '.16em', TERTIARY), fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>
                {['Pos ' + leader.pos, leader.country, 'Thru F'].join(' · ')}
              </div>
            </div>
            <div style={{ flex: 'none', textAlign: 'right' }}>
              <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 56, fontWeight: 600, lineHeight: 0.9, letterSpacing: '-.03em', color: scoreColor(leader.toPar) }}>
                {leader.toParDisplay}
              </div>
              <div style={{ ...labelCls(9, '.20em', QUATERNARY), marginTop: 8 }}>To par</div>
            </div>
          </div>
          <DotStrip rounds={leader.rounds} />
        </section>
      )}

      {/* column header */}
      <div className="ed-row ed-pad" style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingTop: 10, paddingBottom: 10 }}>
        <span style={labelCls(9, '.16em', QUATERNARY)}>Pos</span>
        <span />
        <span style={labelCls(9, '.16em', QUATERNARY)}>Player</span>
        <span style={{ ...labelCls(9, '.16em', QUATERNARY), textAlign: 'right' }}>Today</span>
        <span style={{ ...labelCls(9, '.16em', QUATERNARY), textAlign: 'right' }}>Thru</span>
        <span style={{ ...labelCls(9, '.16em', QUATERNARY), textAlign: 'right' }}>Total</span>
        <span />
      </div>

      {entries.map((p) => {
        const mv = movement.get(p.id);
        const open = openId === p.id;
        const today = p.roundPars[round];
        return (
          <div key={p.id}>
            <button
              type="button"
              onClick={() => onToggle(p.id)}
              aria-expanded={open}
              aria-label={`${p.name}, position ${p.pos}, score ${p.toParDisplay}. ${open ? 'Collapse' : 'Expand'} scorecard`}
              style={{
                width: '100%', textAlign: 'left', font: 'inherit', border: 0, cursor: 'pointer', color: 'inherit',
                alignItems: 'center', paddingTop: 13, paddingBottom: 13,
                borderTop: `1px solid ${HAIRLINE}`,
                background: open ? withAlpha(POSITIVE, 0.09) : 'transparent',
              }}
              className="ed-row ed-pad"
            >
              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14, fontWeight: 500, color: SECONDARY }}>{p.pos}</span>
              {/* the movement column the source holds empty — filled with the page's real figures */}
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: mv == null || mv === 0 ? QUATERNARY : mv > 0 ? POSITIVE : RED }}>
                {mv != null && mv !== 0 ? (mv > 0 ? '▲' : '▼') + Math.abs(mv) : '–'}
              </span>
              <span style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, color: TEXT }}>
                <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
              </span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14, textAlign: 'right', color: scoreColor(today) }}>
                {fmtToPar(today)}
              </span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14, textAlign: 'right', color: SECONDARY }}>F</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 19, fontWeight: 600, textAlign: 'right', color: scoreColor(p.toPar) }}>
                {p.toParDisplay}
              </span>
              <ChevronDown size={14} className={`justify-self-end text-[#8C948C] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* open row — rounds chips + stat strip, then the site's hole-by-hole card */}
            <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 500ms cubic-bezier(0.22,1,0.36,1)' }} aria-hidden={!open}>
              <div style={{ minHeight: 0, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gap: 16, background: SURFACE, padding: '4px 22px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14 }}>
                    <span style={labelCls(9, '.20em', TERTIARY)}>Rounds</span>
                    <span style={{ flex: 1, height: 1, background: HAIRLINE }} />
                    <span style={{ ...labelCls(9, '.20em', SECONDARY), fontVariantNumeric: 'tabular-nums' }}>
                      Total <span style={{ color: scoreColor(p.toPar) }}>{p.toParDisplay}</span> · Gross {p.totalDisplay}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, maxWidth: 420 }}>
                    {p.rounds.map((strokes, i) => {
                      const rel = p.roundPars[i];
                      return (
                        <div key={i}>
                          <div style={{ ...labelCls(8, '.14em', QUATERNARY), fontVariantNumeric: 'tabular-nums', textAlign: 'center', marginBottom: 5 }}>
                            R{i + 1}
                          </div>
                          <div style={{
                            fontVariantNumeric: 'tabular-nums', height: 30, borderRadius: 5, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600,
                            color: strokes == null ? QUATERNARY : scoreColor(rel),
                            border: `1px solid ${HAIRLINE}`,
                          }}>
                            {strokes ?? '–'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, background: HAIRLINE, borderRadius: 8, overflow: 'hidden' }}>
                    {([['Country', p.country], ['Thru', 'F'], ['Today', fmtToPar(today), scoreColor(today)]] as const).map(([lbl, value, color]) => (
                      <div key={lbl} style={{ background: SURFACE, padding: '10px 12px' }}>
                        <div style={labelCls(8, '.18em', QUATERNARY)}>{lbl}</div>
                        <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 17, fontWeight: 600, color: color ?? TEXT, marginTop: 4 }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Fragment>
                    <Expand open={open}>
                      <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={round + 1} />
                    </Expand>
                  </Fragment>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ height: 6 }} />
    </div>
  );
}
