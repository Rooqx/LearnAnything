"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { LumiAnimated, FloatUp } from "@/components/ux";
import { cn } from "@/lib/utils";
import { XP_REWARDS } from "@/lib/constants";
import type { QuizQuestion } from "@/types";

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  onComplete: (correctCount: number, totalXP: number) => void;
}

export function QuizPopup({ isOpen, onClose, questions, onComplete }: QuizPopupProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showXP, setShowXP] = useState(false);

  const question = questions[currentIdx];
  if (!question) return null;

  const handleSelect = (idx: number) => {
    if (isRevealed || selectedIdx !== null) return;
    setSelectedIdx(idx);
    /* 150ms delay before reveal for visual feedback */
    setTimeout(() => {
      setIsRevealed(true);
      const isCorrect = idx === question.correctIndex;
      const xp = isCorrect ? XP_REWARDS.QUIZ_CORRECT : XP_REWARDS.QUIZ_WRONG;
      if (isCorrect) setCorrectCount((c) => c + 1);
      setTotalXP((t) => t + xp);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 800);
    }, 150);
  };

  const handleContinue = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedIdx(null);
      setIsRevealed(false);
    } else {
      onComplete(correctCount, totalXP);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} closeOnOverlay={false}>
      <div className="flex flex-col items-center">
        <LumiAnimated state={isRevealed ? (selectedIdx === question.correctIndex ? "excited" : "idle") : "thinking"} size={64} />
        <p className="mt-4 text-center font-heading text-lg font-semibold">{question.question}</p>
        <div className="mt-4 w-full space-y-2">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = question.correctIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "w-full rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm cursor-pointer",
                  "transition-all duration-150",
                  !isRevealed && !isSelected && "border-[var(--color-border)] hover:border-[var(--color-primary)]",
                  !isRevealed && isSelected && "border-[var(--color-primary)] bg-[var(--color-primary)]/10",
                  isRevealed && isCorrect && "border-[var(--color-success)] bg-[var(--color-success)]/10",
                  isRevealed && isSelected && !isCorrect && "border-[var(--color-error)] bg-[var(--color-error)]/10"
                )}
              >
                <div className="flex items-center gap-2">
                  {isRevealed && isCorrect && <Check size={16} className="text-[var(--color-success)]" />}
                  {isRevealed && isSelected && !isCorrect && <X size={16} className="text-[var(--color-error)]" />}
                  {opt}
                </div>
              </button>
            );
          })}
        </div>
        {isRevealed && (
          <div className="mt-3 text-center">
            <p className="text-xs text-[var(--color-muted)]">{question.explanation}</p>
            {showXP && <div className="mt-2"><FloatUp xp={selectedIdx === question.correctIndex ? XP_REWARDS.QUIZ_CORRECT : XP_REWARDS.QUIZ_WRONG} /></div>}
            <Button variant="primary" onClick={handleContinue} className="mt-4">
              {currentIdx < questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
