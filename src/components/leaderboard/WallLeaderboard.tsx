import { Fragment, useMemo } from 'react';
import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import SponsorRail from '@/components/SponsorRail';
import { fmtToPar, holeByHole, leaderboard, partners, results, tournament } from '@/data/tournament';
import type { HoleScore, LeaderboardEntry, PlayerHoleData } from '@/data/tournament';
import { partnerLogoByName } from '@/data/partners';
import type { LeaderboardViewProps } from './shared';
// ════════════════════════════════════════════════════════════════════════
// WALL — a 1920×1080-style broadcast wall (reference: two-column field grid
// with a statistics rail). Sibling to the Broadcast board: same hard-coded
// dark palette, Manrope, hard edges — no rounded corners, no shadows.
//
// Where the reference used placeholder facts (wind, cut +4, "SPONSOR 165's
// creative"), this board computes everything from this site's real payload:
//   · Shot of the day  — best single hole of the selected round from the
//     hole-by-hole records, with the player's full 18-shot track as dots.
//   · Scoring average / hardest hole — aggregated across the round's cards.
//   · Cut line — worst to-par that made the cut; the cut rule text before it fell.
//   · Field — the round's playing field (126 starters, 56 after the cut).
// Sponsor space follows the reference's slots: the PRESENTED BY block carries
// the title partner, the signature-hole panel rotates a supporting partner
// per round, and the footer strip lists every official partner mark.
// ════════════════════════════════════════════════════════════════════════

const GROUND = '#0A0E13';
const ZEBRA = '#0C1116';
const OPEN_ROW = '#16202A';
const SURFACE = '#11161C';
const RED = '#FF3B30'; // under par — the broadcast family's ramp.scoreUnder
const LEVEL = '#E8ECEF';
const OVER = '#8FA8C4';
const TEXT = '#E8ECEF';
const TERTIARY = '#93A1AC';
const FAINT = '#5D6B76';
const GOLD = '#F0B429';
const GOLD_GROUND = '#1A1508';
const GREEN = '#0F7B44'; // header block
const LINE = 'rgba(255,255,255,0.07)'; // hairline between wall panels

function scoreColor(vsPar: number | null): string {
  if (vsPar == null || vsPar === 0) return LEVEL;
  return vsPar < 0 ? RED : OVER;
}

const ORDINALS = ['', '1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH', '11TH', '12TH', '13TH', '14TH', '15TH', '16TH', '17TH', '18TH'];

const SKEW: React.CSSProperties = { transform: 'skewX(-12deg)' };
const UNSKEW: React.CSSProperties = { transform: 'skewX(12deg)' };

/** The wall's shared row grid: movement track | pos | player | thru | total. */
const ROW_GRID =
  'grid grid-cols-[3px_30px_minmax(0,1fr)_36px_58px] items-center gap-x-1.5 lg:grid-cols-[4px_46px_minmax(0,1fr)_46px_80px] lg:gap-x-2.5';

function RowHead({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: FAINT }}>{children}</div>;
}

/** Square round chip, coloured by the round's direction vs par (broadcast family). */
function RoundChip({ value, vsPar }: { value: number | null; vsPar: number | null }) {
  return (
    <span
      className="flex h-[34px] w-full items-center justify-center text-[15px] font-bold tabular-nums"
      style={{ background: 'rgba(255,255,255,0.05)', color: vsPar == null ? FAINT : scoreColor(vsPar) }}
    >
      {value ?? '—'}
    </span>
  );
}

function StatTile({ label, value, gold = false, small = false }: { label: string; value: string; gold?: boolean; small?: boolean }) {
  return (
    <div className="min-w-0 px-3.5 py-3 lg:px-4 lg:py-3.5" style={{ background: gold ? GOLD_GROUND : SURFACE }}>
      <div className="text-[8px] font-bold uppercase tracking-[0.2em] lg:text-[9px]" style={{ color: gold ? 'rgba(240,180,41,0.62)' : FAINT }}>
        {label}
      </div>
      <div
        className={`mt-1 truncate font-bold tabular-nums ${small ? 'text-[13px] tracking-[0.04em] lg:text-[15px]' : 'text-[17px] lg:text-[20px]'}`}
        style={{ color: gold ? GOLD : TEXT }}
      >
        {value}
      </div>
    </div>
  );
}

export default function WallLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const roundNo = round + 1;
  const roundBoard = leaderboard[round].items;

  const stats = useMemo(() => {
    const cards = Object.values(holeByHole[String(roundNo)] ?? {}) as PlayerHoleData[];
    const scoringAvg = cards.length
      ? (cards.reduce((s, c) => s + c.roundScore, 0) / cards.length).toFixed(1)
      : null;

    const holeAgg = new Map<number, { d: number; n: number }>();
    let best: (HoleScore & { pid: number }) | null = null;
    for (const [pid, card] of Object.entries(holeByHole[String(roundNo)] ?? {})) {
      for (const h of card.holes) {
        const agg = holeAgg.get(h.hole) ?? { d: 0, n: 0 };
        agg.d += h.delta;
        agg.n += 1;
        holeAgg.set(h.hole, agg);
        if (!best || h.delta < best.delta || (h.delta === best.delta && h.score < best.score)) {
          best = { ...h, pid: Number(pid) };
        }
      }
    }
    const hardest = [...holeAgg.entries()]
      .map(([hole, a]) => ({ hole: Number(hole), avg: a.d / a.n }))
      .sort((a, b) => b.avg - a.avg)[0] ?? null;

    const madeCut = results.filter((r) => r.madeCut && r.toPar != null).map((r) => r.toPar as number);
    const cutLine = madeCut.length ? Math.max(...madeCut) : null;

    return { scoringAvg, best, hardest, cutLine };
  }, [roundNo]);

  const shot = stats.best;
  const shotEntry = shot ? roundBoard.find((e) => e.id === shot.pid) ?? null : null;
  const shotCard = shot ? (holeByHole[String(roundNo)]?.[String(shot.pid)] ?? null) : null;

  // Sequential split like the reference wall: first half left, second half right.
  const mid = Math.ceil(entries.length / 2);
  const columns = [entries.slice(0, mid), entries.slice(mid)];

  // The creative slot rotates a supporting partner per round, as broadcast walls do.
  const sponsor = partners.supporting[round % partners.supporting.length];
  const titleLogo = partnerLogoByName[partners.title.name];

  const renderRow = (p: LeaderboardEntry) => {
    const open = openId === p.id;
    const mv = movement.get(p.id);
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
          className={`${ROW_GRID} h-[46px] cursor-pointer lg:h-[54px]`}
          style={{ background: open ? OPEN_ROW : Number(p.pos) % 2 ? GROUND : ZEBRA, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          {/* movement track */}
          <div className="h-full" style={{ background: mv == null || mv === 0 ? 'rgba(255,255,255,0.08)' : mv > 0 ? GREEN : RED }} />
          <div className="pl-1.5 text-[15px] font-bold tabular-nums lg:pl-2.5 lg:text-[17px]">{p.pos}</div>
          <div className="min-w-0 truncate text-[15px] font-semibold uppercase leading-tight lg:text-[18px]">{p.name}</div>
          <div className="text-right text-[12px] tabular-nums lg:text-[13px]" style={{ color: FAINT }}>F</div>
          <div
            className="pr-2 text-right text-[18px] font-bold tabular-nums lg:pr-3.5 lg:text-[24px]"
            style={{ color: scoreColor(p.toPar) }}
          >
            {p.toParDisplay}
          </div>
        </div>

        {/* Open row — round card + full scorecard, as in every board of this family */}
        <div
          style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 500ms cubic-bezier(0.22,1,0.36,1)' }}
          aria-hidden={!open}
        >
          <div style={{ minHeight: 0, overflow: 'hidden' }}>
            <div style={{ borderLeft: `3px solid ${GREEN}`, background: OPEN_ROW, borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="flex flex-col gap-3 px-4 pb-4 pt-4 lg:px-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: TERTIARY }}>ROUND {roundNo} CARD</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] tabular-nums" style={{ color: TERTIARY }}>GROSS {p.totalDisplay}</span>
              </div>
              <div className="grid max-w-[360px] grid-cols-4 gap-1">
                {p.rounds.map((gross, r) => (
                  <RoundChip key={r} value={gross} vsPar={p.roundPars[r]} />
                ))}
              </div>
              <Expand open={open}>
                <div className="pt-2">
                  <Scorecard playerId={p.id} playerName={p.name} position={p.pos} total={p.total} toParDisplay={p.toParDisplay} initialRound={roundNo} />
                </div>
              </Expand>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <div style={{ background: GROUND, color: TEXT, fontFamily: 'Manrope, sans-serif' }} className="overflow-hidden border border-black/40">
      {/* ── Header: monogram · title block · FINAL slab · presented by ── */}
      <div className="flex flex-wrap items-stretch overflow-hidden" style={{ background: GREEN }}>
        <div className="flex w-11 shrink-0 items-center justify-center text-[17px] font-bold text-white lg:w-14 lg:text-[22px]" style={{ background: SURFACE }}>
          DP
        </div>
        <div className="min-w-0 flex-1 py-2.5 pl-4 pr-4 lg:pl-5">
          <div className="truncate text-[16px] font-bold uppercase leading-tight tracking-[0.02em] text-white lg:text-[26px]">
            {tournament.name}
          </div>
          <div className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.22em] lg:text-[11px]" style={{ color: 'rgba(4,26,14,0.72)' }}>
            ROUND {roundNo} OF 4 · {tournament.venue} · PAR {tournament.par} · {tournament.field}
          </div>
        </div>
        <div className="flex items-center px-5 lg:px-7" style={{ background: RED, ...SKEW }}>
          <div className="flex items-center gap-2" style={UNSKEW}>
            <span className="h-[7px] w-[7px] rounded-full bg-white" />
            <span className="text-[12px] font-bold tracking-[0.12em] text-white lg:text-[14px]">FINAL</span>
          </div>
        </div>
        {/* Sponsor space #1 — title partner, exactly the reference's PRESENTED BY slot */}
        <div className="hidden items-center gap-3 pl-5 pr-4 md:flex" style={{ background: GROUND }}>
          <span className="text-[8px] font-bold uppercase leading-[1.5] tracking-[0.2em]" style={{ color: FAINT }}>
            Presented<br />by
          </span>
          {titleLogo ? (
            <img src={titleLogo} alt={partners.title.name} className="h-8 w-auto object-contain lg:h-9" />
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white">{partners.title.name}</span>
          )}
        </div>
      </div>
      {/* Mobile home for the presented-by slot */}
      <div className="flex items-center gap-3 px-4 py-2 md:hidden" style={{ background: SURFACE, borderBottom: `1px solid ${LINE}` }}>
        <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: FAINT }}>Presented by</span>
        {titleLogo ? (
          <img src={titleLogo} alt={partners.title.name} className="h-7 w-auto object-contain" />
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{partners.title.name}</span>
        )}
      </div>

      {/* ── Body: field wall + statistics rail ── */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="grid lg:grid-cols-2">
            {columns.map((col, ci) => (
              <div key={ci} className={ci === 1 ? 'lg:border-l lg:border-white/[0.06]' : ''}>
                {/* column header — same tracks as the rows */}
                <div className={`${ROW_GRID} h-[26px]`} style={{ background: SURFACE, borderBottom: `1px solid ${LINE}` }}>
                  <div />
                  <RowHead><span className="pl-1.5 lg:pl-2.5">Pos</span></RowHead>
                  <RowHead>Player</RowHead>
                  <div className="text-right"><RowHead>Thru</RowHead></div>
                  <div className="pr-2 text-right lg:pr-3.5"><RowHead>Total</RowHead></div>
                </div>
                {col.map(renderRow)}
              </div>
            ))}
          </div>
        </div>

        {/* ── Statistics rail ── */}
        <aside style={{ background: GROUND }} className="border-white/[0.06] lg:border-l">
          {/* Shot of the day — the reference's eagle card, filled with this round's best hole */}
          {shot && shotEntry && shotCard && (
            <div className="border-b p-4 lg:p-5" style={{ borderColor: LINE, background: SURFACE }}>
              <span
                className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ background: GOLD, color: GOLD_GROUND }}
              >
                {shot.result.replace('_OR_BETTER', '')} · HOLE {shot.hole}
              </span>
              <div className="mt-3 truncate text-[20px] font-bold uppercase leading-tight lg:text-[24px]">{shotEntry.name}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] lg:text-[11px]" style={{ color: TERTIARY }}>
                PAR {shot.par} · SCORED {shot.score} · MOVES TO{' '}
                <span className="text-[13px] font-bold lg:text-[15px]" style={{ color: RED }}>{shotEntry.toParDisplay}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label={`Round ${roundNo} shot track`}>
                {shotCard.holes.map((h) => (
                  <span
                    key={h.hole}
                    title={`Hole ${h.hole} · ${h.result.replace('_OR_BETTER', '')}`}
                    className="h-2 w-2 rounded-full"
                    style={{ background: h.delta < 0 ? RED : h.delta === 0 ? '#4E5B66' : '#2E3842' }}
                  />
                ))}
              </div>
              <div className="mt-2.5 text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: FAINT }}>
                ROUND {roundNo} · EVERY SHOT
              </div>
            </div>
          )}

          {/* Stat tiles — computed from the round's real cards */}
          <div className="grid grid-cols-2" style={{ gap: 1, background: LINE, borderBottom: `1px solid ${LINE}` }}>
            <StatTile label="Field" value={String(roundBoard.length)} />
            <StatTile label="Scoring Avg" value={stats.scoringAvg ?? '—'} />
            <StatTile label="Hardest" value={stats.hardest ? `${ORDINALS[stats.hardest.hole]} ${stats.hardest.avg >= 0 ? '+' : ''}${stats.hardest.avg.toFixed(2)}` : '—'} small />
            <StatTile
              label="Cut Line"
              value={round >= 2 && stats.cutLine != null ? fmtToPar(stats.cutLine) : 'Top 50 & ties'}
              gold
              small={!(round >= 2 && stats.cutLine != null)}
            />
          </div>

          {/* Sponsor space #2 — signature-hole creative, rotates per round */}
          <div className="border-b p-4 lg:p-5" style={{ borderColor: LINE }}>
            <span
              className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
              style={{ background: GREEN }}
            >
              {stats.hardest ? `HOLE ${stats.hardest.hole}` : 'COURSE'} · SIGNATURE
            </span>
            <div
              className="relative mt-3 flex h-32 items-center justify-center overflow-hidden border lg:h-40"
              style={{
                border: '1px solid rgba(116,220,157,0.4)',
                background: '#078146',
              }}
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-[#1e9e5a]" aria-hidden="true" />
              {partnerLogoByName[sponsor.name] ? (
                <img src={partnerLogoByName[sponsor.name]} alt={sponsor.name} className="relative z-10 w-[84%] max-h-[68%] object-contain opacity-95 brightness-0 invert drop-shadow-[0_3px_5px_rgba(0,0,0,.2)]" />
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: FAINT }}>{sponsor.name}</span>
              )}
            </div>
            <div className="mt-3 text-[9px] font-bold uppercase tracking-[0.18em] lg:text-[10px]">
              <span style={{ color: FAINT }}>{sponsor.role} · </span>
              <span className="text-white">{sponsor.name}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Sponsor space #3 — official partners strip ── */}
      <SponsorRail green className="border-x-0 border-b-0" />
    </div>
  );
}
