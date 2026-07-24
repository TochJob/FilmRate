import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { sessions } from '../db/schema.js'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export async function createSession(userId: number) {
  const id = randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await db.insert(sessions).values({
    id,
    userId,
    expiresAt,
  })

  return { id, expiresAt }
}

export async function validateSession(sessionId: string) {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  })

  if (!session) return null

  if (session.expiresAt < new Date()) {
    await destroySession(sessionId)
    return null
  }

  return session
}

export async function destroySession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId))
}
