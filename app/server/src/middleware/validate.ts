import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'

/**
 * Validates the selected parts of a request with Zod, replaces them with the
 * parsed values, and then continues to the controller.
 *
 * Usage:
 *   router.post('/login', validate(loginSchema), login)
 *   where loginSchema looks like:
 *   { body: z.object({ email: z.string().email(), ... }) }
 */
export interface ValidationSchemas {
  body?: ZodType
  params?: ZodType
  query?: ZodType
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params
      }

      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query)

        // Express 5 defines req.query as a getter, so a direct assignment
        // throws. Redefining the property is the supported workaround.
        Object.defineProperty(req, 'query', {
          value: parsedQuery,
          writable: true,
          configurable: true,
          enumerable: true,
        })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
