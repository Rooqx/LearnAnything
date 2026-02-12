import { apiClient } from "@/src/lib/axios_client";
import { ActionResponse } from "@/src/types/response";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      // ⚠️ CRITICAL: Server Actions usually return { success: false } instead of throwing.
      // We must check this manually so React Query knows it failed.
      const response = (await apiClient.get(
        "/accounts/dashboard",
      )) as ActionResponse;

      if (!response?.success) {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }

      return response.data;
    },
  });
};
