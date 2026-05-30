import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { AppError } from "@/lib/errors"
import { courseService } from "@/services/course.service"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const { courseId, chapterId } = await params;
    const userId = session.user.id

    // Extract optional moduleId from request body
    let moduleId;
    try {
      const body = await req.json();
      moduleId = body.moduleId;
    } catch (e) {
      // Ignore JSON parse error if body is empty
    }

    await courseService.markChapterComplete(userId, courseId, chapterId, moduleId)

    return successResponse({ success: true })
  } catch (error) {
    return errorResponse(error)
  }
}
