import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db/index.js'
import { ratings } from '../db/schema.js'
import { requireAuth } from '../lib/require-auth.js'

const paramsSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
})

const bodySchema = z.object({
  score: z.number().int().min(1).max(10),
})

export async function ratingRoutes(app: FastifyInstance) {
  app.put('/mobies/:tmdbId/rating', { preHandler: requireAuth }, async (request, reply) => {
    const params = paramsSchema.safeParse(request.params)
    const body = bodySchema.safeParse(request.body)

    if (!params.success || !body.success) {
      return reply.status(400).send({ error: 'Invalid input' })
    }

    const [rating] = await db
      .insert(ratings)
      .values({
        userId: request.currentUser!.id,
        tmdbId: params.data.tmdbId,
        score: body.data.score,
      })
      .onConflictDoUpdate({
        target: [ratings.userId, ratings.tmdbId],
        set: { score: body.data.score, updatedAt: new Date() },
      })
      .returning()

    return rating
  })

  app.delete('/movies/:tmdbId/rating', { preHandler: requireAuth }, async (request, reply) => {
    const params = paramsSchema.safeParse(request.params)
    if (!params.success) {
      return reply.status(400).send({ error: 'Invalid movie id' })
    }

    const deleted = await db
      .delete(ratings)
      .where(
        and(eq(ratings.userId, request.currentUser!.id), eq(ratings.tmdbId, params.data.tmdbId)),
      )
      .returning()

    if (deleted.length === 0) {
      return reply.status(404).send({ error: 'Rating not found' })
    }

    return { ok: true }
  })

  app.get('/users/me/ratings', { preHandler: requireAuth }, async (request) => {
    const myRatings = await db
      .select()
      .from(ratings)
      .where(eq(ratings.userId, request.currentUser!.id))
      .orderBy(desc(ratings.updatedAt))

    return { ratings: myRatings }
  })
}
