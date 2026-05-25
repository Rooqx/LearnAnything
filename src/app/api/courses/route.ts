import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { AppError } from "@/lib/errors"
import { courseService } from "@/services/course.service"

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const userId = session.user.id

    const courses = await courseService.getUserCourses(userId)

    return successResponse({ courses })
  } catch (error) {
    return errorResponse(error)
  }
}
