/* ============================================================
   Type Definitions — User System
   Types for user profile, XP, streaks, badges, and achievements.
   ============================================================ */

/** User profile information */
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  /** ISO date string of account creation */
  createdAt: string;
  /** Selected interests from onboarding */
  interests: string[];
  /** Daily learning goal in minutes */
  dailyGoalMinutes: number;
  /** Whether onboarding has been completed */
  hasCompletedOnboarding: boolean;
}

/** XP and leveling data */
export interface XPData {
  totalXP: number;
  currentLevel: number;
  /** XP within the current level (progress toward next level) */
  currentLevelXP: number;
  /** Total XP needed to reach the next level */
  xpForNextLevel: number;
}

/** Streak tracking */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  /** ISO date string of last learning activity */
  lastActiveDate: string;
  /** Whether the user has been active today */
  isActiveToday: boolean;
}

/** Daily goal progress */
export interface DailyGoalProgress {
  /** Minutes learned today */
  minutesToday: number;
  /** Daily goal target in minutes */
  goalMinutes: number;
  /** Whether the goal has been met today */
  isGoalMet: boolean;
}

/** User learning statistics */
export interface UserStats {
  totalCoursesCreated: number;
  coursesCompleted: number;
  coursesInProgress: number;
  totalXP: number;
}

/** Badge / Achievement */
export interface Badge {
  id: string;
  name: string;
  description: string;
  /** Icon name from lucide-react */
  icon: string;
  /** Whether the user has earned this badge */
  isEarned: boolean;
  /** ISO date when earned, undefined if locked */
  earnedAt?: string;
  /** How to earn this badge (shown when locked) */
  criteria: string;
  /** Badge category for grouping */
  category: "learning" | "streak" | "social" | "milestone";
}

/** Leaderboard entry */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xpThisWeek: number;
  /** The user's most-used learning mode this week */
  topMode?: string;
  /** Whether this is the current user's entry */
  isCurrentUser: boolean;
}

/** Notification preferences */
export interface NotificationPreferences {
  dailyStreakReminder: boolean;
  courseCompletionCelebration: boolean;
  leaderboardUpdates: boolean;
  newBadgeEarned: boolean;
}
