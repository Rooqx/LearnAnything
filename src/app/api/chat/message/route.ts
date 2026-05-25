import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/auth-helpers';
import { successResponse, errorResponse } from '@/lib/http/api-response';
import { AppError } from '@/lib/errors';
import { chatSessionService } from '@/services/chatSession.service';

const messageSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const userId = session.user.id;
    const body = await req.json();
    const parsedData = messageSchema.parse(body);

    const result = await chatSessionService.sendMessage(
      userId,
      parsedData.sessionId,
      parsedData.message
    );

    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
