/* ============================================================
   User Store
   Manages user profile, XP, streaks, badges, and daily goal
   with localStorage persistence. Will be migrated to database
   persistence in a future iteration.
   ============================================================ */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  XPData,
  Streak,
  DailyGoal,
  DailyGoalMinutes,
  Badge,
  InterestCategory,
  NotificationSettings,
  LearningMode,
} from '@/types';
import {
  XP_PER_LEVEL,
  INITIAL_USER_DATA,
} from '@/lib/constants';

interface UserState {
  /** Complete user profile — null if not logged in */
  user: User | null;

  /** Initialize user data after sign-up/sign-in */
  setUser: (user: User) => void;

  /** Update display name */
  updateDisplayName: (name: string) => void;

  /** Update bio */
  updateBio: (bio: string) => void;

  /** Update avatar URL */
  updateAvatar: (url: string) => void;

  /** Set interests during onboarding */
  setInterests: (interests: InterestCategory[]) => void;

  /** Set daily goal during onboarding or settings */
  setDailyGoal: (minutes: DailyGoalMinutes) => void;

  /** Add learning minutes to daily goal progress */
  addLearningMinutes: (minutes: number) => void;

  /** Set default learning mode preference */
  setDefaultMode: (mode: LearningMode) => void;

  /** Update notification settings */
  setNotifications: (settings: Partial<NotificationSettings>) => void;

  /** Mark onboarding as complete */
  completeOnboarding: () => void;

  /**
   * Add XP to the user's total.
   * Automatically recalculates level, xpToNextLevel, and xpInCurrentLevel.
   * Returns the new level if a level-up occurred, null otherwise.
   */
  addXP: (amount: number) => number | null;

  /**
   * Increment streak if it hasn't been incremented today.
   * Checks lastActivityDate — if it's today, does nothing.
   * If it's yesterday, increments. If older, resets to 1.
   */
  updateStreak: () => void;

  /** Increment total courses created */
  incrementCoursesCreated: () => void;

  /** Increment completed courses and decrement in-progress */
  completeCourse: () => void;

  /** Increment courses in progress */
  startCourse: () => void;

  /** Earn a badge by ID */
  earnBadge: (badgeId: string) => void;

  /** Sign out — clear user data */
  signOut: () => void;
}

/**
 * Calculate XP data from total XP.
 * Level formula: level = floor(totalXP / XP_PER_LEVEL) + 1
 */
function calculateXPData(totalXP: number): XPData {
  const currentLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = totalXP % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - xpInCurrentLevel;

  return {
    totalXP,
    currentLevel,
    xpToNextLevel,
    xpInCurrentLevel,
  };
}

/**
 * Check if an ISO date string represents today.
 */
function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Check if an ISO date string represents yesterday.
 */
function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      updateDisplayName: (name) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, displayName: name } };
        }),

      updateBio: (bio) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, bio } };
        }),

      updateAvatar: (url) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, avatarUrl: url } };
        }),

      setInterests: (interests) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, interests } };
        }),

      setDailyGoal: (minutes) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              dailyGoal: {
                ...state.user.dailyGoal,
                targetMinutes: minutes,
              },
            },
          };
        }),

      addLearningMinutes: (minutes) =>
        set((state) => {
          if (!state.user) return state;
          const completed = state.user.dailyGoal.completedMinutes + minutes;
          return {
            user: {
              ...state.user,
              dailyGoal: {
                ...state.user.dailyGoal,
                completedMinutes: completed,
                isComplete: completed >= state.user.dailyGoal.targetMinutes,
              },
            },
          };
        }),

      setDefaultMode: (mode) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, defaultMode: mode } };
        }),

      setNotifications: (settings) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              notifications: { ...state.user.notifications, ...settings },
            },
          };
        }),

      completeOnboarding: () =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, onboardingComplete: true } };
        }),

      addXP: (amount) => {
        const state = get();
        if (!state.user) return null;

        const oldLevel = state.user.xp.currentLevel;
        const newTotalXP = state.user.xp.totalXP + amount;
        const newXPData = calculateXPData(newTotalXP);

        set({
          user: {
            ...state.user,
            xp: newXPData,
          },
        });

        /* Return new level if a level-up occurred — triggers LevelUpModal */
        return newXPData.currentLevel > oldLevel ? newXPData.currentLevel : null;
      },

      updateStreak: () =>
        set((state) => {
          if (!state.user) return state;

          const { streak } = state.user;
          const today = new Date().toISOString();

          /* Already completed today — no change needed */
          if (isToday(streak.lastActivityDate)) {
            return {
              user: {
                ...state.user,
                streak: { ...streak, todayCompleted: true },
              },
            };
          }

          /* Yesterday — increment streak */
          if (isYesterday(streak.lastActivityDate)) {
            const newStreak = streak.currentStreak + 1;
            return {
              user: {
                ...state.user,
                streak: {
                  currentStreak: newStreak,
                  longestStreak: Math.max(newStreak, streak.longestStreak),
                  lastActivityDate: today,
                  todayCompleted: true,
                },
              },
            };
          }

          /* Older than yesterday — streak broken, reset to 1 */
          return {
            user: {
              ...state.user,
              streak: {
                currentStreak: 1,
                longestStreak: streak.longestStreak,
                lastActivityDate: today,
                todayCompleted: true,
              },
            },
          };
        }),

      incrementCoursesCreated: () =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              totalCoursesCreated: state.user.totalCoursesCreated + 1,
            },
          };
        }),

      completeCourse: () =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              totalCoursesCompleted: state.user.totalCoursesCompleted + 1,
              coursesInProgress: Math.max(0, state.user.coursesInProgress - 1),
            },
          };
        }),

      startCourse: () =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              coursesInProgress: state.user.coursesInProgress + 1,
            },
          };
        }),

      earnBadge: (badgeId) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              badges: state.user.badges.map((badge) =>
                badge.id === badgeId
                  ? { ...badge, earned: true, earnedAt: new Date().toISOString() }
                  : badge
              ),
            },
          };
        }),

      signOut: () => set({ user: null }),
    }),
    {
      name: 'learn-anything-user',
    }
  )
);
