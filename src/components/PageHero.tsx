import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  meta?: string[];
}

/** Shared editorial header for inner pages. */
export default function PageHero({ eyebrow, title, intro, meta }: PageHeroProps) {
  return (
    <div className="container-x pb-14 pt-32 lg:pb-20 lg:pt-44">
      <Reveal>
        <div className="eyebrow">{eyebrow}</div>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="mt-5 max-w-4xl font-serif text-[2.75rem] font-light leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {title}
        </h1>
      </Reveal>
      {intro && (
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft lg:text-lg">{intro}</p>
        </Reveal>
      )}
      {meta && (
        <Reveal delay={220}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
