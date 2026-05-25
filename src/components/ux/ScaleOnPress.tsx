/* ============================================================
   ScaleOnPress — Wraps children with scale(0.96) on press
   Emil's tactile feedback principle for interactive elements.
   ============================================================ */

'use client';

import { cn } from '@/lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

export interface ScaleOnPressProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ScaleOnPress({ children, className, ...props }: ScaleOnPressProps) {
  return (
    <div
      className={cn(
        'transition-transform duration-150',
        'active:scale-[0.96]',
        'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
