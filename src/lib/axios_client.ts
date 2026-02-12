import axios from "axios";

// Create the instance
export const apiClient = axios.create({
  baseURL: "/api/proxy", //  routinge requests through a Next.js proxy optional but cleaner
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("repsonse", response);
    return response;
  },
  async (error) => {
    console.log("error", error);
    const originalRequest = error.config;

    // Check if Error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //  Call the Next.js Route Handler to refresh the session
        await axios.post("/api/auth/refresh");

        //  Retry the original request
        // The browser has the new cookie now, so this request will pass
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 3. If refresh fails, the session is dead. Log them out.
        console.error("Session expired:", refreshError);
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
