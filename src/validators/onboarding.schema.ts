import { z } from 'zod';

export const onboardingSchema = z.object({
  displayname: z.string().min(2, 'Display name must be at least 2 characters').trim(),
  interests: z.array(z.string()).max(5, 'You can select up to 5 interests'),
  dailyGoal: z.number().min(1, 'Daily goal must be at least 1 minute'),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
