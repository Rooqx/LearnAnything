"use client";

import Link from "next/link";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import { Avatar, Badge } from "@/components/ui";
import { cn, formatXP } from "@/lib/utils";

/** Top navigation header — logo, user avatar, XP badge, theme toggle. Sticky. */
export function Header({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const displayName = useUserStore((s) => s.profile.displayName);
  const totalXP = useUserStore((s) => s.xp.totalXP);
  const level = useUserStore((s) => s.xp.currentLevel);

  return (
    <header className={cn("sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl", className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <Sparkles size={24} className="text-[var(--color-primary)]" />
          <span className="font-heading text-xl font-bold text-[var(--color-text)]">
            Learn<span className="text-[var(--color-primary)]">Anything</span>
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <Badge variant="reward" size="md" icon={<Sparkles size={14} />}>
            {formatXP(totalXP)} XP · L{level}
          </Badge>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer rounded-full p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User avatar */}
          <Link href="/profile" className="cursor-pointer">
            <Avatar name={displayName || "User"} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
