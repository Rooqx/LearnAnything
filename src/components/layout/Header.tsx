/* ============================================================
   Header Component
   Sticky top header with logo, user avatar, XP badge,
   and theme toggle.

   Mobile: Logo left, avatar + theme toggle right
   Desktop: Logo left, nav links center (optional), user area right
   ============================================================ */

'use client';

import { Sun, Moon, Zap } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useUserStore } from '@/store/useUserStore';
import { Avatar, Badge, Tooltip } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatXP } from '@/lib/utils';
import Link from 'next/link';

/**
 * App header — sticky top bar visible on all main pages.
 *
 * Floats with glass surface (taste-skill floating nav pattern).
 * Contains the brand wordmark, user avatar with XP badge,
 * and theme toggle.
 *
 * Uses mt-4 mx-4 spacing for the floating pill effect
 * recommended by high-end-visual-design skill.
 */
export function Header() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const user = useUserStore((state) => state.user);

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'mx-4 mt-4 mb-2',
        'px-4 md:px-6 py-3',
        'rounded-full',
        /* Glass surface — floating nav pattern */
        'bg-[var(--glass-bg)]',
        'backdrop-blur-[20px]',
        'border border-[var(--glass-border)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
        'flex items-center justify-between gap-4'
      )}
    >
      {/* Logo / Brand Wordmark */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 shrink-0"
      >
        {/* Brand orb — represents Lumi at 24px */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-reward)] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <span className="text-white text-xs font-bold font-[family-name:var(--font-heading)]">
            LA
          </span>
        </div>
        <span className="font-[family-name:var(--font-heading)] font-bold text-lg text-[var(--color-text)] hidden sm:block">
          LearnAnything
        </span>
      </Link>

      {/* Right section — XP badge, theme toggle, avatar */}
      <div className="flex items-center gap-3">
        {/* XP Badge — shows current XP with Zap icon */}
        {user && (
          <Tooltip content={`Level ${user.xp.currentLevel}`}>
            <Badge variant="reward" size="md">
              <Zap size={14} className="mr-1" aria-hidden="true" />
              {formatXP(user.xp.totalXP)} XP
            </Badge>
          </Tooltip>
        )}

        {/* Theme toggle — sun/moon integrated into the header */}
        <button
          onClick={toggleTheme}
          className={cn(
            'p-2.5 rounded-full cursor-pointer',
            'text-[var(--color-muted)] hover:text-[var(--color-text)]',
            'hover:bg-[var(--color-surface)]',
            'transition-colors duration-200',
            'min-h-[44px] min-w-[44px] flex items-center justify-center'
          )}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Avatar */}
        {user && (
          <Link href="/profile">
            <Avatar
              name={user.displayName}
              src={user.avatarUrl}
              alt={`${user.displayName}'s profile`}
              size="sm"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
