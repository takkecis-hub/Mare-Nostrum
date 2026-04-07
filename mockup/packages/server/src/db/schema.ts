import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: varchar('status', { length: 32 }).notNull().default('active'),
  currentTurn: integer('current_turn').notNull().default(1),
  season: varchar('season', { length: 16 }).notNull().default('yaz'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const players = pgTable('players', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull(),
  displayName: varchar('display_name', { length: 128 }).notNull(),
  currentPortId: varchar('current_port_id', { length: 64 }).notNull(),
  gold: integer('gold').notNull().default(200),
  shipState: jsonb('ship_state').notNull(),
  cargo: jsonb('cargo').notNull(),
});

export const rumors = pgTable('rumors', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull(),
  aboutPlayerId: uuid('about_player_id').notNull(),
  tone: varchar('tone', { length: 16 }).notNull(),
  text: text('text').notNull(),
  currentPorts: jsonb('current_ports').notNull(),
  strength: integer('strength').notNull().default(100),
  age: integer('age').notNull().default(0),
});
