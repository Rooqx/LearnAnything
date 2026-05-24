import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProfile,
  XPData,
  StreakData,
  DailyGoalProgress,
  UserStats,
  Badge,
  NotificationPreferences,
} from "@/types";

/* ============================================================
   User Store
   Manages user profile, XP, streak, daily goal, stats, badges,
   and notification preferences.
   Persisted to localStorage for offline-first experience.
   ============================================================ */

interface UserStoreState {
  profile: UserProfile;
  xp: XPData;
  streak: StreakData;
  dailyGoal: DailyGoalProgress;
  stats: UserStats;
  badges: Badge[];
  notifications: NotificationPreferences;
}

interface UserStoreActions {
  /** Update profile fields */
  updateProfile: (updates: Partial<UserProfile>) => void;

  /** Add XP and recalculate level. Returns true if user leveled up */
  addXP: (amount: number) => boolean;

  /** Update streak data (called on daily login check) */
  updateStreak: (data: Partial<StreakData>) => void;

  /** Add minutes to daily goal progress */
  addLearningMinutes: (minutes: number) => void;

  /** Update user stats */
  updateStats: (updates: Partial<UserStats>) => void;

  /** Award a badge by ID */
  awardBadge: (badgeId: string) => void;

  /** Update notification preferences */
  updateNotifications: (updates: Partial<NotificationPreferences>) => void;

  /** Reset daily goal progress (called at midnight) */
  resetDailyGoal: () => void;

  /** Set daily goal target minutes */
  setDailyGoalMinutes: (minutes: number) => void;
}

/**
 * Calculate level from total XP.
 * Each level requires progressively more XP.
 * Formula: level = floor(sqrt(totalXP / 100))
 * This gives a smooth curve: L1=100XP, L2=400XP, L3=900XP, etc.
 */
function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

/**
 * Calculate XP needed for a specific level.
 * Inverse of the level formula.
 */
function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export const useUserStore = create<UserStoreState & UserStoreActions>()(
  persist(
    (set, get) => ({
      /* ---------- Default State ---------- */
      profile: {
        id: "",
        displayName: "",
        email: "",
        createdAt: new Date().toISOString(),
        interests: [],
        dailyGoalMinutes: 20,
        hasCompletedOnboarding: false,
      },

      xp: {
        totalXP: 0,
        currentLevel: 1,
        currentLevelXP: 0,
        xpForNextLevel: 100,
      },

      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: "",
        isActiveToday: false,
      },

      dailyGoal: {
        minutesToday: 0,
        goalMinutes: 20,
        isGoalMet: false,
      },

      stats: {
        totalCoursesCreated: 0,
        coursesCompleted: 0,
        coursesInProgress: 0,
        totalXP: 0,
      },

      badges: [],

      notifications: {
        dailyStreakReminder: true,
        courseCompletionCelebration: true,
        leaderboardUpdates: true,
        newBadgeEarned: true,
      },

      /* ---------- Actions ---------- */

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      addXP: (amount) => {
        const state = get();
        const newTotalXP = state.xp.totalXP + amount;
        const newLevel = calculateLevel(newTotalXP);
        const currentLevelStartXP = xpForLevel(newLevel);
        const nextLevelXP = xpForLevel(newLevel + 1);
        const didLevelUp = newLevel > state.xp.currentLevel;

        set({
          xp: {
            totalXP: newTotalXP,
            currentLevel: newLevel,
            currentLevelXP: newTotalXP - currentLevelStartXP,
            xpForNextLevel: nextLevelXP - currentLevelStartXP,
          },
          stats: {
            ...state.stats,
            totalXP: newTotalXP,
          },
        });

        return didLevelUp;
      },

      updateStreak: (data) =>
        set((state) => ({
          streak: { ...state.streak, ...data },
        })),

      addLearningMinutes: (minutes) =>
        set((state) => {
          const newMinutes = state.dailyGoal.minutesToday + minutes;
          return {
            dailyGoal: {
              ...state.dailyGoal,
              minutesToday: newMinutes,
              isGoalMet: newMinutes >= state.dailyGoal.goalMinutes,
            },
          };
        }),

      updateStats: (updates) =>
        set((state) => ({
          stats: { ...state.stats, ...updates },
        })),

      awardBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.map((badge) =>
            badge.id === badgeId
              ? { ...badge, isEarned: true, earnedAt: new Date().toISOString() }
              : badge
          ),
        })),

      updateNotifications: (updates) =>
        set((state) => ({
          notifications: { ...state.notifications, ...updates },
        })),

      resetDailyGoal: () =>
        set((state) => ({
          dailyGoal: {
            ...state.dailyGoal,
            minutesToday: 0,
            isGoalMet: false,
          },
        })),

      setDailyGoalMinutes: (minutes) =>
        set((state) => ({
          dailyGoal: {
            ...state.dailyGoal,
            goalMinutes: minutes,
          },
          profile: {
            ...state.profile,
            dailyGoalMinutes: minutes,
          },
        })),
    }),
    {
      name: "la-user",
    }
  )
);
