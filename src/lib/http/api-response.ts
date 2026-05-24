import { NextResponse } from 'next/server'
import { AppError } from '@/lib/errors'
import { ZodError } from 'zod'

export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { message: string; code: string } }

/**
 * Returns a standardized success response.
 */
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

/**
 * Maps any error to a safe, standardized error response.
 */
export function errorResponse(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: { message: error.message, code: error.code } },
      { status: error.statusCode }
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: (error as any).errors[0]?.message ?? 'Validation failed',
          code: 'VALIDATION_ERROR',
        },
      },
      { status: 422 }
    )
  }

  console.error('[Unhandled Error]', error)
  return NextResponse.json(
    { success: false, error: { message: 'An unexpected error occurred', code: 'INTERNAL_ERROR' } },
    { status: 500 }
  )
}
