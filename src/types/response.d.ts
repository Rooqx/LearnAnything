export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  errors?: Record<string, string[]>;
};
