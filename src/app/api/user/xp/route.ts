import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { AppError } from "@/lib/errors"
import { userService } from "@/services/user.service"

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const body = await req.json()
    const { amount, reason, courseId } = body

    if (!amount || !reason) {
      throw new AppError("Missing required fields", 400, "BAD_REQUEST")
    }

    const userId = session.user.id

    const transaction = await userService.addXPTransaction(userId, amount, reason, courseId)

    return successResponse({ transaction })
  } catch (error) {
    return errorResponse(error)
  }
}
