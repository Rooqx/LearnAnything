import { requireAuth } from '@/lib/auth/auth-helpers';
import { successResponse, errorResponse } from '@/lib/http/api-response';
import { AppError } from '@/lib/errors';
import { prisma } from '@/lib/db/prisma';
import { BADGE_DEFINITIONS, INITIAL_USER_DATA } from '@/lib/constants';
import { creditService } from '@/services/credit.service';

/**
 * GET /api/user/profile
 * Returns the current authenticated user's profile, hydrated from the database.
 * This is the single source of truth — used to populate useUserStore on app load
 * when localStorage is empty or stale.
 */
export async function GET() {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const userId = session.user.id;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        streak: true,
        dailyGoal: true,
        userBadges: { include: { badge: true } },
        creditBalance: true,
        xpTransactions: { select: { amount: true } },
      },
    });

    if (!dbUser) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Calculate XP from transactions
    const totalXP = dbUser.xpTransactions.reduce((sum: number, tx: {amount: number}) => sum + tx.amount, 0);
    const XP_PER_LEVEL = 500;
    const currentLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = totalXP % XP_PER_LEVEL;
    const xpToNextLevel = XP_PER_LEVEL - xpInCurrentLevel;

    // Count courses using Postgres COUNT
    const totalCoursesCompleted = await prisma.enrollment.count({ where: { userId, status: 'completed' } });
    const coursesInProgress = await prisma.enrollment.count({ where: { userId, status: 'in_progress' } });
    const totalCoursesCreated = await prisma.enrollment.count({ where: { userId } });

    // Build streak data
    const streakData = dbUser.streak
      ? {
          currentStreak: dbUser.streak.current,
          longestStreak: dbUser.streak.longest,
          lastActivityDate: dbUser.streak.lastUpdated.toISOString(),
          todayCompleted: false, // will be computed client-side
        }
      : INITIAL_USER_DATA.streak;

    // Build daily goal data
    const dailyGoalData = dbUser.dailyGoal
      ? {
          targetMinutes: dbUser.dailyGoal.targetMinutes as 10 | 20 | 30 | 60,
          completedMinutes: dbUser.dailyGoal.progressMinutes,
          isComplete: dbUser.dailyGoal.progressMinutes >= dbUser.dailyGoal.targetMinutes,
        }
      : INITIAL_USER_DATA.dailyGoal;

    // Build badges
    const earnedBadgeIds = new Set(dbUser.userBadges.map((ub: {badgeId: string}) => ub.badgeId));
    const badges = BADGE_DEFINITIONS.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: dbUser.userBadges.find((ub: {badgeId: string}) => ub.badgeId === badge.id)?.earnedAt?.toISOString() ?? null,
    }));

    // Build the full User object matching the frontend type
    const userProfile = {
      id: dbUser.id,
      displayName: dbUser.displayname || dbUser.name || 'Learner',
      email: dbUser.email || '',
      avatarUrl: dbUser.image || undefined,
      bio: dbUser.bio || undefined,
      interests: (dbUser.interests || []) as string[],
      credits: await creditService.getAvailableCredits(userId),
      xp: { totalXP, currentLevel, xpToNextLevel, xpInCurrentLevel },
      streak: streakData,
      dailyGoal: dailyGoalData,
      badges,
      totalCoursesCreated,
      totalCoursesCompleted,
      coursesInProgress,
      notifications: INITIAL_USER_DATA.notifications,
      defaultMode: INITIAL_USER_DATA.defaultMode,
      createdAt: dbUser.createdAt.toISOString(),
      onboardingComplete: !!(dbUser.displayname && dbUser.interests.length > 0),
    };

    return successResponse(userProfile);
  } catch (error) {
    return errorResponse(error);
  }
}
