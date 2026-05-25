/**
 * Prisma Client Singleton File
 *
 * WHAT THIS IS:
 * This file creates and exports a single, globally available instance of the PrismaClient.
 * It is the ONLY place in the entire codebase where `new PrismaClient()` should be called.
 *
 * WHY IT IS NEEDED:
 * In development, Next.js frequently clears the Node.js cache on hot-reloads.
 * If we instantiated a new PrismaClient in every file that needed it, Next.js would
 * create hundreds of new connections to the database on every save, quickly exhausting
 * the connection pool and crashing the app (or the database).
 *
 * HOW IT WORKS:
 * We attach the Prisma instance to the `globalThis` object (which persists across hot-reloads).
 * If `globalThis.prisma` already exists, we reuse it. If not, we create a new one.
 * In production, we just create a single instance since there's no hot-reloading.
 */
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure the adapter is only created once in development to prevent connection leaks
const createPrismaClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
