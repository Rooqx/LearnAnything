/* ============================================================
   PageWrapper Component
   Consistent padding, max-width, and mesh gradient background.
   Wraps every page's content for layout consistency.
   ============================================================ */

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface PageWrapperProps {
  children: ReactNode;
  /** Max width constraint — defaults to max-w-7xl */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Extra bottom padding for mobile to account for BottomNav */
  bottomNavPadding?: boolean;
  className?: string;
}

/**
 * PageWrapper provides consistent padding, max-width,
 * and bottom spacing across all pages.
 *
 * bottomNavPadding adds extra pb for mobile BottomNav clearance.
 */
export function PageWrapper({
  children,
  maxWidth = 'xl',
  bottomNavPadding = true,
  className,
}: PageWrapperProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4 md:px-6 lg:px-8',
        'py-6 md:py-8',
        /* Bottom padding for mobile BottomNav (64px + safe area) */
        bottomNavPadding && 'pb-24 md:pb-8',
        /* Max width variants */
        maxWidth === 'sm' && 'max-w-2xl',
        maxWidth === 'md' && 'max-w-4xl',
        maxWidth === 'lg' && 'max-w-6xl',
        maxWidth === 'xl' && 'max-w-7xl',
        maxWidth === 'full' && 'max-w-none',
        className
      )}
    >
      {children}
    </div>
  );
}
