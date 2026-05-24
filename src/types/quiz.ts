/* ============================================================
   Type Definitions — Quiz System
   Types for quizzes, questions, and answer tracking.
   ============================================================ */

/** Quiz state during an active quiz session */
export type QuizState = "idle" | "answering" | "revealed" | "completed";

/** A quiz associated with a course module */
export interface Quiz {
  moduleId: string;
  questions: QuizQuestion[];
  /** Index of the current question being answered */
  currentQuestionIndex: number;
  /** Track which questions were answered correctly */
  correctAnswers: number;
  /** Total questions in this quiz */
  totalQuestions: number;
  state: QuizState;
}

/** Individual quiz question */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** Index of the correct answer in the options array */
  correctIndex: number;
  /** Brief explanation shown after reveal */
  explanation: string;
}

/** Answer attempt for a single question */
export interface QuizAnswer {
  questionId: string;
  /** Index of the selected option */
  selectedIndex: number;
  /** Whether the answer was correct */
  isCorrect: boolean;
  /** XP earned for this answer (more for correct) */
  xpEarned: number;
}

/** Results summary shown after quiz completion */
export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  /** Percentage score 0-100 */
  score: number;
  totalXPEarned: number;
  answers: QuizAnswer[];
}
