import { useCallback, useEffect, useRef, useState } from 'react';
import { Award, BarChart3, Building2, ChevronLeft, ChevronRight, ClipboardList, Gauge, IdCard, MonitorPlay, Newspaper, Route, Rows3, Table2, Trophy, Tv } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Every visualization ever shipped stays selectable: the six original boards
// (compact → podium) sit alongside the later wall/ladder/clubhouse family.
export const LEADERBOARD_DESIGNS = [
  { id: 'classic', label: 'Classic', icon: Table2, hint: 'The original tournament table' },
  { id: 'compact', label: 'Compact', icon: Rows3, hint: 'Dense field view' },
  { id: 'cards', label: 'Cards', icon: IdCard, hint: 'Player cards' },
  { id: 'scorecard', label: 'Scorecard', icon: ClipboardList, hint: 'Tour editorial' },
  { id: 'visual', label: 'Visual', icon: BarChart3, hint: 'Rounds vs par' },
  { id: 'podium', label: 'Podium', icon: Trophy, hint: 'Top performers first' },
  { id: 'broadcast', label: 'Broadcast', icon: Tv, hint: 'TV chyron board' },
  { id: 'broadcast-wall', label: 'Broadcast Wall', icon: MonitorPlay, hint: 'TV wall with tournament rail' },
  { id: 'editorial', label: 'Editorial', icon: Newspaper, hint: 'Premium tournament programme' },
  { id: 'engraved', label: 'Engraved', icon: Award, hint: 'Championship trophy plate' },
  { id: 'ladder', label: 'Scoring Ladder', icon: Route, hint: 'Players arranged by score to par' },
  { id: 'clubhouse', label: 'Clubhouse Wall', icon: Building2, hint: 'Spectator scoreboard' },
  { id: 'dashboard', label: 'Dashboard', icon: Gauge, hint: 'Organiser data table' },
] as const;

export type LeaderboardDesignId = (typeof LEADERBOARD_DESIGNS)[number]['id'];

interface SelectorProps {
  value: LeaderboardDesignId;
  onChange: (id: LeaderboardDesignId) => void;
  className?: string;
}

/** Compact presentation selector; rounds and search remain independent controls. */
export default function LeaderboardDesignSelector({ value, onChange, className = '' }: SelectorProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScroll({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows]);

  const scrollBy = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="eyebrow shrink-0">Leaderboard view</span>
        <span className="hidden text-[10px] uppercase tracking-[0.18em] text-ink-soft md:block">
          {LEADERBOARD_DESIGNS.find((design) => design.id === value)?.hint}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ArrowButton dir={-1} visible={canScroll.left} onClick={scrollBy} />
        <div className="relative min-w-0 flex-1">
          <div ref={trackRef} onScroll={updateArrows} role="group" aria-label="Leaderboard view" className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth">
            {LEADERBOARD_DESIGNS.map((design) => {
              const active = design.id === value;
              const Icon = design.icon as LucideIcon;
              return (
                <button
                  key={design.id}
                  type="button"
                  onClick={() => onChange(design.id)}
                  aria-pressed={active}
                  title={design.hint}
                  className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 transition-colors duration-300 ${
                    active
                      ? 'border-fairway bg-fairway text-primary-foreground dark:border-gold dark:bg-gold dark:text-fairway-deep'
                      : 'border-border bg-surface text-ink-soft hover:border-ink-soft'
                  }`}
                >
                  <Icon size={13} strokeWidth={active ? 2.4 : 2} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{design.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" style={{ opacity: canScroll.left ? 1 : 0 }} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" style={{ opacity: canScroll.right ? 1 : 0 }} aria-hidden="true" />
        </div>
        <ArrowButton dir={1} visible={canScroll.right} onClick={scrollBy} />
      </div>
    </div>
  );
}

function ArrowButton({ dir, visible, onClick }: { dir: 1 | -1; visible: boolean; onClick: (dir: 1 | -1) => void }) {
  const Icon = dir === -1 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={() => onClick(dir)}
      aria-label={dir === -1 ? 'Scroll views left' : 'Scroll views right'}
      className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink-soft transition-opacity hover:border-ink-soft hover:text-foreground sm:flex ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      tabIndex={visible ? 0 : -1}
    >
      <Icon size={15} />
    </button>
  );
}
