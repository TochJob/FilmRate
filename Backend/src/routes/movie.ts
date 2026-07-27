import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { tmdbFetch } from '../lib/tmdb.js'

const searchQuerySchema = z.object({
  q: z.string().min(1),
  page: z.coerce.number().min(1).max(1000).default(1),
})

const movieParamsSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
})

export async function movieRoutes(app: FastifyInstance) {
  app.get('/movies/search', async (requst, reply) => {
    const parsed = searchQuerySchema.safeParse(requst.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Query parameter "q" is required' })
    }
    const { q, page } = parsed.data
    const data = await tmdbFetch('/search/movie', {
      query: q,
      page: String(page),
    })

    return data
  })

  app.get('/moviee/:tmbdId', async (requst, reply) => {
    const parsed = movieParamsSchema.safeParse(requst.params)

    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid movie id' })
    }

    const data = await tmdbFetch(`/movie/${parsed.data.tmdbId}`)
    return data
  })
}
