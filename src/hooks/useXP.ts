"use client";

import { useCallback, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

/* ============================================================
   useXP Hook
   
   Handles XP earning, level calculation, and level-up triggers.
   Returns:
   - earnXP: function to add XP and check for level up
   - showLevelUp: whether to show the level up modal
   - dismissLevelUp: function to dismiss the level up modal
   - newLevel: the level the user reached (only set on level up)
   
   Components call earnXP() after quiz answers, course completions,
   etc. If the XP addition causes a level up, showLevelUp flips
   to true so the calling component can render LevelUpModal.
   ============================================================ */

interface UseXPReturn {
  earnXP: (amount: number) => void;
  showLevelUp: boolean;
  dismissLevelUp: () => void;
  newLevel: number | null;
}

export function useXP(): UseXPReturn {
  const addXP = useUserStore((state) => state.addXP);
  const currentLevel = useUserStore((state) => state.xp.currentLevel);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  const earnXP = useCallback(
    (amount: number) => {
      const didLevelUp = addXP(amount);
      if (didLevelUp) {
        /* We need to read the new level after the store updates.
           Since addXP is synchronous and Zustand updates are immediate,
           the currentLevel ref will be stale. We calculate it fresh. */
        const updatedLevel = currentLevel + 1;
        setNewLevel(updatedLevel);
        setShowLevelUp(true);
      }
    },
    [addXP, currentLevel]
  );

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
    setNewLevel(null);
  }, []);

  return { earnXP, showLevelUp, dismissLevelUp, newLevel };
}
