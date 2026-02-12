import PrismaClient from "@prisma/client";

export const getDashboardData = async (userId: string) => {
  const data = await getDashboardDataForUser(userId);
  if (!data) {
    return { success: false, error: "Invalid user" };
  }

  return { success: true, data };
};
