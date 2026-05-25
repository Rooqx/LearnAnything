/* ============================================================
   Quiz Types
   Defines quiz, question, and answer structures for the
   post-module quiz popups in the learning interface.
   ============================================================ */

/**
 * A single answer option in a quiz question.
 */
export interface QuizAnswer {
  /** Unique identifier for the answer */
  id: string;
  /** The answer text displayed to the user */
  text: string;
  /** Whether this is the correct answer */
  isCorrect: boolean;
}

/**
 * A quiz question with multiple choice answers.
 * Displayed in QuizPopup after module completion.
 */
export interface QuizQuestion {
  /** Unique identifier for the question */
  id: string;
  /** The question text — rendered in Space Grotesk 600 */
  question: string;
  /** Four answer options — exactly one must be correct */
  answers: QuizAnswer[];
  /** Explanation shown after answering (both correct and wrong) */
  explanation: string;
  /** XP reward for answering correctly */
  xpReward: number;
}

/**
 * A quiz associated with a module.
 * Frequency depends on learning mode:
 * - BEGINNER: after every module
 * - SIMPLIFIED: every 2–3 modules
 * - QUICK: optional prompt at course end only
 */
export interface Quiz {
  /** Unique quiz identifier */
  id: string;
  /** Module ID this quiz belongs to */
  moduleId: string;
  /** Ordered list of questions */
  questions: QuizQuestion[];
}

/**
 * Result of a completed quiz.
 * Used for XP calculation and progress tracking.
 */
export interface QuizResult {
  /** Quiz ID */
  quizId: string;
  /** Module ID */
  moduleId: string;
  /** Total questions in the quiz */
  totalQuestions: number;
  /** Number of correctly answered questions */
  correctAnswers: number;
  /** Total XP earned from the quiz */
  xpEarned: number;
  /** ISO timestamp of quiz completion */
  completedAt: string;
  /** Per-question results for review */
  questionResults: {
    questionId: string;
    selectedAnswerId: string;
    isCorrect: boolean;
  }[];
}
