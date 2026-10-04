import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { news } from '@/data/tournament';

const fmt = (iso: string) =>
  new Date(new Date(iso).getTime() + 5.5 * 3600 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function News() {
  const [featured, second, ...rest] = news;

  return (
    <div>
      <PageHero
        eyebrow="Press Room"
        title={
          <>
            The championship,
            <br />
            <span className="italic text-fairway dark:text-gold-soft">chronicled</span>
          </>
        }
        intro="Daily dispatches from Qutab Golf Course — every twist of a memorable inaugural week."
      />

      <div className="container-x pb-20 lg:pb-32">
        {/* Featured story */}
        <Reveal>
          <a href="https://www.pgtofindia.com" target="_blank" rel="noreferrer" className="group grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14" data-cursor="VIEW">
            <div className="overflow-hidden">
              <img
                src={featured.image}
                alt=""
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em]">
                <span className="text-gold">Championship Report</span>
                <span className="h-px w-8 bg-border" />
                <span className="text-ink-soft">{fmt(featured.date)}</span>
              </div>
              <h2 className="mt-5 font-serif text-3xl font-light leading-snug tracking-tight lg:text-[2.6rem] lg:leading-[1.15]">
                {featured.title}
              </h2>
              <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fairway dark:text-gold-soft">
                Read on PGTI
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
        </Reveal>

        <div className="my-14 hairline" />

        {/* Second story + list */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <a href="https://www.pgtofindia.com" target="_blank" rel="noreferrer" className="group block" data-cursor="VIEW">
              <div className="overflow-hidden">
                <img
                  src={second.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em]">
                <span className="text-gold">Moving Day</span>
                <span className="ml-4 text-ink-soft">{fmt(second.date)}</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-normal leading-snug transition-colors group-hover:text-fairway dark:group-hover:text-gold-soft">
                {second.title}
              </h3>
            </a>
          </Reveal>
          <div className="flex flex-col justify-center divide-y divide-border border-y border-border">
            {rest.map((n, i) => (
              <Reveal key={n.id} delay={i * 70}>
                <a
                  href="https://www.pgtofindia.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-6 py-6"
                  data-cursor="VIEW"
                >
                  <img src={n.image} alt="" loading="lazy" className="hidden h-20 w-28 shrink-0 object-cover sm:block" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">{fmt(n.date)}</div>
                    <h4 className="mt-2 font-serif text-lg font-normal leading-snug transition-transform duration-500 group-hover:translate-x-1.5 lg:text-xl">
                      {n.title}
                    </h4>
                  </div>
                  <ArrowUpRight size={18} className="ml-auto shrink-0 text-ink-soft opacity-0 transition-all group-hover:text-gold group-hover:opacity-100" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
