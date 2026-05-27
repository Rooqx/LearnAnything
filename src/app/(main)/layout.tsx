/* ============================================================
   Main Layout
   Shared layout for all authenticated pages.
   Header + BottomNav (mobile) + content area.
   ============================================================ */

import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { UserHydrator } from '@/components/providers/UserHydrator';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)] flex flex-col relative">
      <UserHydrator />
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-[88px]">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
