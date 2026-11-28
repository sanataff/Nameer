import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { apiRouter } from './routes.js'
import { requestId } from './middleware/request-id.js'
import { errorHandler, notFound } from './middleware/error-handler.js'

/**
 * Builds the Express app: global middleware, routes, then 404 + errors.
 * This file does NOT listen on a port and does NOT connect to MongoDB.
 */
export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(requestId)
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use('/api', apiRouter)
app.use(notFound)
app.use(errorHandler)
