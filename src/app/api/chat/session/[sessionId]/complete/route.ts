import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/auth-helpers';
import { successResponse, errorResponse } from '@/lib/http/api-response';
import { AppError } from '@/lib/errors';
import { chatSessionService } from '@/services/chatSession.service';
import { courseService } from '@/services/course.service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const userId = session.user.id;
    const { sessionId } = params;

    // 1. Get the session (this also implicitly verifies ownership if properly enforced, but we do explicit check)
    const chatSession = await chatSessionService.getSession(sessionId);

    if (chatSession.userId !== userId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    // 2. Resolve the generated course from DB using session's creation time
    const courseId = await courseService.resolveGeneratedCourse(
      userId,
      chatSession.createdAt
    );

    // 3. Enroll the user in the generated course
    await courseService.enrollUser(userId, courseId);

    // 4. Link the course to the ChatSession and mark it completed
    await chatSessionService.linkCourse(sessionId, courseId);

    return successResponse({ courseId });
  } catch (error) {
    return errorResponse(error);
  }
}
