import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/http/api-response'
import { signUpSchema } from '@/validators/auth.schema'
import { userService } from '@/services/user.service'

/**
 * POST /api/auth/register
 * Registers a new user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = signUpSchema.parse(await request.json())
    const user = await userService.createUser(body)
    
    // Do not return the password in the response
    const { password, ...userWithoutPassword } = user

    return successResponse(userWithoutPassword, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
