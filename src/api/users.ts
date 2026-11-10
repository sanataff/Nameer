/**
 * Local mock API for administrator user management.
 * Registration records are stored in this browser until a backend is available.
 *
 * // MOCK DATA: seeded users are fictional examples, not real accounts.
 */

export type UserRole = 'supplier' | 'cafe'
export type UserStatus = 'active' | 'unverified' | 'rejected' | 'banned'

export interface LocalizedName {
  en: string
  ar: string
}

export interface ManagedUser {
  id: string
  name: LocalizedName
  email: string
  phone: string
  role: UserRole
  joinedAt: string
  status: UserStatus
}

export interface UserUpdate {
  name: LocalizedName
  email: string
  phone: string
  role: UserRole
}

export interface UserRegistration {
  name: string
  email: string
  phone: string
  role: UserRole
}

export const USERS_STORAGE_KEY = 'nameer:admin-users:v1'

const SEED_USERS: ManagedUser[] = [
  {
    id: 'u-1001',
    name: { en: 'Layla Bakery', ar: 'مخبز ليلى' },
    email: 'layla@example.com',
    phone: '+966 59 987 2474',
    role: 'supplier',
    joinedAt: '2026-10-09T08:30:00.000Z',
    status: 'active',
  },
  {
    id: 'u-1002',
    name: { en: 'Mona Kitchen', ar: 'مطبخ منى' },
    email: 'mona@example.com',
    phone: '+966 59 944 5474',
    role: 'supplier',
    joinedAt: '2026-10-09T09:10:00.000Z',
    status: 'banned',
  },
  {
    id: 'u-1003',
    name: { en: 'OWL Cafe', ar: 'مقهى OWL' },
    email: 'owl@example.com',
    phone: '+966 55 201 3344',
    role: 'cafe',
    joinedAt: '2026-10-09T10:20:00.000Z',
    status: 'active',
  },
  {
    id: 'u-1004',
    name: { en: 'Hayat Cafe', ar: 'مقهى الحياة' },
    email: 'hayat@example.com',
    phone: '+966 59 987 2474',
    role: 'cafe',
    joinedAt: '2026-10-09T11:40:00.000Z',
    status: 'unverified',
  },
  {
    id: 'u-1005',
    name: { en: 'Layla Pastries', ar: 'حلويات ليلى' },
    email: 'pastries@example.com',
    phone: '+966 54 321 6754',
    role: 'supplier',
    joinedAt: '2026-10-10T07:15:00.000Z',
    status: 'active',
  },
]

export class UserEmailAlreadyExistsError extends Error {
  constructor() {
    super('A user with this email address already exists.')
    this.name = 'UserEmailAlreadyExistsError'
  }
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function isLocalizedName(value: unknown): value is LocalizedName {
  return (
    typeof value === 'object' &&
    value !== null &&
    'en' in value &&
    typeof value.en === 'string' &&
    'ar' in value &&
    typeof value.ar === 'string'
  )
}

function isManagedUser(value: unknown): value is ManagedUser {
  if (typeof value !== 'object' || value === null) return false
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    isLocalizedName(value.name) &&
    'email' in value &&
    typeof value.email === 'string' &&
    'phone' in value &&
    typeof value.phone === 'string' &&
    'role' in value &&
    (value.role === 'supplier' || value.role === 'cafe') &&
    'joinedAt' in value &&
    typeof value.joinedAt === 'string' &&
    'status' in value &&
    (value.status === 'active' ||
      value.status === 'unverified' ||
      value.status === 'rejected' ||
      value.status === 'banned')
  )
}

function cloneUsers(users: ManagedUser[]): ManagedUser[] {
  return users.map((user) => ({ ...user, name: { ...user.name } }))
}

function readStoredUsers(): ManagedUser[] {
  const stored = window.localStorage.getItem(USERS_STORAGE_KEY)
  if (!stored) return cloneUsers(SEED_USERS)

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isManagedUser)) {
    throw new Error('Stored administrator users are invalid.')
  }
  return cloneUsers(parsed)
}

function writeStoredUsers(users: ManagedUser[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function assertUniqueEmail(email: string, exceptId?: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const duplicate = readStoredUsers().some(
    (user) =>
      user.id !== exceptId && user.email.toLowerCase() === normalizedEmail,
  )
  if (duplicate) throw new UserEmailAlreadyExistsError()
}

export async function listUsers(): Promise<ManagedUser[]> {
  await delay(250)
  return readStoredUsers()
}

export async function createRegisteredUser(
  registration: UserRegistration,
): Promise<ManagedUser> {
  await delay(200)
  assertUniqueEmail(registration.email)

  const name = registration.name.trim()
  const user: ManagedUser = {
    ...registration,
    id: `u-${Date.now().toString(36)}`,
    name: { en: name, ar: name },
    email: registration.email.trim(),
    phone: registration.phone.trim(),
    joinedAt: new Date().toISOString(),
    status: 'unverified',
  }
  writeStoredUsers([user, ...readStoredUsers()])
  return { ...user, name: { ...user.name } }
}

export async function updateUser(
  id: string,
  update: UserUpdate,
): Promise<ManagedUser> {
  await delay(200)
  assertUniqueEmail(update.email, id)

  const users = readStoredUsers()
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) throw new Error(`Unknown user: ${id}`)

  const updated: ManagedUser = {
    ...users[index],
    ...update,
    email: update.email.trim(),
    phone: update.phone.trim(),
  }
  users[index] = updated
  writeStoredUsers(users)
  return { ...updated, name: { ...updated.name } }
}

export async function setUserStatus(
  id: string,
  status: UserStatus,
): Promise<ManagedUser> {
  await delay(200)
  const users = readStoredUsers()
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) throw new Error(`Unknown user: ${id}`)

  const updated = { ...users[index], status }
  users[index] = updated
  writeStoredUsers(users)
  return { ...updated, name: { ...updated.name } }
}
