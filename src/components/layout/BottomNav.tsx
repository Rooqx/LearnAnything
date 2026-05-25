/* ============================================================
   BottomNav Component
   Mobile bottom navigation with 5 tabs.
   Hidden on desktop (replaced by Sidebar or Header nav).

   Tabs: Dashboard, Chat, Courses, Leaderboard, Profile
   Active tab: --color-primary with filled icon.
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

/** Icon mapping for each nav item — using lucide-react exclusively */
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
 * Mobile bottom navigation bar.
 *
 * Fixed to bottom, visible only on mobile (hidden md:hidden).
 * Glass surface matching the header for visual consistency.
 * Active tab gets --color-primary with scaling emphasis.
 * Minimum 44px touch targets per accessibility requirements.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed bottom-0 inset-x-0 z-40',
        'md:hidden',
        'px-2 pb-[env(safe-area-inset-bottom)]',
        /* Glass surface */
        'bg-[var(--glass-bg)]',
        'backdrop-blur-[20px]',
        'border-t border-[var(--glass-border)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const IconComponent = ICON_MAP[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5',
                'min-w-[48px] min-h-[44px] px-3 py-1',
                'rounded-xl',
                'transition-all duration-200',
                isActive
                  ? 'text-[var(--color-primary)]'
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
              />
              <span
                className={cn(
                  'text-[10px] font-[family-name:var(--font-body)]',
                  isActive ? 'font-semibold' : 'font-medium'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
