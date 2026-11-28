import type { RequestHandler } from 'express'
import { randomUUID } from 'crypto'

const SAFE = /^[A-Za-z0-9_-]{1,64}$/
export const requestId: RequestHandler = (req, res, next) => {
  const incomingId = req.header('x-request-id')
  const id = incomingId && !SAFE.test(incomingId) ? incomingId : randomUUID()
  req.id = id
  res.setHeader('X-Request-Id', id)
  next()
}
