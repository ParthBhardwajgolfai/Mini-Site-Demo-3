import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/players', label: 'Players' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/draws', label: 'Draws' },
  { to: '/results', label: 'Results' },
  { to: '/prize-money', label: 'Prize Money' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/partners', label: 'Partners' },
];

/** Header sponsor rotator — logos crossfade directly on the navbar (no slot
 *  chrome), one visible at a time (2.2s hold). Pauses on hover; quick fade
 *  under prefers-reduced-motion. */
const tickerLogos = [
  { src: '/assets/partners/pgti.png', alt: 'DP World · PGTI — Professional Golf Tour of India' },
  { src: '/assets/partners/amul.webp', alt: 'Amul' },
  { src: '/assets/partners/golfplus.png', alt: 'Golf Plus Monthly' },
  { src: '/assets/partners/hcl.webp', alt: 'HCL' },
  { src: '/assets/partners/axis.png', alt: 'Axis Bank' },
];

function PartnerTicker() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % tickerLogos.length), 2200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative hidden h-11 w-32 shrink-0 overflow-hidden md:block"
      aria-label={`Tour partner: ${tickerLogos[idx].alt}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {tickerLogos.map((p, i) => (
        <img
          key={p.src}
          src={p.src}
          alt={i === idx ? p.alt : ''}
          title={p.alt}
          loading="lazy"
          className="absolute inset-0 m-auto max-h-10 w-auto max-w-[8rem] object-contain"
          style={{ opacity: i === idx ? 1 : 0, transition: `opacity ${reduced ? 0.15 : 0.6}s ease-in-out` }}
        />
      ))}
    </div>
  );
}

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onDarkHero = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-border bg-background/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link to="/" className="flex shrink-0 items-center" aria-label="GolfAI — home">
            <img
              src="/assets/golfai-logo.png"
              alt="GolfAI"
              className={`h-8 w-auto transition-opacity duration-500 lg:h-9 ${onDarkHero ? 'opacity-95 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]' : ''}`}
            />
          </Link>

          <nav className="hidden items-center gap-5 xl:gap-6 xl:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `nav-link whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
                    isActive ? 'active' : ''
                  } ${onDarkHero ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-foreground'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <span className={`hidden h-5 w-px md:block ${onDarkHero ? 'bg-white/25' : 'bg-border'}`} aria-hidden="true" />
            <PartnerTicker />
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${
                onDarkHero ? 'text-white hover:bg-white/10' : 'text-ink-soft hover:bg-foreground/5'
              }`}
            >
              {theme === 'light' ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors xl:hidden ${
                onDarkHero ? 'text-white' : 'text-foreground'
              }`}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-background transition-all duration-500 xl:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between">
          <img src="/assets/golfai-logo.png" alt="GolfAI" className="h-8 w-auto" />
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <nav className="container-x flex flex-1 flex-col justify-center gap-1 overflow-y-auto pb-10">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={{ transitionDelay: `${i * 35}ms` }}
              className={({ isActive }) =>
                `border-b border-border py-3 font-serif text-3xl font-light transition-all duration-500 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${isActive ? 'italic text-fairway dark:text-gold-soft' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="container-x pb-8 text-[10px] uppercase tracking-[0.24em] text-ink-soft">
          Qutab Golf Course · New Delhi · 10–13 Feb 2026
        </div>
      </div>
    </>
  );
}
