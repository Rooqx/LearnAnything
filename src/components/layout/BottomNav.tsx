"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, BookOpen, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = { Home, MessageSquare, BookOpen, Trophy, User };

/** Mobile bottom navigation bar — 5 items. Hidden on desktop. */
export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl md:hidden", className)}>
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 cursor-pointer",
                "min-w-[44px] min-h-[44px] justify-center",
                "transition-colors duration-200",
                isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
