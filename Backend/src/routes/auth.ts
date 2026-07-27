import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import argon2 from 'argon2'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { createSession, destroySession } from '../lib/session.js'
import { requireAuth } from '../lib/require-auth.js'
import { eq } from 'drizzle-orm'

const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(128),
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid request body' })
    }
    const { email, username, password } = parsed.data

    const hashedPassword = await argon2.hash(password)

    try {
      const [user] = await db
        .insert(users)
        .values({ email, username, passwordHash: hashedPassword })
        .returning({ id: users.id, email: users.email, username: users.username })

      return reply.status(201).send({ user })
    } catch (e) {
      const code =
        e instanceof Error && 'code' in e ? ((e as any).code ?? (e.cause as any)?.code) : undefined

      if (code === '23505') {
        return reply.status(409).send({
          error: 'User with this email or username already exists',
        })
      }
      throw e
    }
  })
  app.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid request body' })
    }

    const { email, password } = parsed.data

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    const session = await createSession(user.id)

    reply.setCookie('sessionId', session.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: session.expiresAt,
    })

    return { user: { id: user.id, email: user.email, username: user.username } }
  })
  app.post('/auth/logout', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(400).send({ error: 'No session found' })
    }

    await destroySession(sessionId)

    reply.clearCookie('sessionId', {
      path: '/',
    })

    return { ok: true }
  })
  app.get('/auth/me', { preHandler: requireAuth }, async (request, reply) => {
    return { user: request.currentUser }
  })
}
