/* ============================================================
   FadeIn — Fade-in wrapper with optional direction and delay
   ============================================================ */

'use client';

import { useAnimationMode } from '@/hooks/useAnimationMode';
import { motion } from 'framer-motion';
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

  const initialProps = {
    up: { opacity: 0, y: 24, filter: 'blur(8px)' },
    down: { opacity: 0, y: -24, filter: 'blur(8px)' },
    left: { opacity: 0, x: -24, filter: 'blur(8px)' },
    right: { opacity: 0, x: 24, filter: 'blur(8px)' },
  };

  return (
    <motion.div
      className={className}
      initial={initialProps[direction]}
      animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
