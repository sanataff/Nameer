import { app } from './app.js'
import { connectDB, disconnectDB } from './config/db.js'
import { env } from './config/env.js'

/**
 * Process entry point. Connects to MongoDB, starts the HTTP server, and shuts
 * both down cleanly on SIGINT / SIGTERM.
 */
try {
  await connectDB(env.MONGODB_URI)
} catch (error) {
  console.error('[server] failed to connect to MongoDB', error)
  process.exit(1)
}

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`)
})

server.on('error', (error) => {
  console.error('[server] HTTP server error', error)
  process.exit(1)
})

let shuttingDown = false

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return
  shuttingDown = true

  console.log(`[server] ${signal} received, shutting down`)

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })

    await disconnectDB()
    process.exit(0)
  } catch (error) {
    console.error('[server] shutdown failed', error)
    process.exit(1)
  }
}

process.once('SIGINT', () => {
  void shutdown('SIGINT')
})

process.once('SIGTERM', () => {
  void shutdown('SIGTERM')
})
