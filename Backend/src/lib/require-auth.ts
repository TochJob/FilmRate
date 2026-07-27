import { eq } from 'drizzle-orm'
import { validateSession } from './session.js'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'

import type { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    currentUser: {
      id: number
      email: string
      username: string
    } | null
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  const session = await validateSession(sessionId)

  if (!session) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: { id: true, email: true, username: true },
  })

  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  request.currentUser = user
}
