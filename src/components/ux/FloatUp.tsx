/* ============================================================
   FloatUp — XP float-up number animation
   Number floats up 40px and fades out over 800ms.
   ============================================================ */

'use client';

import { cn } from '@/lib/utils';

export interface FloatUpProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatUp({ children, className }: FloatUpProps) {
  return (
    <div className={cn('animate-float-up pointer-events-none', className)}>
      {children}
    </div>
  );
}
