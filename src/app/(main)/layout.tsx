"use client";

import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

/** Main app layout — Header + BottomNav (mobile). Wraps all (main) route group pages. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <div className="flex-1 pb-20 md:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
