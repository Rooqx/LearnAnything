import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { AppError } from "@/lib/errors"
import { courseService } from "@/services/course.service"

const generateSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  mode: z.enum(["beginner", "simplified", "quick"]),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const userId = session.user.id
    const body = await req.json()
    const parsedData = generateSchema.parse(body)

    // TODO: Add credit check logic here once credit system is active
    
    // Call course service to handle deduplication, ChatSession creation, and generation
    const course = await courseService.resolveGeneratedCourse(
      userId,
      new Date(parsedData.topic),
    )

    return successResponse({ 
      message: "Course generated and saved successfully",
      course: course
    })
    
  } catch (error) {
    return errorResponse(error)
  }
}
