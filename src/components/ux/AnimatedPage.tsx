/* ============================================================
   AnimatedPage — Page entry wrapper
   Wraps every page with a fade-in + translateY entrance.
   Respects animation mode — LITE mode renders instantly.
   ============================================================ */

'use client';

import { useAnimationMode } from '@/hooks/useAnimationMode';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  const { isLite } = useAnimationMode();

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
