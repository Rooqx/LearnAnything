/* ============================================================
   Sidebar Component
   Desktop sidebar (280px fixed) for chat and courses pages.
   Hidden on mobile — uses Drawer instead.
   ============================================================ */

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface SidebarProps {
  children: ReactNode;
  className?: string;
}

/**
 * Desktop sidebar — fixed 280px left panel.
 *
 * Only visible on desktop (hidden on mobile).
 * Mobile equivalent is the Drawer component triggered
 * by a hamburger button on the page.
 *
 * Glass surface with inner refraction for depth.
 */
export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col',
        'w-[280px] shrink-0',
        'h-[calc(100dvh-5rem)]',
        'sticky top-[5rem]',
        /* Glass surface */
        'bg-[var(--glass-bg)]',
        'backdrop-blur-[16px]',
        'border-r border-[var(--glass-border)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
        'overflow-y-auto',
        className
      )}
    >
      {children}
    </aside>
  );
}
