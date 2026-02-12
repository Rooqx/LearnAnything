/*
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUser() {
  return useQuery({
    // Remember: This key MUST match the one you used in setQueryData from the useRegister hook
    queryKey: ["current-user"],

    // This function runs if the cache is empty (e.g. user refreshed the page)
    queryFn: async () => {
      /* const { data } = await axios.get("/api/auth/me"); // Replace with your actual fetch logic if needed
      return data;
      const data = null;
      return data;
    },
    // Optional: Don't re-fetch immediately if we just set the data manually
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
*/
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/axios_client"; // 👈 Import our custom client

/*
export type User = {
  id: string;
  email: string;
  name?: string;
};
*/
export function useUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      // Using proxy route
      const { data } = await apiClient.get("/auth/profile");

      console.log(data);
      return data;
    },
    // Don't retry immediately if 401, let the interceptor handle it
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}
