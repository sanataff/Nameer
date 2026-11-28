import { compare, hash } from 'bcryptjs'
import { env } from '../config/env.js'

export function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, env.BCRYPT_ROUNDS)
}

export function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  return compare(plainPassword, passwordHash)
}
