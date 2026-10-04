import { cn } from '@/lib/utils';
import { partnerLogoByName } from '@/data/partners';

interface PartnerMarkProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Official partner logo with a typographic fallback for unknown brands. */
export default function PartnerMark({ name, role, size = 'md', className }: PartnerMarkProps) {
  const logo = partnerLogoByName[name];
  const logoSlot =
    size === 'lg'
      ? 'h-16 max-w-[11rem] lg:h-20 lg:max-w-[13rem]'
      : size === 'sm'
        ? 'h-8 max-w-[6.5rem]'
        : 'h-12 max-w-[9rem] lg:h-14 lg:max-w-[10rem]';
  const fallback =
    size === 'lg'
      ? 'font-serif text-3xl font-light tracking-tight lg:text-4xl'
      : size === 'sm'
        ? 'font-serif text-base font-light tracking-wide'
        : 'font-serif text-xl font-light tracking-wide lg:text-2xl';
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      {logo ? (
        <img src={logo} alt={name} className={cn('w-auto object-contain', logoSlot)} loading="lazy" />
      ) : (
        <span className={fallback}>{name}</span>
      )}
      {role && (
        <span className={cn('mt-1.5 font-sans font-bold uppercase tracking-[0.22em] text-ink-soft', size === 'sm' ? 'text-[8px]' : 'text-[9px]')}>
          {role}
        </span>
      )}
    </div>
  );
}
