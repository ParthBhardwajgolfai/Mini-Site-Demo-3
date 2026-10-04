import type { ReactNode } from 'react';

interface ExpandProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Smooth height 0 → auto reveal using the CSS grid-rows technique.
 * Animates both opening and closing without a JS height measuring step.
 */
export default function Expand({ open, children, className = '' }: ExpandProps) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
      } ${className}`}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
