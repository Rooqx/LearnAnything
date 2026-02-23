/**
 * THIS FILE IS JUS FOR TYPE SAFETY AND PREVENT APP FROM BREAKING LATER IF WE FOROT TO ADD ENV SHA
 * ALSO REMEMBERR TO ADD NEW ENV VARIABLES HERE THO
 */

import { z } from "zod";

const envSchema = z.object({
  // Server-side variables (Secret)
  //JWT_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 chars"),
  N8N_URL: z.string(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string(),
  // Client-side variables (Public  start with NEXT_PUBLIC_)
  // NEXT_PUBLIC_BACKEND_API_URL: z.string().optional(),
});

//console.log(process.env);
// Validate process.env
const _env = envSchema.safeParse(process.env);
console.log(_env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
