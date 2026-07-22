import fastify from 'fastify'
import { authRoutes } from './routes/auth.js'
import fastifyCookie from '@fastify/cookie'

export async function buildApp() {
  const app = fastify({ logger: true })
  await app.register(fastifyCookie)

  await app.register(authRoutes)
  app.get('/helth', async (request, reply) => {
    return { status: 'ok' }
  })

  return app
}
