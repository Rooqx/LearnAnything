export const CHAT_SESSION_STATUS = {
  ACTIVE: 'active',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type ChatSessionStatus = typeof CHAT_SESSION_STATUS[keyof typeof CHAT_SESSION_STATUS];

export const N8N_SIGNALS = {
  COURSE_GENERATION_STARTING: 'course_generation_starting'
} as const;
