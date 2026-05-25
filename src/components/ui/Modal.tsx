/* ============================================================
   Modal Component
   Glass surface modal with focus trap, backdrop, scale-in
   entrance animation, and escape-to-close.

   Used by: QuizPopup, LevelUpModal, badge details, and
   delete account confirmation.

   Design: glass-elevated surface, NOT a plain dialog.
   Animation: scale from 0.95 + opacity (Emil: never from 0).
   ============================================================ */

'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Modal title displayed in the header */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the close (X) button */
  showClose?: boolean;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdrop?: boolean;
  /** Additional CSS classes for the modal panel */
  className?: string;
}

/**
 * Modal component with focus trap and accessible keyboard handling.
 *
 * Implements taste-skill modal patterns:
 * - Glass elevated surface with backdrop blur
 * - Scale-in from 0.95 (never from 0 — Emil's principle)
 * - transform-origin: center (correct for modals, not popovers)
 * - Focus trap: Tab cycles within modal, Escape closes
 * - Returns focus to trigger element on close
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /* Store the element that triggered the modal so we can
     return focus to it on close (accessibility requirement) */
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      /* Focus the modal panel after render */
      requestAnimationFrame(() => {
        modalRef.current?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  /* Escape key handler */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      /* Focus trap — Tab cycles within the modal */
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  /* Prevent body scroll when modal is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop — dark overlay with blur */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-black/60 backdrop-blur-sm',
          /* Fade in animation */
          'animate-[fadeIn_200ms_ease-out]'
        )}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative z-10',
          /* Glass elevated surface */
          'bg-[var(--glass-bg)]',
          'backdrop-blur-[24px]',
          'border border-[var(--glass-border)]',
          'shadow-[var(--shadow-lg),inset_0_1px_0_rgba(255,255,255,0.1)]',
          'rounded-[var(--radius-xl)]',
          'overflow-hidden',
          /* Scale-in animation — from 0.95 per Emil's principle */
          'animate-[scaleIn_200ms_cubic-bezier(0.25,1,0.5,1)]',
          'origin-center',

          /* Size variants */
          size === 'sm' && 'w-full max-w-sm',
          size === 'md' && 'w-full max-w-md',
          size === 'lg' && 'w-full max-w-lg',

          /* Remove focus outline on the panel itself */
          'outline-none',

          className
        )}
      >
        {/* Header with title and close button */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-6 pb-0">
            {title && (
              <h2 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-[var(--color-text)]">
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-full',
                  'text-[var(--color-muted)] hover:text-[var(--color-text)]',
                  'hover:bg-[var(--color-surface)]',
                  'transition-colors duration-150',
                  'cursor-pointer',
                  'min-h-[44px] min-w-[44px] flex items-center justify-center'
                )}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
