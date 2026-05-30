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
import { addXPInDB } from '@/lib/api';

interface UseXPResult {
  /** Add XP for completing a page */
  earnPageXP: (courseId?: string) => number | null;
  /** Add XP for a correct quiz answer */
  earnQuizXP: (courseId?: string) => number | null;
  /** Add XP for completing a module */
  earnModuleXP: (courseId?: string) => number | null;
  /** Add XP for completing a course */
  earnCourseXP: (courseId?: string) => number | null;
  /** Add XP for maintaining a streak */
  earnStreakXP: () => number | null;
  /** Add a custom XP amount */
  earnXP: (amount: number, reason?: string, courseId?: string) => number | null;
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
    (amount: number, reason: string = 'general', courseId?: string): number | null => {
      setLastXPEarned(amount);
      const level = addXP(amount);
      if (level !== null) {
        setNewLevel(level);
      }
      
      // Fire and forget database persistence
      addXPInDB(amount, reason, courseId).catch(console.error);
      
      return level;
    },
    [addXP]
  );

  const earnPageXP = useCallback((courseId?: string) => earnXP(XP_REWARDS.PAGE_COMPLETE, 'page_complete', courseId), [earnXP]);
  const earnQuizXP = useCallback((courseId?: string) => earnXP(XP_REWARDS.QUIZ_CORRECT, 'quiz_pass', courseId), [earnXP]);
  const earnModuleXP = useCallback((courseId?: string) => earnXP(XP_REWARDS.MODULE_COMPLETE, 'module_complete', courseId), [earnXP]);
  const earnCourseXP = useCallback((courseId?: string) => earnXP(XP_REWARDS.COURSE_COMPLETE, 'course_complete', courseId), [earnXP]);
  const earnStreakXP = useCallback(() => earnXP(XP_REWARDS.STREAK_BONUS, 'streak_maintained'), [earnXP]);

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
