// This file contains all the zod schemas used in the application
//Dont add 'use client' or use server it this file!!!
// Thhis for the auth
import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const sendEmailSchema = z.object({
  user_id: z.string().uuid("Invalid User ID"),
  email: z.string().email("Please enter a valid email"),
});

export type sendEmailInput = z.infer<typeof sendEmailSchema>;

//Account creaton
export const accountSetupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  type: z.enum(["individual", "organization", "school"]),
});
export type AccountSetupInput = z.infer<typeof accountSetupSchema>;
