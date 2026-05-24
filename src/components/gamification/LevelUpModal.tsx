"use client";

import { Modal, Button } from "@/components/ui";
import { LumiAnimated } from "@/components/ux";
import { Sparkles } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
}

/** Level up celebration modal with scale-in entrance and glow */
export function LevelUpModal({ isOpen, onClose, newLevel }: LevelUpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="flex flex-col items-center py-4 text-center">
        <LumiAnimated state="celebrating" size={120} />
        <div className="mt-4 flex items-center gap-2 text-[var(--color-reward)]">
          <Sparkles size={24} />
          <h2 className="font-heading text-3xl font-bold">Level Up!</h2>
          <Sparkles size={24} />
        </div>
        <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]/20 animate-pulse-glow">
          <span className="font-heading text-3xl font-bold text-[var(--color-primary)]">{newLevel}</span>
        </div>
        <p className="mt-4 text-sm text-[var(--color-muted)]">Keep going — you&apos;re unstoppable!</p>
        <Button variant="primary" onClick={onClose} className="mt-6">Continue Learning</Button>
      </div>
    </Modal>
  );
}
