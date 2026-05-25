import { apiClient } from '@/lib/http/axios';
import { AppError } from '@/lib/errors';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

export interface ChatMessageRequest {
  sessionId: string;
  message: string;
  userId: string;
}

/**
 * Sends a chat message to n8n.
 * Returns the response from n8n (either an AI response or the generation signal).
 */
export async function sendMessageToN8n(request: ChatMessageRequest): Promise<any> {
  if (!N8N_WEBHOOK_URL) {
    throw new AppError('n8n webhook URL is not configured', 500, 'INTERNAL_ERROR');
  }

  try {
    const response = await apiClient.post(N8N_WEBHOOK_URL, request);
    return response.data;
  } catch (error) {
    if (error instanceof AppError && error.code === 'TIMEOUT') {
      throw new AppError('n8n request timed out', 504, 'N8N_TIMEOUT');
    }
    throw new AppError('Failed to communicate with AI service', 500, 'N8N_ERROR');
  }
}
