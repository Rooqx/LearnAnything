/* ============================================================
   Drawer Component
   Bottom sheet (mobile) / side panel (desktop) with slide-in
   animation. Glass surface with backdrop blur.

   Used by: ChatHistory, AIHelpDrawer, mobile navigation.

   Animation: slide from bottom on mobile (ease-drawer curve),
              slide from right on desktop.
   ============================================================ */

'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  /** Whether the drawer is currently visible */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Drawer title */
  title?: string;
  /** Drawer content */
  children: ReactNode;
  /** Slide direction — auto-detects based on breakpoint if not set */
  direction?: 'bottom' | 'right';
  /** Width for side drawer (desktop) */
  width?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drawer component — bottom sheet on mobile, side panel on desktop.
 *
 * Uses the iOS-like drawer curve (Emil's --ease-drawer)
 * for a weighty, physical slide-in feel.
 * Backdrop with blur effect, same focus management as Modal.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  direction = 'bottom',
  width = '320px',
  className,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Escape key to close */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  /* Prevent body scroll when drawer is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isBottom = direction === 'bottom';

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          'absolute z-10',
          /* Glass elevated surface */
          'bg-[var(--glass-bg)]',
          'backdrop-blur-[24px]',
          'border-[var(--glass-border)]',
          'shadow-[var(--shadow-lg),inset_0_1px_0_rgba(255,255,255,0.1)]',
          'outline-none overflow-y-auto',

          /* Bottom sheet — slides up from bottom */
          isBottom && [
            'inset-x-0 bottom-0',
            'max-h-[85vh]',
            'rounded-t-[var(--radius-xl)]',
            'border-t border-x',
            'animate-[slideUp_400ms_cubic-bezier(0.32,0.72,0,1)]',
          ],

          /* Right panel — slides in from right */
          !isBottom && [
            'top-0 right-0 bottom-0',
            'rounded-l-[var(--radius-xl)]',
            'border-l',
            'animate-[slideLeft_300ms_cubic-bezier(0.32,0.72,0,1)]',
          ],

          className
        )}
        style={!isBottom ? { width } : undefined}
      >
        {/* Drag handle (bottom sheet only) */}
        {isBottom && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[var(--color-muted)]/40" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-full cursor-pointer',
                'text-[var(--color-muted)] hover:text-[var(--color-text)]',
                'hover:bg-[var(--color-surface)]',
                'transition-colors duration-150',
                'min-h-[44px] min-w-[44px] flex items-center justify-center'
              )}
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
