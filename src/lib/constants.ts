/* ============================================================
   App Constants
   Single source of truth for all magic numbers, copy strings,
   configuration values, and mock data across the app.
   No hardcoded values in components — everything references here.
   ============================================================ */

import type {
  LearningMode,
  DailyGoalMinutes,
  InterestCategory,
  Badge,
  User,
} from '@/types';

/* ============================================================
   XP & Leveling
   ============================================================ */

/** XP required to gain one level */
export const XP_PER_LEVEL = 500;

/** XP rewards for different actions */
export const XP_REWARDS = {
  /** XP for completing a single page */
  PAGE_COMPLETE: 10,
  /** XP for answering a quiz question correctly */
  QUIZ_CORRECT: 25,
  /** Bonus XP for completing an entire module */
  MODULE_COMPLETE: 50,
  /** Bonus XP for completing an entire course */
  COURSE_COMPLETE: 200,
  /** XP for maintaining a daily streak */
  STREAK_BONUS: 15,
} as const;

/* ============================================================
   Loading Messages
   Rotated every 2.5 seconds on the loading screen.
   ============================================================ */

export const LOADING_MESSAGES = [
  'Brewing your brain fuel...',
  'Downloading genius mode...',
  'Consulting the knowledge galaxies...',
  'Assembling your personal curriculum...',
  'Teaching the AI to teach you...',
  'Preparing your path to mastery...',
  'Connecting to the hive mind...',
  'Compiling brilliance...',
] as const;

/** Interval between loading message rotations (ms) */
export const LOADING_MESSAGE_INTERVAL = 2500;

/** Timeout for course generation API call (ms) */
export const COURSE_GENERATION_TIMEOUT = 30000;

/* ============================================================
   Suggestion Chips
   Pre-written topic suggestions shown in the chat empty state.
   ============================================================ */

export const SUGGESTION_CHIPS = [
  'Teach me Python',
  'Explain Quantum Physics',
  'How does the stock market work?',
  'What is Machine Learning?',
  'Intro to UI Design',
  'Basics of Neuroscience',
] as const;

/* ============================================================
   Interest Categories
   Available during onboarding step 1.
   ============================================================ */

export const INTEREST_OPTIONS: { value: InterestCategory; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'math', label: 'Math' },
  { value: 'languages', label: 'Languages' },
  { value: 'music', label: 'Music' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'art', label: 'Art' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'writing', label: 'Writing' },
  { value: 'engineering', label: 'Engineering' },
];

/* ============================================================
   Daily Goal Options
   Available during onboarding step 3 and in settings.
   ============================================================ */

export const DAILY_GOAL_OPTIONS: {
  value: DailyGoalMinutes;
  label: string;
  description: string;
}[] = [
  { value: 10, label: '10 mins', description: 'Quick daily habit' },
  { value: 20, label: '20 mins', description: 'Steady learner' },
  { value: 30, label: '30 mins', description: 'Serious student' },
  { value: 60, label: '1 hour', description: 'Knowledge warrior' },
];

/* ============================================================
   Learning Mode Configuration
   Defines behavior, colors, and copy for each mode.
   ============================================================ */

export const MODE_CONFIG: Record<
  LearningMode,
  {
    name: string;
    description: string;
    estimatedTime: string;
    color: string;
    icon: string;
    quizFrequency: string;
  }
> = {
  beginner: {
    name: 'Beginner',
    description: 'Full detailed course with step-by-step explanations',
    estimatedTime: '2-3 hours',
    color: 'var(--color-primary)',
    icon: 'Sprout',
    quizFrequency: 'After every module',
  },
  simplified: {
    name: 'Simplified',
    description: 'Condensed but complete — skips the basics',
    estimatedTime: '1-2 hours',
    color: 'var(--color-accent)',
    icon: 'Zap',
    quizFrequency: 'Every 2-3 modules',
  },
  quick: {
    name: 'Quick',
    description: 'Fast focused sprint — assumes prior knowledge',
    estimatedTime: '30-60 mins',
    color: 'var(--color-success)',
    icon: 'Timer',
    quizFrequency: 'Optional at end',
  },
};

/* ============================================================
   Badge Definitions
   All possible badges in the app. Earned status is tracked
   per-user in useUserStore.
   ============================================================ */

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'first-course',
    name: 'First Steps',
    description: 'Completed your very first course',
    lockedDescription: '???',
    icon: 'Rocket',
    rarity: 'common',
    earned: false,
    earnedAt: null,
    criteria: 'Complete your first course',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day learning streak',
    lockedDescription: '???',
    icon: 'Flame',
    rarity: 'common',
    earned: false,
    earnedAt: null,
    criteria: 'Learn for 7 consecutive days',
  },
  {
    id: 'streak-30',
    name: 'Monthly Machine',
    description: 'Maintained a 30-day learning streak',
    lockedDescription: '???',
    icon: 'Crown',
    rarity: 'rare',
    earned: false,
    earnedAt: null,
    criteria: 'Learn for 30 consecutive days',
  },
  {
    id: 'quiz-perfect',
    name: 'Perfect Score',
    description: 'Aced a quiz with 100% accuracy',
    lockedDescription: '???',
    icon: 'Target',
    rarity: 'common',
    earned: false,
    earnedAt: null,
    criteria: 'Get every question right on a quiz',
  },
  {
    id: 'courses-5',
    name: 'Knowledge Seeker',
    description: 'Completed 5 courses',
    lockedDescription: '???',
    icon: 'BookOpen',
    rarity: 'rare',
    earned: false,
    earnedAt: null,
    criteria: 'Complete 5 courses',
  },
  {
    id: 'courses-10',
    name: 'Scholar',
    description: 'Completed 10 courses',
    lockedDescription: '???',
    icon: 'GraduationCap',
    rarity: 'epic',
    earned: false,
    earnedAt: null,
    criteria: 'Complete 10 courses',
  },
  {
    id: 'xp-5000',
    name: 'XP Legend',
    description: 'Earned 5,000 total XP',
    lockedDescription: '???',
    icon: 'Zap',
    rarity: 'epic',
    earned: false,
    earnedAt: null,
    criteria: 'Earn 5,000 total XP',
  },
  {
    id: 'quick-master',
    name: 'Speed Demon',
    description: 'Completed 3 courses in Quick mode',
    lockedDescription: '???',
    icon: 'Timer',
    rarity: 'rare',
    earned: false,
    earnedAt: null,
    criteria: 'Complete 3 courses using Quick mode',
  },
  {
    id: 'all-modes',
    name: 'Versatile Learner',
    description: 'Completed a course in every learning mode',
    lockedDescription: '???',
    icon: 'Layers',
    rarity: 'epic',
    earned: false,
    earnedAt: null,
    criteria: 'Complete at least one course in each mode',
  },
  {
    id: 'streak-100',
    name: 'Centurion',
    description: 'Maintained a 100-day learning streak',
    lockedDescription: '???',
    icon: 'Award',
    rarity: 'legendary',
    earned: false,
    earnedAt: null,
    criteria: 'Learn for 100 consecutive days',
  },
];

/* ============================================================
   Navigation Items
   Used by BottomNav and Sidebar components.
   ============================================================ */

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { href: '/chat', label: 'Learn', icon: 'MessageSquare' },
  { href: '/courses', label: 'Courses', icon: 'BookOpen' },
  { href: '/leaderboard', label: 'Ranks', icon: 'Trophy' },
  { href: '/profile', label: 'Profile', icon: 'User' },
] as const;

/* ============================================================
   Initial User Data (Mock)
   Used when creating a new mock user after sign-up.
   ============================================================ */

export const INITIAL_USER_DATA: Omit<User, 'id' | 'displayName' | 'email' | 'createdAt'> = {
  interests: [],
  credits: 0,
  xp: {
    totalXP: 0,
    currentLevel: 1,
    xpToNextLevel: XP_PER_LEVEL,
    xpInCurrentLevel: 0,
  },
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date().toISOString(),
    todayCompleted: false,
  },
  dailyGoal: {
    targetMinutes: 20,
    completedMinutes: 0,
    isComplete: false,
  },
  badges: BADGE_DEFINITIONS,
  totalCoursesCreated: 0,
  totalCoursesCompleted: 0,
  coursesInProgress: 0,
  notifications: {
    streakReminder: true,
    completionCelebration: true,
    leaderboardUpdates: true,
    newBadge: true,
  },
  defaultMode: 'beginner',
  onboardingComplete: false,
};

/* ============================================================
   Pricing Data
   ============================================================ */

export const CREDIT_PACKAGES = [
  { id: 'credits-5', credits: 5, price: 4.99, courses: '5 courses', popular: false, bestValue: false },
  { id: 'credits-15', credits: 15, price: 12.99, courses: '15 courses', popular: true, bestValue: false },
  { id: 'credits-30', credits: 30, price: 22.99, courses: '30 courses', popular: false, bestValue: false },
  { id: 'credits-50', credits: 50, price: 34.99, courses: '50 courses', popular: false, bestValue: false },
  { id: 'credits-100', credits: 100, price: 59.99, courses: '100 courses', popular: false, bestValue: true },
] as const;

export const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Get started',
    price: 0,
    popular: false,
    features: ['3 courses per month', 'Basic learning modes', 'Progress tracking'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For serious learners',
    price: 9.99,
    popular: true,
    features: [
      'Unlimited courses',
      'All learning modes',
      'AI help assistant',
      'Advanced analytics',
      'Priority generation',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Learn together',
    price: 19.99,
    popular: false,
    features: [
      'Everything in Pro',
      'Team leaderboard',
      'Shared courses',
      'Admin dashboard',
      'API access',
    ],
  },
] as const;
