import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { partners } from '@/data/tournament';

// Shared with the header's rotating partner display. Text remains as a
// considered fallback until an official brand asset is supplied.
const partnerLogos: Record<string, string> = {
  'DP World': '/assets/partners/dpworld.png',
  PGTI: '/assets/partners/pgti.png',
  'IndusInd Bank': '/assets/partners/indusind.png',
  Amul: '/assets/partners/amul.webp',
  Campa: '/assets/partners/campa.png',
  'Victorious Choice': '/assets/partners/victoriouschoice.png',
  'Electro+': '/assets/partners/electroplus.png',
  'Golf Plus Monthly': '/assets/partners/golfplus.png',
};

export default function Partners() {
  return (
    <div>
      <PageHero
        eyebrow="Partners"
        title={
          <>
            Built with
            <br />
            <span className="italic text-fairway dark:text-gold-soft">remarkable company</span>
          </>
        }
        intro="The DP World Players Championship is made possible by partners who share a commitment to the growth of professional golf in India."
      />

      {/* Title partner */}
      <section className="container-x pb-20 lg:pb-28">
        <Reveal>
          <div className="relative overflow-hidden border border-border bg-fairway-deep px-8 py-16 text-center text-ivory lg:px-16 lg:py-24">
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.38)_1px,transparent_0)] [background-size:18px_18px]" />
            <div className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-gold-soft">Title Partner</div>
            <div className="relative mx-auto mt-7 flex h-28 w-40 items-center justify-center border border-white/15 bg-white/10 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.2)] lg:h-32 lg:w-48">
              <img src={partnerLogos['DP World']} alt="DP World" className="h-full w-full object-contain" />
            </div>
            <p className="relative mx-auto mt-7 max-w-lg text-sm leading-relaxed text-white/70">
              {partners.title.role}. A global leader in smart logistics, DP World’s partnership has
              reshaped the landscape of professional golf across India.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Official partners */}
      <section className="border-t border-border py-16 lg:py-24">
        <div className="container-x">
          <Reveal>
            <div className="eyebrow text-center">Official Partners</div>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {partners.official.map((p, i) => (
              <Reveal key={p.name} delay={i * 80} className="bg-surface">
                <div className="group flex min-h-64 flex-col items-center justify-center px-8 py-12 text-center transition-colors hover:bg-surface-2/60">
                  {partnerLogos[p.name] ? (
                    <div className="flex h-28 w-full max-w-[16rem] items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
                      <img src={partnerLogos[p.name]} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="font-serif text-3xl font-light tracking-wide lg:text-4xl">{p.name}</div>
                  )}
                  <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">{p.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting partners */}
      <section className="border-t border-border py-16 lg:py-24">
        <div className="container-x">
          <Reveal>
            <div className="eyebrow text-center">Supporting Partners</div>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {partners.supporting.map((p, i) => (
              <Reveal key={p.name} delay={i * 60} className="bg-surface">
                <div className="group flex h-full min-h-48 flex-col items-center justify-center px-6 py-9 text-center transition-colors hover:bg-surface-2/60">
                  {partnerLogos[p.name] ? (
                    <div className="flex h-16 w-full max-w-[10rem] items-center justify-center transition-transform duration-500 group-hover:scale-[1.04]">
                      <img src={partnerLogos[p.name]} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="font-serif text-xl font-light lg:text-2xl">{p.name}</div>
                  )}
                  <div className="mt-4 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-soft">{p.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tour note */}
      <section className="border-t border-border bg-surface-2/40 py-16 dark:bg-surface/40 lg:py-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <Reveal>
            <img src="/assets/logo.png" alt="DP World Players Championship emblem" className="h-24 w-24 rounded-full object-cover ring-1 ring-border lg:h-32 lg:w-32" />
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-3xl font-serif text-xl font-light leading-relaxed lg:text-2xl">
              The championship is sanctioned by the{' '}
              <span className="italic">Professional Golf Tour of India</span> — the official governing body
              for men’s professional golf in India, led by President Kapil Dev and allied with the DP World
              Tour.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
