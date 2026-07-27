import fastify from 'fastify'
import { authRoutes } from './routes/auth.js'
import { movieRoutes } from './routes/movie.js'
import fastifyCookie from '@fastify/cookie'

export async function buildApp() {
  const app = fastify({ logger: true })
  await app.register(fastifyCookie)
  app.decorateRequest('currentUser', null)

  await app.register(authRoutes)
  await app.register(movieRoutes)
  
  app.get('/helth', async (request, reply) => {
    return { status: 'ok' }
  })

  return app
}
