import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/auth-helpers';
import { successResponse, errorResponse } from '@/lib/http/api-response';
import { AppError } from '@/lib/errors';
import { chatSessionService } from '@/services/chatSession.service';

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const userId = session.user.id;
    const { sessionId } = await props.params;

    await chatSessionService.cancelSession(sessionId, userId);

    return successResponse({ message: 'Session cancelled successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
