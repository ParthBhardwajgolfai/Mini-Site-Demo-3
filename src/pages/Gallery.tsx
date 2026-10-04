import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { gallery } from '@/data/tournament';

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? null : (o + d + gallery.length) % gallery.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  return (
    <div>
      <PageHero
        eyebrow="In Pictures"
        title={
          <>
            Four days at Qutab,
            <br />
            <span className="italic text-fairway dark:text-gold-soft">in frames</span>
          </>
        }
        intro="Official championship photography — from the Pro-Am curtain-raiser to the trophy presentation on Friday afternoon."
      />

      <div className="container-x pb-20 lg:pb-32">
        <div className="columns-2 gap-3 [column-fill:_balance] lg:columns-3 lg:gap-4">
          {gallery.map((g, i) => (
            <Reveal key={g.id} image delay={(i % 6) * 60} className="mb-3 overflow-hidden lg:mb-4">
              <button
                onClick={() => setOpen(i)}
                className="group relative block w-full"
                data-cursor="EXPLORE"
                aria-label={`Open image: ${g.caption}`}
              >
                <img
                  src={g.image}
                  alt={g.caption}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="line-clamp-2 text-left text-xs leading-relaxed text-white/90">{g.caption}</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div className="lightbox-enter fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-sm" onClick={close}>
          <div className="flex items-center justify-between p-5 text-white/80">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em]">
              {open + 1} / {gallery.length}
            </span>
            <button onClick={close} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => step(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:bg-white/10 lg:left-8"
            >
              <ChevronLeft size={26} />
            </button>
            <img
              key={open}
              src={gallery[open].image}
              alt={gallery[open].caption}
              className="lightbox-enter max-h-[72vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={() => step(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:bg-white/10 lg:right-8"
            >
              <ChevronRight size={26} />
            </button>
          </div>
          <p className="mx-auto max-w-3xl px-6 pb-8 text-center text-xs leading-relaxed text-white/60">
            {gallery[open].caption}
          </p>
        </div>
      )}
    </div>
  );
}
