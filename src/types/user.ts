/* ============================================================
   User Types
   Defines user profile, XP/leveling, streaks, badges,
   achievements, and daily goal structures.
   ============================================================ */

/**
 * Daily learning goal options available during onboarding and settings.
 * Value is the target number of minutes per day.
 */
export type DailyGoalMinutes = 10 | 20 | 30 | 60;

/**
 * Badge rarity tiers — determines visual treatment in BadgeCard.
 */
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Interest categories selected during onboarding.
 * Used for personalized suggestions and course recommendations.
 */
export type InterestCategory =
  | 'technology'
  | 'science'
  | 'history'
  | 'design'
  | 'business'
  | 'math'
  | 'languages'
  | 'music'
  | 'fitness'
  | 'philosophy'
  | 'art'
  | 'psychology'
  | 'cooking'
  | 'writing'
  | 'engineering';

/**
 * XP and leveling data.
 * Level calculation: level = floor(totalXP / 500) + 1
 * XP to next level: 500 - (totalXP % 500)
 */
export interface XPData {
  /** Total XP earned across all courses */
  totalXP: number;
  /** Current level derived from totalXP */
  currentLevel: number;
  /** XP needed to reach the next level */
  xpToNextLevel: number;
  /** XP progress within current level (0–499) */
  xpInCurrentLevel: number;
}

/**
 * Streak tracking data.
 * A streak is maintained by completing at least one lesson per day.
 */
export interface Streak {
  /** Current consecutive days of learning */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** ISO date string of the last completed lesson */
  lastActivityDate: string;
  /** Whether today's streak has been maintained */
  todayCompleted: boolean;
}

/**
 * Daily learning goal progress.
 */
export interface DailyGoal {
  /** Target minutes per day */
  targetMinutes: DailyGoalMinutes;
  /** Minutes completed today */
  completedMinutes: number;
  /** Whether the daily goal has been reached */
  isComplete: boolean;
}

/**
 * A badge/achievement that can be earned.
 * Locked badges are visible but greyed out to drive motivation.
 */
export interface Badge {
  /** Unique badge identifier */
  id: string;
  /** Badge display name */
  name: string;
  /** Fun description shown when earned */
  description: string;
  /** Description shown when locked — creates pull to unlock */
  lockedDescription: string;
  /** Lucide icon name for the badge */
  icon: string;
  /** Badge rarity — affects visual treatment */
  rarity: BadgeRarity;
  /** Whether the user has earned this badge */
  earned: boolean;
  /** ISO timestamp of when the badge was earned (null if locked) */
  earnedAt: string | null;
  /** Criteria description — shown in locked badge modal */
  criteria: string;
}

/**
 * Achievement — a larger milestone that may unlock badges.
 */
export interface Achievement {
  /** Unique achievement identifier */
  id: string;
  /** Achievement display name */
  name: string;
  /** Achievement description */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** Progress toward completion (0–1) */
  progress: number;
  /** Whether the achievement is fully completed */
  completed: boolean;
  /** XP reward for completing the achievement */
  xpReward: number;
  /** Badge unlocked by this achievement (if any) */
  badgeId?: string;
}

/**
 * Notification preferences — toggled in Settings.
 */
export interface NotificationSettings {
  /** Daily streak reminder */
  streakReminder: boolean;
  /** Course completion celebration */
  completionCelebration: boolean;
  /** Leaderboard updates */
  leaderboardUpdates: boolean;
  /** New badge earned */
  newBadge: boolean;
}

/**
 * Complete user profile.
 * Stored in useUserStore with localStorage persistence.
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** Display name chosen during onboarding */
  displayName: string;
  /** Email address */
  email: string;
  /** Optional profile photo URL */
  avatarUrl?: string;
  /** Short bio/tagline for the profile page */
  bio?: string;
  /** Selected interest categories from onboarding */
  interests: InterestCategory[];
  /** XP and leveling data */
  xp: XPData;
  /** Streak tracking */
  streak: Streak;
  /** Daily learning goal */
  dailyGoal: DailyGoal;
  /** Earned and locked badges */
  badges: Badge[];
  /** Total courses created */
  totalCoursesCreated: number;
  /** Total courses completed */
  totalCoursesCompleted: number;
  /** Total courses currently in progress */
  coursesInProgress: number;
  /** Notification preferences */
  notifications: NotificationSettings;
  /** Default learning mode preference */
  defaultMode: import('./course').LearningMode;
  /** ISO timestamp of account creation */
  createdAt: string;
  /** Whether onboarding has been completed */
  onboardingComplete: boolean;
}

/**
 * Leaderboard entry for weekly XP rankings.
 */
export interface LeaderboardEntry {
  /** User ID */
  userId: string;
  /** Display name */
  displayName: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** XP earned this week */
  weeklyXP: number;
  /** Current rank position */
  rank: number;
  /** Whether this entry is the current user */
  isCurrentUser: boolean;
}
