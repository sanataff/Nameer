/**
 * Error type that carries the HTTP status and a stable machine-readable code.
 * Throwing this from services keeps controllers free of status-code decisions.
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static badRequest(message: string, code = 'BAD_REQUEST', details?: unknown) {
    return new ApiError(400, code, message, details)
  }

  static unauthorized(message = 'Authentication required', code = 'UNAUTHORIZED') {
    return new ApiError(401, code, message)
  }

  static forbidden(message = 'You do not have permission to perform this action', code = 'FORBIDDEN') {
    return new ApiError(403, code, message)
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, code, message)
  }

  static conflict(message: string, code = 'CONFLICT') {
    return new ApiError(409, code, message)
  }
}
