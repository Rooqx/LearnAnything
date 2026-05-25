import axios from 'axios';
import { AppError } from '@/lib/errors';

/**
 * Centralized Axios instance for all backend requests.
 * Used primarily for external services like n8n and Paystack.
 */
export const apiClient = axios.create({
  timeout: 30000, // 30 seconds for n8n generation
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new AppError('Request timed out', 408, 'TIMEOUT');
      }
      const message = error.response?.data?.message || error.message || 'Request failed';
      throw new AppError(message, error.response?.status || 500, 'API_ERROR');
    }
    throw new AppError('An unexpected error occurred', 500, 'INTERNAL_ERROR');
  }
);
