/* ============================================================
   API Utility
   
   Centralized fetch wrapper for n8n webhook API calls.
   Handles loading, error, and timeout states.
   All course generation calls go through this module.
   ============================================================ */

import type { LearningMode } from "@/types";

const API_TIMEOUT_MS = 30000; // 30 second timeout

/** Request body for course generation */
interface GenerateCourseRequest {
  topic: string;
  mode: LearningMode;
  userId: string;
}

/** Generic API response wrapper */
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isTimeout: boolean;
}

/**
 * Get the n8n webhook URL from environment.
 * Falls back to empty string if not configured.
 */
function getWebhookUrl(): string {
  return process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "";
}

/**
 * Generate a course by calling the n8n webhook.
 * 
 * @param request - The course generation request body
 * @returns ApiResponse with course data or error
 * 
 * Timeout handling: if no response in 30s, returns a timeout error.
 * The caller (chat page) should show a "taking longer than usual" message.
 */
export async function generateCourse<T>(
  request: GenerateCourseRequest
): Promise<ApiResponse<T>> {
  const url = getWebhookUrl();

  if (!url) {
    return {
      data: null,
      error: "Course generation service is not configured. Please set NEXT_PUBLIC_N8N_WEBHOOK_URL.",
      isTimeout: false,
    };
  }

  /* AbortController for timeout handling */
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        data: null,
        error: `Course generation failed (${response.status}). Please try again.`,
        isTimeout: false,
      };
    }

    const data = (await response.json()) as T;
    return { data, error: null, isTimeout: false };
  } catch (err) {
    clearTimeout(timeoutId);

    /* Check if the error was caused by our timeout abort */
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        data: null,
        error: "Course generation is taking longer than usual. Please try again.",
        isTimeout: true,
      };
    }

    return {
      data: null,
      error: "Failed to connect to the course generation service. Please check your connection.",
      isTimeout: false,
    };
  }
}
