import 'dotenv/config'
import { z } from 'zod'

/**
 * Validates environment variables once at boot so the server fails fast with a
 * clear message instead of crashing later with an undefined secret or database
 * URI. Secrets stay in `.env` (git-ignored) and are never logged.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n')

  console.error(
    `Invalid environment configuration. Copy app/server/.env.example to app/server/.env and fill in the missing values.\n${details}`,
  )
  process.exit(1)
}

export const env = parsed.data
