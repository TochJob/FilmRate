import { buildApp } from './app.js'
import { config } from './config.js'

const app = await buildApp()

try {
  app.listen({ port: config.PORT })
} catch (e) {
  app.log.error(e)
  process.exit(1)
}
