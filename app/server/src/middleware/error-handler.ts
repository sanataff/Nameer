import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../lib/ApiError.js'

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  )
}

/**
 * Runs when no route matched the request. It creates an ApiError and forwards
 * it, so unknown URLs use the same JSON error shape as everything else.
 */
export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} was not found`))
}

/**
 * Must be registered last. Every error leaves the API in the same shape so the
 * frontend can handle failures generically, and stack traces never reach
 * production responses.
 */
export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = req.id || 'unknown'

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId,
      },
    })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
        requestId,
      },
    })
    return
  }

  if (isDuplicateKeyError(error)) {
    res.status(409).json({
      error: {
        code: 'DUPLICATE_RESOURCE',
        message: 'A record with these values already exists',
        requestId,
      },
    })
    return
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body is not valid JSON',
        requestId,
      },
    })
    return
  }

  console.error(`[error] ${req.method} ${req.originalUrl} (request ${requestId})`, error)

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Unexpected server error',
      requestId,
    },
  })
}
