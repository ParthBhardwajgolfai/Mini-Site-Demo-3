import type { CSSProperties, ReactNode } from 'react';

/**
 * Minimal animation primitives so the app stays dependency-light.
 * `AnimatePresence` is a pass-through; `motion.div` supports the
 * height 0 → auto expand pattern via CSS grid-rows transition.
 */
export function AnimatePresence({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

interface MotionDivProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
}

function MotionDiv({ children, className = '', style }: MotionDivProps) {
  return (
    <div className={`grid transition-all duration-300 ease-out [grid-template-rows:1fr] ${className}`} style={style}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

export const motion = { div: MotionDiv };
