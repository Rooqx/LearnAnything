import { prisma } from '@/lib/db/prisma';
import { AppError } from '@/lib/errors';
import { sendMessageToN8n } from '@/lib/n8n';
import { CHAT_SESSION_STATUS, N8N_SIGNALS } from '@/constants/chat';
import { creditService } from '@/services/credit.service';

export const chatSessionService = {
  /**
   * Gets or creates an active session for the user.
   * If the user already has an 'active' or 'generating' session, it returns it.
   * Otherwise, it creates a new 'active' session.
   */
  async getOrCreateActiveSession(userId: string) {
    const existingSession = await this.getActiveSession(userId);

    if (existingSession) {
      return { session: existingSession, isExisting: true };
    }

    const newSession = await prisma.chatSession.create({
      data: {
        userId,
        status: CHAT_SESSION_STATUS.ACTIVE,
      },
    });

    return { session: newSession, isExisting: false };
  },

  /**
   * Retrieves the current 'active' or 'generating' session for the user.
   */
  async getActiveSession(userId: string) {
    return prisma.chatSession.findFirst({
      where: {
        userId,
        status: {
          in: [CHAT_SESSION_STATUS.ACTIVE, CHAT_SESSION_STATUS.GENERATING],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Gets a specific session by ID.
   */
  async getSession(sessionId: string) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new AppError('Session not found', 404, 'NOT_FOUND');
    }
    return session;
  },

  /**
   * Forwards a message to n8n. If n8n returns the specific starting signal,
   * it updates the session status to 'generating'.
   */
  async sendMessage(userId: string, sessionId: string, message: string, teachingStyle?: string) {
    const session = await this.getSession(sessionId);

    // Strict ownership check
    if (session.userId !== userId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }
   
    if (session.status !== CHAT_SESSION_STATUS.ACTIVE) {
      throw new AppError(
        `Cannot send message. Session status is ${session.status}`,
        400,
        'INVALID_STATE'
      );
    }

    // Pre-check credits before hitting n8n
    const availableCredits = await creditService.getAvailableCredits(userId);
    if (availableCredits < 2) {
      throw new AppError('Insufficient credits to generate a course', 402, 'INSUFFICIENT_CREDITS');
    }

    const n8nResponse = await sendMessageToN8n({
      session_id : sessionId,
      message_to_ai : message,
      user_id : userId,
      ...(teachingStyle ? { teaching_style: teachingStyle } : {}),
    });

    // Unwrap: if n8n returns an array, take the first item
    let rawData: any = n8nResponse;
    if (Array.isArray(n8nResponse)) {
      rawData = n8nResponse[0];
    }

    // Normalize to a standard { message, quickReplies? } shape
    let responseObj: { message?: string; status?: string; quickReplies?: string[] } = {};

    if (typeof rawData === 'string') {
      responseObj = { message: rawData };
    } else if (rawData && typeof rawData === 'object') {
      // Map n8n field names to our standard fields
      const messageText =
        rawData.message_to_user ||
        rawData.message ||
        rawData.output ||
        rawData.text ||
        rawData.response ||
        '';

      // Parse quick_replies: comma-separated string → array
      let quickReplies: string[] | undefined;
      if (rawData.quick_replies) {
        if (typeof rawData.quick_replies === 'string') {
          quickReplies = rawData.quick_replies.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else if (Array.isArray(rawData.quick_replies)) {
          quickReplies = rawData.quick_replies;
        }
      }

      responseObj = {
        message: messageText,
        ...(quickReplies && quickReplies.length > 0 ? { quickReplies } : {}),
      };
    }

    console.log('[sendMessage] normalized:', JSON.stringify(responseObj, null, 2));

    if (responseObj?.message === N8N_SIGNALS.COURSE_GENERATION_STARTING) {
      // Deduct 2 credits since generation is starting
      await creditService.deductCredits(userId, 2, 'Course generation', sessionId);

      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { status: CHAT_SESSION_STATUS.GENERATING },
      });
      return { status: CHAT_SESSION_STATUS.GENERATING };
    }
    return responseObj;
  },

  /**
   * Marks a session as completed and links the generated course.
   */
  async linkCourse(sessionId: string, courseId: string) {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        status: CHAT_SESSION_STATUS.COMPLETED,
        courseId,
      },
    });
  },

  /**
   * Cancels an ongoing session, marking it as failed.
   */
  async cancelSession(sessionId: string, userId: string) {
    const session = await this.getSession(sessionId);

    if (session.userId !== userId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: CHAT_SESSION_STATUS.FAILED },
    });
  },
};
