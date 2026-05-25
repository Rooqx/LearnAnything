import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/auth-helpers';
import { successResponse, errorResponse } from '@/lib/http/api-response';
import { AppError } from '@/lib/errors';
import { chatSessionService } from '@/services/chatSession.service';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const userId = session.user.id;

    const result = await chatSessionService.getOrCreateActiveSession(userId);

    return successResponse({
      sessionId: result.session.id,
      status: result.session.status,
      isExisting: result.isExisting,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
