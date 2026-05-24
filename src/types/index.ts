/* ============================================================
   Type Barrel Exports
   Single import point for all shared types:
   import { Course, User, Quiz, AnimationMode } from '@/types'
   ============================================================ */

export type {
  LearningMode,
  CourseStatus,
  ContentBlockType,
  ContentBlock,
  CoursePage,
  Module,
  Course,
  CourseGenerationRequest,
  CourseGenerationResponse,
} from './course';

export type {
  DailyGoalMinutes,
  BadgeRarity,
  InterestCategory,
  XPData,
  Streak,
  DailyGoal,
  Badge,
  Achievement,
  NotificationSettings,
  User,
  LeaderboardEntry,
} from './user';

export type {
  QuizAnswer,
  QuizQuestion,
  Quiz,
  QuizResult,
} from './quiz';

export type {
  AnimationMode,
  LumiState,
  MotionVariant,
  SwipeDirection,
  SwipeEvent,
} from './animation';
