import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { onboardingSchema } from "@/validators/onboarding.schema"
import { AppError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { z } from "zod"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const userId = session.user.id

    // 2. Parse and validate payload
    const body = await req.json()
    const parsedData = onboardingSchema.parse(body)

    // 3. Update User profile with displayname and interests
    await prisma.user.update({
      where: { id: userId },
      data: {
        displayname: parsedData.displayname,
        interests: parsedData.interests,
      },
    })

    // 4. Upsert DailyGoal for the user
    await prisma.dailyGoal.upsert({
      where: { userId: userId },
      update: {
        targetMinutes: parsedData.dailyGoal,
      },
      create: {
        userId: userId,
        targetMinutes: parsedData.dailyGoal,
        progressMinutes: 0,
      },
    })

    // 5. Set a cookie so middleware knows onboarding is complete before JWT refreshes
    const cookieStore = await cookies()
    cookieStore.set(`onboarding_${userId}`, 'true', { path: '/' })

    return successResponse({ message: "Onboarding completed successfully" })
  } catch (error) {
    return errorResponse(error)
  }
}

