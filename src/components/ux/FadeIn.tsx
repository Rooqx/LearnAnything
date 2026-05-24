/* ============================================================
   FadeIn — Fade-in wrapper with optional direction and delay
   ============================================================ */

'use client';

import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface FadeInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 400,
  className,
}: FadeInProps) {
  const { isLite } = useAnimationMode();

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  const directionMap = {
    up: 'fadeInUp',
    down: 'fadeInDown',
    left: 'fadeInLeft',
    right: 'fadeInRight',
  };

  return (
    <div
      className={cn('opacity-0', className)}
      style={{
        animation: `${directionMap[direction]} ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms both`,
      }}
    >
      {children}
    </div>
  );
}
