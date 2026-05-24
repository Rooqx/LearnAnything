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
} from '@/types';
import { COURSE_GENERATION_TIMEOUT } from '@/lib/constants';
import { generateId } from '@/lib/utils';

/**
 * The n8n webhook URL from environment variables.
 * When empty, the mock data fallback is used automatically.
 */
const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

/**
 * Generate a course via the n8n webhook.
 * Falls back to mock data when WEBHOOK_URL is empty.
 *
 * Handles three states:
 * - Success: returns course data
 * - Error: returns error message
 * - Timeout: aborts after COURSE_GENERATION_TIMEOUT (30s)
 */
export async function generateCourse(
  request: CourseGenerationRequest
): Promise<CourseGenerationResponse> {
  /* Use mock data when no webhook URL is configured */
  if (!WEBHOOK_URL) {
    return generateMockCourse(request);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), COURSE_GENERATION_TIMEOUT);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Course generation failed (${response.status}). Please try again.`,
      };
    }

    const data = await response.json();
    return { success: true, course: data.course || data };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: 'Course generation timed out. Please try again.',
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please check your connection and try again.',
    };
  }
}

/* ============================================================
   Mock Data Generator
   Produces realistic course structures for development.
   Simulates a 2–4 second generation delay.
   ============================================================ */

async function generateMockCourse(
  request: CourseGenerationRequest
): Promise<CourseGenerationResponse> {
  /* Simulate API delay — 2 to 4 seconds for realism */
  const mockDelay = 2000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, mockDelay));

  const courseId = generateId();
  const moduleCount = request.mode === 'quick' ? 3 : request.mode === 'simplified' ? 4 : 5;

  const modules: Module[] = Array.from({ length: moduleCount }, (_, moduleIndex) => {
    const pageCount = request.mode === 'quick' ? 2 : request.mode === 'simplified' ? 3 : 4;

    const pages: CoursePage[] = Array.from({ length: pageCount }, (_, pageIndex) => {
      const blocks: ContentBlock[] = [
        {
          id: generateId(),
          type: 'text',
          content: `## ${getMockSectionTitle(request.topic, moduleIndex, pageIndex)}\n\nThis section covers the foundational concepts you need to understand. Let's break this down into digestible pieces that build on each other.\n\nThe key insight here is that ${request.topic.toLowerCase()} works by connecting multiple concepts together. Each piece reinforces the others, creating a comprehensive understanding.`,
        },
        {
          id: generateId(),
          type: 'bullet_list',
          content:
            '- Understanding the core principles and how they interact\n- Recognizing patterns that appear across different contexts\n- Building mental models that help you reason about new problems\n- Connecting theory to practical real-world applications',
        },
      ];

      /* Add a code block for technology/programming topics */
      if (
        request.topic.toLowerCase().includes('python') ||
        request.topic.toLowerCase().includes('code') ||
        request.topic.toLowerCase().includes('programming') ||
        request.topic.toLowerCase().includes('machine learning') ||
        moduleIndex % 2 === 0
      ) {
        blocks.push({
          id: generateId(),
          type: 'code',
          content: `# Example: ${request.topic}\ndef demonstrate_concept(data):\n    \"\"\"\n    This function shows how the concept works\n    in practice with real data.\n    \"\"\"\n    result = process(data)\n    return analyze(result)\n\n# Run the demonstration\noutput = demonstrate_concept(sample_data)\nprint(f"Result: {output}")`,
          meta: { language: 'python' },
        });
      }

      /* Add a math block for science/math topics */
      if (
        request.topic.toLowerCase().includes('physics') ||
        request.topic.toLowerCase().includes('math') ||
        request.topic.toLowerCase().includes('quantum') ||
        pageIndex === 1
      ) {
        blocks.push({
          id: generateId(),
          type: 'math',
          content: 'E = mc^2 \\quad \\text{where } m \\text{ is mass and } c \\text{ is the speed of light}',
        });
      }

      /* Add closing text */
      blocks.push({
        id: generateId(),
        type: 'text',
        content: `Understanding this concept is crucial because it forms the foundation for everything that follows. Take a moment to review the key points before moving on.`,
      });

      return {
        id: generateId(),
        title: getMockPageTitle(request.topic, moduleIndex, pageIndex),
        blocks,
        estimatedMinutes: request.mode === 'quick' ? 3 : request.mode === 'simplified' ? 5 : 7,
      };
    });

    return {
      id: generateId(),
      title: getMockModuleTitle(request.topic, moduleIndex),
      description: `Explore the ${getOrdinal(moduleIndex + 1)} major area of ${request.topic.toLowerCase()}.`,
      pages,
      estimatedMinutes: pages.reduce((sum, p) => sum + p.estimatedMinutes, 0),
      contentTypes: ['text', 'bullet_list', 'code'],
      hasQuiz: request.mode === 'beginner' || (request.mode === 'simplified' && moduleIndex % 2 === 0),
    };
  });

  const totalPages = modules.reduce((sum, m) => sum + m.pages.length, 0);
  const totalMinutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);

  const course: Course = {
    id: courseId,
    topic: request.topic,
    title: `Mastering ${request.topic}`,
    description: `A comprehensive ${request.mode} course on ${request.topic}, tailored to your learning style.`,
    mode: request.mode,
    status: 'ready',
    modules,
    totalEstimatedMinutes: totalMinutes,
    totalPages,
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    completedPages: 0,
    xpEarned: 0,
  };

  return { success: true, course };
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

export const MOCK_LEADERBOARD = [
  { userId: '1', displayName: 'Kai Nakamura', weeklyXP: 2847, rank: 1, isCurrentUser: false },
  { userId: '2', displayName: 'Priya Sharma', weeklyXP: 2651, rank: 2, isCurrentUser: false },
  { userId: '3', displayName: 'Mateo Rivera', weeklyXP: 2298, rank: 3, isCurrentUser: false },
  { userId: '4', displayName: 'Zara Okonkwo', weeklyXP: 1975, rank: 4, isCurrentUser: false },
  { userId: '5', displayName: 'Lena Petrov', weeklyXP: 1843, rank: 5, isCurrentUser: false },
  { userId: '6', displayName: 'Amir Hassan', weeklyXP: 1712, rank: 6, isCurrentUser: false },
  { userId: '7', displayName: 'Yuki Tanaka', weeklyXP: 1598, rank: 7, isCurrentUser: false },
  { userId: '8', displayName: 'Nia Williams', weeklyXP: 1456, rank: 8, isCurrentUser: false },
  { userId: '9', displayName: 'Oscar Lindqvist', weeklyXP: 1324, rank: 9, isCurrentUser: false },
  { userId: '10', displayName: 'Fatima Al-Rashid', weeklyXP: 1189, rank: 10, isCurrentUser: false },
];
