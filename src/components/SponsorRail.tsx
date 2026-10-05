import { partners } from '@/data/tournament';
import { partnerLogoByName } from '@/data/partners';

interface SponsorRailProps {
  className?: string;
  dark?: boolean;
  light?: boolean;
  green?: boolean;
}

/**
 * Fixed-width plates keep unlike logo proportions readable while the duplicated
 * track provides a continuous, pauseable partner marquee.
 */
export default function SponsorRail({ className = '', dark = false, light = false, green = false }: SponsorRailProps) {
  const sponsors = [partners.title, ...partners.official, ...partners.supporting];
  const plateClass = green
    ? 'border-white/30 bg-white/95'
    : light
    ? 'border-[#0b6b3a]/15 bg-white/75'
    : dark ? 'border-white/10 bg-white/[0.04]' : 'border-border/70 bg-surface';
  const labelClass = green
    ? 'border-white/15 bg-[#064126] text-white'
    : light
    ? 'border-[#0b6b3a]/20 bg-[#e5f0e8] text-[#0b4e2d]'
    : dark ? 'border-white/10 bg-fairway-deep text-white' : 'border-border bg-fairway text-primary-foreground';

  return (
    <section className={`sponsor-rail flex w-full overflow-hidden border-y ${green ? 'border-[#48af78]/40 bg-[#087344]' : light ? 'border-[#0b6b3a]/20 bg-[#f7f7f2]' : dark ? 'border-white/10 bg-[#090d0a]' : 'border-border bg-surface-2/45'} ${className}`} aria-label="Official tournament partners">
      <div className={`z-10 flex shrink-0 items-center px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] shadow-[10px_0_18px_-16px_rgba(0,0,0,.6)] sm:px-7 ${labelClass}`}>
        Official partners
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="sponsor-rail-track flex w-max items-center gap-3 py-2.5 hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-3" aria-hidden={copy === 1 || undefined}>
              {sponsors.map((sponsor) => {
                const logo = partnerLogoByName[sponsor.name];
                return (
                  <div key={`${copy}-${sponsor.name}`} className={`flex h-[clamp(40px,4vw,60px)] w-[clamp(120px,12vw,188px)] shrink-0 items-center justify-center border px-4 py-2 ${plateClass}`}>
                    {logo ? (
                      <img src={logo} alt={copy ? '' : sponsor.name} className="h-full w-full object-contain" loading="lazy" />
                    ) : (
                      <span className={`text-center font-serif text-sm ${dark ? 'text-white' : 'text-foreground'}`}>{sponsor.name}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
