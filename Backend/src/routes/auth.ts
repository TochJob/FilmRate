import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import argon2 from 'argon2'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'

const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(128),
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
}
