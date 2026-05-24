/* ============================================================
   AnimatedPage — Page entry wrapper
   Wraps every page with a fade-in + translateY entrance.
   Respects animation mode — LITE mode renders instantly.
   ============================================================ */

'use client';

import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  const { isLite } = useAnimationMode();

  return (
    <div
      className={cn(
        isLite ? 'opacity-100' : 'animate-[fadeInUp_300ms_cubic-bezier(0.25,1,0.5,1)_both]',
        className
      )}
    >
      {children}
    </div>
  );
}
