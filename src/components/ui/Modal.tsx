"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   Modal Component
   
   Base modal wrapper with glass surface, focus trap,
   keyboard escape, and overlay blur.
   Reused by QuizPopup, LevelUpModal, and confirmation dialogs.
   ============================================================ */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Whether to show the close button (X) in top-right */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlay?: boolean;
  /** Max width class */
  maxWidth?: string;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlay = true,
  maxWidth = "max-w-lg",
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  /* Keyboard escape handler */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      /* Prevent body scroll when modal is open */
      document.body.style.overflow = "hidden";

      /* Focus the modal on open for accessibility */
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "glass-elevated relative z-10 w-full",
          "rounded-[var(--radius-xl)] p-6",
          "animate-in fade-in zoom-in-95 duration-200",
          maxWidth,
          className
        )}
        style={{
          animation: "modalIn 200ms ease-out",
        }}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        {children}
      </div>

      {/* Inline keyframe for modal entrance */}
      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
