import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

const cols = [
  {
    title: 'Tournament',
    links: [
      { to: '/about', label: 'About' },
      { to: '/draws', label: 'Draws & Tee Times' },
      { to: '/prize-money', label: 'Prize Money' },
    ],
  },
  {
    title: 'Scoring',
    links: [
      { to: '/leaderboard', label: 'Leaderboard' },
      { to: '/results', label: 'Results' },
      { to: '/players', label: 'Players' },
    ],
  },
  {
    title: 'Media',
    links: [
      { to: '/news', label: 'News' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/partners', label: 'Partners' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-fairway-deep text-ivory dark:bg-surface dark:text-foreground">
      <div className="container-x py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src="/assets/golfai-logo.png" alt="GolfAI" className="h-9 w-auto lg:h-10" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-70">
              Contested at the historic Qutab Golf Course, New Delhi — 10 to 13 February 2026.
            </p>
            <div className="mt-8 text-[10px] uppercase tracking-[0.24em] opacity-60">
              An event on the
              <br />
              Professional Golf Tour of India
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-soft">{c.title}</div>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1.5 text-sm opacity-75 transition-opacity hover:opacity-100"
                    >
                      {l.label}
                      <ArrowUpRight size={13} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.2em] opacity-50 dark:border-border sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 GolfAI · Qutab Golf Course · New Delhi</span>
          <span>Frontend showcase · Data courtesy PGTI</span>
        </div>
      </div>
    </footer>
  );
}
