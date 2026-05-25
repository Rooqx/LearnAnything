/* ============================================================
   useXP Hook
   Encapsulates XP earning logic, level calculation, and
   level-up detection. Used by learning interface, quiz popup,
   and course completion to award XP.
   ============================================================ */

'use client';

import { useCallback, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { XP_REWARDS } from '@/lib/constants';

interface UseXPResult {
  /** Add XP for completing a page */
  earnPageXP: () => number | null;
  /** Add XP for a correct quiz answer */
  earnQuizXP: () => number | null;
  /** Add XP for completing a module */
  earnModuleXP: () => number | null;
  /** Add XP for completing a course */
  earnCourseXP: () => number | null;
  /** Add XP for maintaining a streak */
  earnStreakXP: () => number | null;
  /** Add a custom XP amount */
  earnXP: (amount: number) => number | null;
  /** The last amount of XP earned (for XPToast display) */
  lastXPEarned: number;
  /** Whether a level-up just occurred (for LevelUpModal) */
  didLevelUp: boolean;
  /** The new level if a level-up occurred */
  newLevel: number | null;
  /** Reset the level-up state (after showing LevelUpModal) */
  clearLevelUp: () => void;
}

/**
 * Hook for all XP-related operations.
 *
 * Wraps the useUserStore.addXP action with convenience methods
 * for each XP-earning scenario. Tracks the last earned amount
 * (for XPToast) and whether a level-up occurred (for LevelUpModal).
 *
 * Usage:
 * ```tsx
 * const { earnPageXP, lastXPEarned, didLevelUp, newLevel, clearLevelUp } = useXP();
 *
 * // When user completes a page:
 * const level = earnPageXP();
 * // XPToast shows lastXPEarned
 * // If level !== null, LevelUpModal shows with newLevel
 * ```
 */
export function useXP(): UseXPResult {
  const addXP = useUserStore((state) => state.addXP);
  const [lastXPEarned, setLastXPEarned] = useState(0);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  /**
   * Core XP earning function.
   * Updates the store, tracks the earned amount, and detects level-ups.
   * Returns the new level if a level-up occurred, null otherwise.
   */
  const earnXP = useCallback(
    (amount: number): number | null => {
      setLastXPEarned(amount);
      const level = addXP(amount);
      if (level !== null) {
        setNewLevel(level);
      }
      return level;
    },
    [addXP]
  );

  const earnPageXP = useCallback(() => earnXP(XP_REWARDS.PAGE_COMPLETE), [earnXP]);
  const earnQuizXP = useCallback(() => earnXP(XP_REWARDS.QUIZ_CORRECT), [earnXP]);
  const earnModuleXP = useCallback(() => earnXP(XP_REWARDS.MODULE_COMPLETE), [earnXP]);
  const earnCourseXP = useCallback(() => earnXP(XP_REWARDS.COURSE_COMPLETE), [earnXP]);
  const earnStreakXP = useCallback(() => earnXP(XP_REWARDS.STREAK_BONUS), [earnXP]);

  const clearLevelUp = useCallback(() => {
    setNewLevel(null);
  }, []);

  return {
    earnPageXP,
    earnQuizXP,
    earnModuleXP,
    earnCourseXP,
    earnStreakXP,
    earnXP,
    lastXPEarned,
    didLevelUp: newLevel !== null,
    newLevel,
    clearLevelUp,
  };
}
