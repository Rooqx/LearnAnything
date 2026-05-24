import { prisma } from '@/lib/db/prisma'
import bcryptjs from 'bcryptjs'
import { ValidationError } from '@/lib/errors'
import type { SignUpInput } from '@/validators/auth.schema'

/**
 * Service for handling User related business logic.
 */
export const userService = {
  /**
   * Creates a new user with a hashed password.
   * Checks if the email is already in use before creation.
   * 
   * @param input - Validated sign-up input (name, email, password)
   * @returns The newly created user
   * @throws ValidationError if the email is already registered
   */
  async createUser(input: SignUpInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      throw new ValidationError('Email is already registered')
    }

    const hashedPassword = await bcryptjs.hash(input.password, 12)

    const user = await prisma.user.create({
      data: {
        email: input.email,
        firstname: input.firstname,
        lastname: input.lastname,
        password: hashedPassword,
      },
    })

    return user
  },
}
