import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { AppError } from "@/lib/errors"
import { courseService } from "@/services/course.service"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    // In Next.js 15+, dynamic route params must be awaited
    const { courseId } = await params;

    const userId = session.user.id

    const course = await courseService.getCourseByEnrollment(userId, courseId)

    return successResponse({ course })
  } catch (error) {
    return errorResponse(error)
  }
}
