/* ============================================================
   Tooltip Component
   Accessible tooltip with positioning and skip-delay on
   subsequent hovers (Emil's principle).
   ============================================================ */

'use client';

import { useState, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), 400);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-1.5',
            'bg-[var(--color-surface-elevated)] text-[var(--color-text)]',
            'text-xs font-[family-name:var(--font-body)]',
            'rounded-[var(--radius-sm)]',
            'border border-[var(--color-border)]',
            'shadow-[var(--shadow-md)]',
            'whitespace-nowrap pointer-events-none',
            'animate-[fadeIn_125ms_ease-out]',
            position === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
            position === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
            position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
            position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
