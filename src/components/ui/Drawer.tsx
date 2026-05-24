"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerPosition = "left" | "right" | "bottom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: DrawerPosition;
  title?: string;
  className?: string;
}

const positionConfig: Record<DrawerPosition, { panel: string; closed: string }> = {
  left: { panel: "left-0 top-0 h-full w-[280px] border-r", closed: "-translate-x-full" },
  right: { panel: "right-0 top-0 h-full w-[320px] border-l", closed: "translate-x-full" },
  bottom: { panel: "bottom-0 left-0 w-full max-h-[85vh] rounded-t-2xl border-t", closed: "translate-y-full" },
};

export function Drawer({ isOpen, onClose, children, position = "left", title, className }: DrawerProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = ""; };
  }, [isOpen, handleKeyDown]);

  const cfg = positionConfig[position];

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "pointer-events-none opacity-0")} onClick={onClose} aria-hidden="true" />
      <div className={cn("fixed z-50 bg-[var(--color-surface)] border-[var(--color-border)] transition-transform duration-300 ease-out", cfg.panel, isOpen ? "translate-x-0 translate-y-0" : cfg.closed, className)} role="dialog" aria-modal="true">
        {title && (
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
            <h2 className="font-heading text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="cursor-pointer rounded-full p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]" aria-label="Close"><X size={20} /></button>
          </div>
        )}
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
