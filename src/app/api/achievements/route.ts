import { NextRequest } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireAuth } from "@/lib/auth/auth-helpers"
import { successResponse, errorResponse } from "@/lib/http/api-response"
import { AppError } from "@/lib/errors"

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth()
    
    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const userId = session.user.id

    // Fetch all static badges
    const allBadges = await prisma.badge.findMany()

    // Fetch user's earned badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: userId },
    })

    // Create a Set of earned badge IDs for fast lookup
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId))

    // Map Prisma Badge to frontend Badge type
    const mappedBadges = allBadges.map(badge => {
      // Determine rarity based on some logic, or use static mapping
      // Since Badge table doesn't have rarity, we infer it or default to common
      const rarity = badge.conditionKey.includes('legendary') ? 'legendary' 
                   : badge.conditionKey.includes('epic') ? 'epic'
                   : badge.conditionKey.includes('rare') ? 'rare' 
                   : 'common';

      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        condition: badge.condition,
        rarity: rarity as "common" | "rare" | "epic" | "legendary",
        earned: earnedBadgeIds.has(badge.id)
      }
    })

    return successResponse({ badges: mappedBadges })
  } catch (error) {
    return errorResponse(error)
  }
}
