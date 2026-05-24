import { auth } from './auth'
import { AuthError } from '@/lib/errors'
import { prisma } from '@/lib/db/prisma'

/**
 * Ensures the request is authenticated.
 * Call this at the very beginning of any protected Route Handler.
 * 
 * @returns The authenticated session
 * @throws AuthError if no session exists
 */
export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new AuthError('Unauthorized')
  }

  return session
}

/**
 * Retrieves the fully populated current user from the database.
 * 
 * @returns The current user object
 * @throws AuthError if no session or user exists
 */
export async function getCurrentUser() {
  const session = await requireAuth()

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  })

  if (!user) {
    throw new AuthError('User not found')
  }

  return user
}
