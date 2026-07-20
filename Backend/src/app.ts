import fastify from 'fastify'
import { authRoutes } from './routes/auth.js'

export async function buildApp() {
  const app = fastify({ logger: true })

  await app.register(authRoutes)
  app.get('/helth', async (request, reply) => {
    return { status: 'ok' }
  })

  return app
}
