export const getBillings = async (userId: string) => {
  const billings = await getBillingsForUser(userId);
  if (!billings) {
    return { success: false, error: "Invalid user" };
  }

  return { success: true, data: billings };
};

export const createBilling = async (userId: string, planId: string) => {
  const newBilling = await createBillingForUser(userId, planId);
  if (!newBilling) {
    return { success: false, error: "Failed to create billing" };
  }

  return {
    success: true,
    message: `You have successfully subscribed to the ${newBilling.planName} plan.`,
  };
};
