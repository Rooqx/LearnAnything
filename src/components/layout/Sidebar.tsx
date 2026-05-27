/* ============================================================
   Sidebar Component
   Desktop floating navigation pill on the left side.
   Hidden on mobile (replaced by BottomNav).

   Tabs: Dashboard, Chat, Courses, Leaderboard, Profile
   Active tab: --color-primary with scale emphasis.
   ============================================================ */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Trophy,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui';

/** Icon mapping for each nav item */
const ICON_MAP = {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Trophy,
  User,
} as const;

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard' as const },
  { href: '/chat', label: 'Learn', icon: 'MessageSquare' as const },
  { href: '/courses', label: 'Courses', icon: 'BookOpen' as const },
  { href: '/leaderboard', label: 'Ranks', icon: 'Trophy' as const },
  { href: '/profile', label: 'Profile', icon: 'User' as const },
];

/**
 * Desktop floating pill sidebar.
 *
 * Fixed vertically to the center left, visible only on desktop (hidden md:flex).
 * Glass surface matching the header for visual consistency.
 * Active tab gets --color-primary with scaling emphasis.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-4 top-1/2 -translate-y-1/2 z-40',
        'hidden md:flex flex-col items-center gap-6',
        'w-16 py-6 rounded-full',
        /* Glass surface */
        'bg-[var(--glass-bg)]',
        'backdrop-blur-[20px]',
        'border border-[var(--glass-border)]',
        'shadow-[var(--shadow-md),inset_0_1px_0_rgba(255,255,255,0.1)]'
      )}
      aria-label="Desktop navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const IconComponent = ICON_MAP[item.icon];

        return (
          <Tooltip key={item.href} content={item.label} position="right">
            <Link
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center',
                'w-10 h-10 rounded-full',
                'transition-all duration-200',
                'hover:bg-[var(--color-surface)]',
                isActive
                  ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20'
                  : 'text-[var(--color-muted)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComponent
                size={22}
                className={cn(
                  'transition-transform duration-200',
                  isActive && 'scale-110'
                )}
                aria-hidden="true"
              />
            </Link>
          </Tooltip>
        );
      })}
    </aside>
  );
}
