import { ChevronDown, Minus, MoveDown, MoveUp } from 'lucide-react';
import type { LeaderboardEntry } from '@/data/tournament';
import { players } from '@/data/tournament';
import PlayerAvatar from '@/components/PlayerAvatar';

/** Player id → photo url (monogram fallback is handled by PlayerAvatar). */
export const playerImageById = new Map(players.map((player) => [player.id, player.image]));

export function posNum(pos: string): number {
  const n = parseInt(pos.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? 999 : n;
}

/**
 * Everything a leaderboard design needs to render. Every design receives the
 * exact same props — only the presentation differs. Data lives in the page.
 */
export interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  movement: Map<number, number>;
  openId: number | null;
  onToggle: (id: number) => void;
  round: number;
}

/** Position gained/lost indicator vs the previous round. */
export function MovementBadge({ mv, size = 11 }: { mv: number | undefined; size?: number }) {
  if (mv === undefined) return null;
  if (mv === 0) return <Minus size={size - 1} className="text-ink-soft/50" />;
  return (
    <span className={`flex items-center font-bold ${mv > 0 ? 'text-fairway dark:text-gold-soft' : 'text-destructive'}`}>
      {mv > 0 ? <MoveUp size={size} /> : <MoveDown size={size} />}
      {Math.abs(mv)}
    </span>
  );
}

/** Circular player portrait; size via tailwind h-/w- classes. */
export function PlayerBubble({ entry, sizeClass }: { entry: LeaderboardEntry; sizeClass: string }) {
  return (
    <div className={`${sizeClass} shrink-0 overflow-hidden rounded-full border border-border bg-surface-2 ring-2 ring-background`}>
      <PlayerAvatar name={entry.name} image={playerImageById.get(entry.id) ?? null} className="h-full w-full" />
    </div>
  );
}

/** Flag + country caption, as used across the site. */
export function CountryLine({ entry, className = '' }: { entry: LeaderboardEntry; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 uppercase tracking-[0.16em] text-ink-soft ${className}`}>
      <img src={entry.flag} alt="" className="h-3 w-4 rounded-[1px] object-cover" loading="lazy" />
      {entry.country}
    </div>
  );
}

/** Colour treatment for a to-par value: under par, level, over par. */
export function toParClass(entry: LeaderboardEntry): string {
  return entry.toPar < 0 ? 'score-under' : entry.toPar === 0 ? '' : 'text-destructive';
}

/** Render a nullable round score with the site's em-dash convention. */
export function RoundValue({ value }: { value: number | null }) {
  return value ?? <span className="text-ink-soft/40">—</span>;
}

/** Chevron affordance shared by every expandable row. */
export function ExpandChevron({ open, size = 15 }: { open: boolean; size?: number }) {
  return (
    <ChevronDown size={size} className={`text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
  );
}

/** A hex colour at an alpha, as rgba() — used by the ported board families for their tints. */
export function withAlpha(color: string, alpha: number): string {
  const hex = color.trim();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return hex;
  const full = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  const n = parseInt(full.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
