import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.js'
import { config } from '../config.js'

const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
})

export const db = drizzle(pool, { schema })