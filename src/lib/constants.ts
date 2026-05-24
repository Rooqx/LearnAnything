import type { LearningModeConfig, Badge } from "@/types";

/* ============================================================
   App-Wide Constants
   All magic numbers, threshold values, copy strings, and
   configuration objects live here. Never hardcode in components.
   ============================================================ */

/* ---------- XP System ---------- */

/** XP awarded for different actions */
export const XP_REWARDS = {
  QUIZ_CORRECT: 25,
  QUIZ_WRONG: 5,
  MODULE_COMPLETE: 50,
  COURSE_COMPLETE: 200,
  DAILY_GOAL_MET: 30,
  STREAK_BONUS: 10,
} as const;

/* ---------- Learning Modes ---------- */

export const LEARNING_MODES: LearningModeConfig[] = [
  {
    name: "Beginner",
    mode: "beginner",
    description: "Start from scratch with detailed, step-by-step explanations",
    estimatedTime: "2-4 hours",
    color: "#6C3CE1",
    icon: "Sprout",
  },
  {
    name: "Simplified",
    mode: "simplified",
    description: "Condensed version that skips the very basics",
    estimatedTime: "1-2 hours",
    color: "#F7C948",
    icon: "Zap",
  },
  {
    name: "Quick",
    mode: "quick",
    description: "Fast sprint for those who already know the fundamentals",
    estimatedTime: "30-60 min",
    color: "#2DD4BF",
    icon: "Timer",
  },
];

/* ---------- Loading Screen Messages ---------- */

export const LOADING_MESSAGES = [
  "Brewing your brain fuel...",
  "Downloading genius mode...",
  "Consulting the knowledge galaxies...",
  "Assembling your personal curriculum...",
  "Teaching the AI to teach you...",
  "Preparing your path to mastery...",
] as const;

/** How often loading messages rotate (ms) */
export const LOADING_MESSAGE_INTERVAL = 2500;

/* ---------- Chat Suggestion Chips ---------- */

export const SUGGESTION_CHIPS = [
  "Teach me Python",
  "Explain Quantum Physics",
  "How does the stock market work?",
  "What is Machine Learning?",
  "Intro to UI Design",
  "Basics of Neuroscience",
] as const;

/* ---------- Onboarding Interest Options ---------- */

export const INTEREST_OPTIONS = [
  "Technology",
  "Science",
  "History",
  "Design",
  "Business",
  "Math",
  "Languages",
  "Music",
  "Fitness",
  "Philosophy",
] as const;

/* ---------- Daily Goal Options ---------- */

export const DAILY_GOAL_OPTIONS = [
  { minutes: 10, label: "10 mins", description: "Casual" },
  { minutes: 20, label: "20 mins", description: "Regular" },
  { minutes: 30, label: "30 mins", description: "Serious" },
  { minutes: 60, label: "1 hour", description: "Intense" },
] as const;

/* ---------- Navigation ---------- */

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "Home" },
  { href: "/chat", label: "Learn", icon: "MessageSquare" },
  { href: "/courses", label: "Courses", icon: "BookOpen" },
  { href: "/leaderboard", label: "Ranks", icon: "Trophy" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;

/* ---------- Thresholds ---------- */

/** API timeout in milliseconds */
export const API_TIMEOUT_MS = 30000;

/** Maximum display name length */
export const MAX_DISPLAY_NAME_LENGTH = 24;

/** Minimum touch target size in pixels (WCAG) */
export const MIN_TOUCH_TARGET = 44;

/* ---------- Default Badges ---------- */

export const DEFAULT_BADGES: Badge[] = [
  {
    id: "first-course",
    name: "First Steps",
    description: "Complete your first course",
    icon: "Footprints",
    isEarned: false,
    criteria: "Complete any course",
    category: "milestone",
  },
  {
    id: "streak-3",
    name: "On Fire",
    description: "Maintain a 3-day streak",
    icon: "Flame",
    isEarned: false,
    criteria: "Learn 3 days in a row",
    category: "streak",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "Zap",
    isEarned: false,
    criteria: "Learn 7 days in a row",
    category: "streak",
  },
  {
    id: "streak-30",
    name: "Unstoppable",
    description: "Maintain a 30-day streak",
    icon: "Shield",
    isEarned: false,
    criteria: "Learn 30 days in a row",
    category: "streak",
  },
  {
    id: "5-courses",
    name: "Knowledge Seeker",
    description: "Complete 5 courses",
    icon: "Search",
    isEarned: false,
    criteria: "Complete 5 courses",
    category: "milestone",
  },
  {
    id: "10-courses",
    name: "Scholar",
    description: "Complete 10 courses",
    icon: "GraduationCap",
    isEarned: false,
    criteria: "Complete 10 courses",
    category: "milestone",
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Get 100% on 5 quizzes",
    icon: "Brain",
    isEarned: false,
    criteria: "Score perfectly on 5 quizzes",
    category: "learning",
  },
  {
    id: "speed-learner",
    name: "Speed Learner",
    description: "Complete a Quick mode course",
    icon: "Timer",
    isEarned: false,
    criteria: "Finish a course in Quick mode",
    category: "learning",
  },
  {
    id: "level-5",
    name: "Rising Star",
    description: "Reach Level 5",
    icon: "Star",
    isEarned: false,
    criteria: "Earn enough XP to reach Level 5",
    category: "milestone",
  },
  {
    id: "level-10",
    name: "Luminary",
    description: "Reach Level 10",
    icon: "Sparkles",
    isEarned: false,
    criteria: "Earn enough XP to reach Level 10",
    category: "milestone",
  },
  {
    id: "daily-goal-7",
    name: "Consistent",
    description: "Meet daily goal 7 days in a row",
    icon: "Target",
    isEarned: false,
    criteria: "Hit your daily learning goal 7 consecutive days",
    category: "streak",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Learn after midnight",
    icon: "Moon",
    isEarned: false,
    criteria: "Complete a lesson between 12am and 5am",
    category: "learning",
  },
];

/* ---------- Mode Colors (for dynamic styling) ---------- */

export const MODE_COLORS: Record<string, string> = {
  beginner: "#6C3CE1",
  simplified: "#F7C948",
  quick: "#2DD4BF",
};
