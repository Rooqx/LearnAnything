import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/auth-helpers';
import { successResponse, errorResponse } from '@/lib/http/api-response';
import { AppError } from '@/lib/errors';
import { chatSessionService } from '@/services/chatSession.service';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const userId = session.user.id;

    const activeSession = await chatSessionService.getActiveSession(userId);

    if (!activeSession) {
      return successResponse({ session: null });
    }

    return successResponse({
      session: {
        id: activeSession.id,
        status: activeSession.status,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
