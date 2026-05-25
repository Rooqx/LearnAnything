"use server";

import { signOut } from "@/lib/auth/auth";

/**
 * Server action to securely log the user out and destroy their session.
 * It automatically clears the NextAuth cookies and redirects to the sign-in page.
 */
export async function logoutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
