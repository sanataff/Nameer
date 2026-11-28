import { Router } from 'express'

/**
 * Health check. Mounted at /api/v1/health.
 *
 * This route exists to prove the whole middleware pipeline works before any
 * real feature is added: request id, JSON parsing, routing, notFound, and
 * errorHandler. Later it can also report database readiness.
 */
export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})
