"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, BookOpen, Trophy, User, Settings, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/chat", label: "New Course", icon: MessageSquare },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/achievements", label: "Achievements", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Desktop sidebar navigation — 280px fixed width. Hidden on mobile. */
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("hidden md:flex md:w-[280px] md:flex-col md:border-r md:border-[var(--color-border)] md:bg-[var(--color-surface)]/50", className)}>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium cursor-pointer",
                "transition-all duration-200",
                isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]"
              )}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
