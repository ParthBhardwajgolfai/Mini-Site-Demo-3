import { cn } from '@/lib/utils';

interface PartnerMarkProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Original typographic wordmark treatment for partner brands — keeps every
 * logo inside the tournament's own design system instead of third-party marks.
 */
export default function PartnerMark({ name, role, size = 'md', className }: PartnerMarkProps) {
  const word =
    size === 'lg'
      ? 'font-serif text-3xl font-light tracking-tight lg:text-4xl'
      : size === 'sm'
        ? 'font-serif text-base font-light tracking-wide'
        : 'font-serif text-xl font-light tracking-wide lg:text-2xl';
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      <span className={cn(word, name === 'DP World' ? 'font-sans font-bold uppercase tracking-[0.08em] text-fairway-deep dark:text-foreground' : '')}>
        {name}
      </span>
      {role && (
        <span className={cn('mt-1.5 font-sans font-bold uppercase tracking-[0.22em] text-ink-soft', size === 'sm' ? 'text-[8px]' : 'text-[9px]')}>
          {role}
        </span>
      )}
    </div>
  );
}
