import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { AppError } from "@/lib/errors"
import { courseService } from "@/services/course.service"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const { courseId } = await params;
    const userId = session.user.id

    await courseService.markCourseComplete(userId, courseId)

    return successResponse({ success: true })
  } catch (error) {
    return errorResponse(error)
  }
}
