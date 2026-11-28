import { Router } from 'express'
import { healthRouter } from './modules/health/health.routes.js'
// TODO: import the health router from './modules/health/health.routes.js'

/**
 * The single place where feature routers are mounted.
 *
 * app.ts will only do:
 *   app.use('/api', apiRouter)
 *
 * so this file controls the real public URLs. Adding a feature should mean
 * editing this file and nothing inside app.ts.
 *


 */
export const apiRouter = Router()

const v1 = Router()
v1.use('/health', healthRouter)
apiRouter.use('/v1',v1)

