export const getUserProfile = async (userId: string) => {
  const userProfile = await getUserProfileForUser(userId);
  if (!userProfile) {
    return { success: false, error: "Invalid user" };
  }

  return { success: true, data: userProfile };
};
