import { Fragment } from 'react';
import Expand from '@/components/Expand';
import Scorecard from '@/components/Scorecard';
import SponsorRail from '@/components/SponsorRail';
import { tournament } from '@/data/tournament';
import type { LeaderboardEntry } from '@/data/tournament';
import { MovementBadge, type LeaderboardViewProps } from './shared';

function WallRow({ entry, movement, open, onToggle, round }: {
  entry: LeaderboardEntry;
  movement: number | undefined;
  open: boolean;
  onToggle: () => void;
  round: number;
}) {
  return (
    <Fragment>
      <button type="button" onClick={onToggle} aria-expanded={open} className={`grid w-full grid-cols-[4.75rem_minmax(0,1fr)_4.5rem] items-center gap-3 border-b border-white/[0.08] px-4 py-3 text-left transition-colors hover:bg-white/[0.05] sm:grid-cols-[6.5rem_minmax(0,1fr)_5.75rem] sm:gap-4 sm:px-5 ${open ? 'bg-white/[0.07]' : ''}`}>
        <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-lg font-bold tabular-nums text-[#d7ae56] sm:gap-2 sm:text-2xl">
          {entry.pos}<MovementBadge mv={movement} size={10} />
        </span>
        <span className="min-w-0 overflow-hidden">
          <span className="block truncate text-sm font-semibold uppercase tracking-[0.02em] text-white sm:text-base">{entry.name}</span>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-slate-400">{entry.country} · F</span>
        </span>
        <span className={`whitespace-nowrap text-right text-2xl font-bold tabular-nums sm:text-3xl ${entry.toPar < 0 ? 'text-[#ff4a40]' : entry.toPar > 0 ? 'text-[#9bb5ce]' : 'text-white'}`}>{entry.toParDisplay}</span>
      </button>
      <Expand open={open}>
        <div className="border-b border-white/[0.08] bg-[#172018] px-4 py-2">
          <Scorecard playerId={entry.id} playerName={entry.name} position={entry.pos} total={entry.total} toParDisplay={entry.toParDisplay} initialRound={round + 1} />
        </div>
      </Expand>
    </Fragment>
  );
}

/** Fluid clubhouse display: two field columns appear only when the available width allows. */
export default function ClubhouseLeaderboard({ entries, movement, openId, onToggle, round }: LeaderboardViewProps) {
  const midpoint = Math.ceil(entries.length / 2);
  const columns = [entries.slice(0, midpoint), entries.slice(midpoint)];
  const leader = entries[0];

  return (
    <section className="overflow-hidden border border-black bg-[#0a0e0b] text-white">
      <header className="flex flex-wrap items-stretch bg-[#0d7942]">
        <div className="min-w-0 flex-1 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-emerald-950/75">Clubhouse wall · final round</p>
          <h2 className="mt-2 truncate text-2xl font-bold uppercase tracking-tight sm:text-4xl">{tournament.name}</h2>
          <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/75">{tournament.venue} · {tournament.city} · par {tournament.par}</p>
        </div>
        {leader && <div className="flex min-w-[12rem] flex-1 items-end justify-between bg-[#111815] px-5 py-4 sm:max-w-xs sm:px-6">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Leader<br /><strong className="mt-1 block text-sm tracking-normal text-white">{leader.name}</strong></span>
          <strong className="text-4xl tabular-nums text-[#ff4a40]">{leader.toParDisplay}</strong>
        </div>}
      </header>

      <div className="grid min-w-0 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(16rem,.42fr)]">
        <div className="min-w-0 border-white/[0.08] 2xl:col-span-2 2xl:grid 2xl:grid-cols-2 2xl:border-r">
          {columns.map((column, index) => (
            <div key={index} className={index ? 'border-t border-white/[0.08] 2xl:border-l 2xl:border-t-0' : ''}>
              <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_4.5rem] gap-3 bg-[#121914] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-[6.5rem_minmax(0,1fr)_5.75rem] sm:gap-4 sm:px-5">
                <span>Pos</span><span>Player</span><span className="text-right">To par</span>
              </div>
              {column.map((entry) => <WallRow key={entry.id} entry={entry} movement={movement.get(entry.id)} open={openId === entry.id} onToggle={() => onToggle(entry.id)} round={round} />)}
            </div>
          ))}
        </div>

        <aside className="grid grid-cols-2 border-t border-white/[0.08] bg-[#0d120f] 2xl:block 2xl:border-t-0">
          <Info label="Round" value={`${round + 1} of 4`} />
          <Info label="Format" value="Stroke play" />
          <Info label="Field" value={tournament.field} />
          <Info label="Cut" value={tournament.cut} accent />
          <div className="col-span-2 border-t border-white/[0.08] px-5 py-5 2xl:border-b">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Tournament information</p>
            <p className="mt-3 font-serif text-xl leading-tight text-white">{tournament.purse} prize purse</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-400">{tournament.yardage} · {tournament.status}</p>
          </div>
        </aside>
      </div>
      <SponsorRail dark className="border-x-0 border-b-0" />
    </section>
  );
}

function Info({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className={`border-b border-r border-white/[0.08] px-5 py-4 last:border-r-0 2xl:border-r-0 ${accent ? 'bg-[#1b1608]' : ''}`}>
    <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${accent ? 'text-[#d7ae56]/70' : 'text-slate-500'}`}>{label}</p>
    <p className={`mt-1 text-lg font-bold tabular-nums ${accent ? 'text-[#f2c14e]' : 'text-white'}`}>{value}</p>
  </div>;
}
