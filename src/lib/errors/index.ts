/**
 * Base application error.
 * All custom errors extend this class.
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class AuthError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422, 'VALIDATION_ERROR')
  }
}

export class InsufficientCreditsError extends AppError {
  constructor() {
    super('Insufficient credits to generate this course', 402, 'INSUFFICIENT_CREDITS')
  }
}

export class NoAccessError extends AppError {
  constructor() {
    super('No active subscription or credits for this action', 403, 'NO_ACCESS')
  }
}

export class N8NError extends AppError {
  constructor(message = 'Course generation failed') {
    super(message, 502, 'N8N_ERROR')
  }
}

export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, 402, 'PAYMENT_ERROR')
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'A database error occurred') {
    super(message, 500, 'DATABASE_ERROR')
  }
}
