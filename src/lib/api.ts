/* ============================================================
   API Layer
   Fetch wrapper for n8n webhook calls and mock data fallback.
   All course generation API calls go through this module.
   ============================================================ */

import type {
  Course,
  CourseGenerationRequest,
  CourseGenerationResponse,
  LearningMode,
  Module,
  CoursePage,
  ContentBlock,
  LeaderboardEntry,
} from '@/types';
import { COURSE_GENERATION_TIMEOUT } from '@/lib/constants';
import { generateId } from '@/lib/utils';

import axios from 'axios';

/**
 * Chat Session Endpoints
 */

export async function getOrCreateChatSession() {
  const response = await axios.post('/api/chat/session');
  console.log(response.data, "response from server")
  return response.data.data;
}

export async function getActiveChatSession() {
  const response = await axios.get('/api/chat/session/active');
  return response.data.data;
}

export async function sendChatMessage(sessionId: string, message: string, teachingStyle?: string) {
  const response = await axios.post('/api/chat/message', { sessionId, message, teachingStyle });
  return response.data.data;
}

export async function checkGenerationComplete(sessionId: string) {
  const response = await axios.patch(`/api/chat/session/${sessionId}/complete`);
  return response.data.data;
}

export async function cancelChatSession(sessionId: string) {
  const response = await axios.patch(`/api/chat/session/${sessionId}/cancel`);
  return response.data.data;
}

/**
 * Fetch all courses for the current user from the database.
 */
export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await axios.get('/api/courses');
    return response.data.data.courses || [];
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

/**
 * Fetch all static badges and the user's earned status.
 */
export async function fetchAchievements(): Promise<any[]> {
  try {
    const response = await axios.get('/api/achievements');
    return response.data.data.badges || [];
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return [];
  }
}



/* ============================================================
   Mock Content Helpers
   Generate realistic-sounding titles for mock courses.
   ============================================================ */

function getMockModuleTitle(topic: string, index: number): string {
  const prefixes = ['Introduction to', 'Core Concepts of', 'Deep Dive into', 'Advanced', 'Mastering'];
  return `${prefixes[index % prefixes.length]} ${topic}`;
}

function getMockPageTitle(topic: string, moduleIndex: number, pageIndex: number): string {
  const titles = [
    ['What and Why', 'Key Definitions', 'Historical Context', 'Getting Started'],
    ['Fundamental Principles', 'How It Works', 'Building Blocks', 'Connecting the Dots'],
    ['Practical Applications', 'Real-World Examples', 'Case Studies', 'Hands-On Practice'],
    ['Advanced Patterns', 'Edge Cases', 'Optimization', 'Expert Techniques'],
    ['Putting It All Together', 'Review and Synthesis', 'Next Steps', 'Final Thoughts'],
  ];
  return titles[moduleIndex % titles.length][pageIndex % titles[0].length];
}

function getMockSectionTitle(topic: string, moduleIndex: number, pageIndex: number): string {
  return `${topic} — ${getMockPageTitle(topic, moduleIndex, pageIndex)}`;
}

function getOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = n % 100;
  return `${n}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
}

/* ============================================================
   Mock Quiz Generator
   ============================================================ */

export function generateMockQuiz(moduleId: string, topic: string) {
  return {
    id: generateId(),
    moduleId,
    questions: [
      {
        id: generateId(),
        question: `Which of the following best describes a core principle of ${topic}?`,
        answers: [
          { id: 'a', text: 'It operates independently of other systems', isCorrect: false },
          { id: 'b', text: 'It builds on foundational concepts progressively', isCorrect: true },
          { id: 'c', text: 'It requires no prior knowledge to apply', isCorrect: false },
          { id: 'd', text: 'It only works in theoretical contexts', isCorrect: false },
        ],
        explanation: `${topic} is built on layered understanding — each concept reinforces the next, creating a comprehensive knowledge structure.`,
        xpReward: 25,
      },
      {
        id: generateId(),
        question: `What is the most effective approach when learning ${topic}?`,
        answers: [
          { id: 'a', text: 'Memorizing every detail before practicing', isCorrect: false },
          { id: 'b', text: 'Skipping theory and going straight to practice', isCorrect: false },
          { id: 'c', text: 'Balancing theory with hands-on application', isCorrect: true },
          { id: 'd', text: 'Only studying from a single source', isCorrect: false },
        ],
        explanation: 'The most effective learning combines theoretical understanding with practical application — exactly what this course is designed to do.',
        xpReward: 25,
      },
      {
        id: generateId(),
        question: `Which real-world application of ${topic} has the most impact?`,
        answers: [
          { id: 'a', text: 'Academic research exclusively', isCorrect: false },
          { id: 'b', text: 'Cross-domain problem solving', isCorrect: true },
          { id: 'c', text: 'Entertainment and media only', isCorrect: false },
          { id: 'd', text: 'Historical record keeping', isCorrect: false },
        ],
        explanation: `${topic} has the greatest impact when applied across multiple domains — the principles transfer and create unexpected innovations.`,
        xpReward: 25,
      },
    ],
  };
}

/* ============================================================
   Mock Leaderboard Data
   ============================================================ */

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: '1', displayName: 'Kai Nakamura', avatarUrl: undefined, weeklyXP: 2847, rank: 1, isCurrentUser: false },
  { userId: '2', displayName: 'Priya Sharma', avatarUrl: undefined, weeklyXP: 2651, rank: 2, isCurrentUser: false },
  { userId: '3', displayName: 'Mateo Rivera', avatarUrl: undefined, weeklyXP: 2298, rank: 3, isCurrentUser: false },
  { userId: '4', displayName: 'Zara Okonkwo', avatarUrl: undefined, weeklyXP: 1975, rank: 4, isCurrentUser: false },
  { userId: '5', displayName: 'Lena Petrov', avatarUrl: undefined, weeklyXP: 1843, rank: 5, isCurrentUser: false },
  { userId: '6', displayName: 'Amir Hassan', avatarUrl: undefined, weeklyXP: 1712, rank: 6, isCurrentUser: false },
  { userId: '7', displayName: 'Yuki Tanaka', avatarUrl: undefined, weeklyXP: 1598, rank: 7, isCurrentUser: false },
  { userId: '8', displayName: 'Nia Williams', avatarUrl: undefined, weeklyXP: 1456, rank: 8, isCurrentUser: false },
  { userId: '9', displayName: 'Oscar Lindqvist', avatarUrl: undefined, weeklyXP: 1324, rank: 9, isCurrentUser: false },
  { userId: '10', displayName: 'Fatima Al-Rashid', avatarUrl: undefined, weeklyXP: 1189, rank: 10, isCurrentUser: false },
];
