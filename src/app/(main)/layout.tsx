/* ============================================================
   Main Layout
   Shared layout for all authenticated pages.
   Header + BottomNav (mobile) + content area.
   ============================================================ */

import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <Header />
      <div className="flex-1">{children}</div>
      <BottomNav />
    </div>
  );
}
