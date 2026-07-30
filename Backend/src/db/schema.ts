import { pgTable, serial, text, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const ratings = pgTable(
  'ratings',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tmdbId: integer('tmdb_id').notNull(),
    score: integer('score').notNull(),
    createdAt: timestamp('create_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('update_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('ratings_user_movie_idx').on(table.userId, table.tmdbId)],
)
