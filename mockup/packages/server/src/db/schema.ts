import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: varchar('status', { length: 20 }).notNull().default('lobby'),
  turn: integer('turn').notNull().default(0),
  season: varchar('season', { length: 10 }).notNull().default('yaz'),
  era: varchar('era', { length: 30 }).default('13th_century'),
  mode: varchar('mode', { length: 20 }).notNull().default('singleplayer'),
  maxPlayers: integer('max_players').default(1),
  maxTurns: integer('max_turns').default(30),
  fondacoTimer: integer('fondaco_timer').default(420),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
});

export const players = pgTable('players', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  userId: uuid('user_id'),
  name: varchar('name', { length: 100 }).notNull(),
  isNpc: boolean('is_npc').default(false),
  gold: integer('gold').notNull().default(200),
  shipType: varchar('ship_type', { length: 20 }).notNull().default('feluka'),
  shipStatus: varchar('ship_status', { length: 20 }).notNull().default('hazir'),
  currentPortId: varchar('current_port_id', { length: 50 }).notNull(),
  homePortId: varchar('home_port_id', { length: 50 }).notNull(),
  transitStatus: varchar('transit_status', { length: 20 }),
  transitDest: varchar('transit_dest', { length: 50 }),
  cargo: jsonb('cargo').notNull().default([]),
  renown: jsonb('renown').notNull().default([]),
  originStory: varchar('origin_story', { length: 50 }),
  questChain: varchar('quest_chain', { length: 50 }),
  questStage: integer('quest_stage').default(0),
  questBranch: varchar('quest_branch', { length: 50 }),
  questData: jsonb('quest_data').default({}),
  afkTurns: integer('afk_turns').default(0),
  isActive: boolean('is_active').default(true),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
});

export const hiddenExperience = pgTable('hidden_experience', {
  playerId: uuid('player_id').primaryKey().references(() => players.id, { onDelete: 'cascade' }),
  meltem: integer('meltem').notNull().default(0),
  terazi: integer('terazi').notNull().default(0),
  murekkep: integer('murekkep').notNull().default(0),
  simsar: integer('simsar').notNull().default(0),
});

export const portStates = pgTable('port_states', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  portId: varchar('port_id', { length: 50 }).notNull(),
  controller: varchar('controller', { length: 100 }),
  hunger: jsonb('hunger').notNull().default({}),
  isClosed: boolean('is_closed').default(false),
  closeReason: varchar('close_reason', { length: 50 }),
  closeTurnsLeft: integer('close_turns_left').default(0),
});

export const cityRelations = pgTable('city_relations', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  playerId: uuid('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  portId: varchar('port_id', { length: 50 }).notNull(),
  relationLevel: varchar('relation_level', { length: 20 }).notNull().default('yabanci'),
  relationScore: integer('relation_score').notNull().default(0),
  lastVisitTurn: integer('last_visit_turn'),
  activeRumorsAbout: integer('active_rumors_about').default(0),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  playerId: uuid('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  turn: integer('turn').notNull(),
  destinationPort: varchar('destination_port', { length: 50 }).notNull(),
  routeType: varchar('route_type', { length: 20 }).notNull(),
  intent: varchar('intent', { length: 20 }).notNull(),
  locked: boolean('locked').notNull().default(false),
  lockedAt: timestamp('locked_at', { withTimezone: true }),
});

export const combatEncounters = pgTable('combat_encounters', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  turn: integer('turn').notNull(),
  routeId: varchar('route_id', { length: 50 }),
  attackerId: uuid('attacker_id').notNull().references(() => players.id),
  defenderId: uuid('defender_id').notNull().references(() => players.id),
  attackerTactic: varchar('attacker_tactic', { length: 20 }),
  defenderTactic: varchar('defender_tactic', { length: 20 }),
  attackerPower: integer('attacker_power'),
  defenderPower: integer('defender_power'),
  result: varchar('result', { length: 20 }),
  loot: jsonb('loot').default({}),
  attackerDamage: boolean('attacker_damage').default(false),
  defenderDamage: boolean('defender_damage').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const rumors = pgTable('rumors', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  aboutPlayerId: uuid('about_player_id').references(() => players.id, { onDelete: 'set null' }),
  aboutType: varchar('about_type', { length: 30 }).notNull(),
  originPort: varchar('origin_port', { length: 50 }).notNull(),
  currentPorts: jsonb('current_ports').notNull().default([]),
  age: integer('age').notNull().default(0),
  strength: integer('strength').notNull().default(100),
  size: varchar('size', { length: 10 }).notNull().default('medium'),
  sourcePlayerId: uuid('source_player_id'),
  isFake: boolean('is_fake').default(false),
  createdTurn: integer('created_turn').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  eventTypeId: varchar('event_type_id', { length: 50 }).notNull(),
  turnTriggered: integer('turn_triggered').notNull(),
  duration: integer('duration').notNull().default(1),
  turnsRemaining: integer('turns_remaining').notNull().default(1),
  affectedPorts: jsonb('affected_ports').default([]),
  effects: jsonb('effects').default({}),
  playerChoices: jsonb('player_choices').default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  fromPlayerId: uuid('from_player_id').references(() => players.id),
  toPlayerId: uuid('to_player_id'),
  text: text('text').notNull(),
  turn: integer('turn').notNull(),
  channel: varchar('channel', { length: 20 }).notNull().default('public'),
  isNpc: boolean('is_npc').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const questProgress = pgTable('quest_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  playerId: uuid('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  chain: varchar('chain', { length: 50 }).notNull(),
  currentStage: integer('current_stage').notNull().default(1),
  branch: varchar('branch', { length: 50 }),
  stageData: jsonb('stage_data').default({}),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const npcStates = pgTable('npc_states', {
  id: uuid('id').defaultRandom().primaryKey(),
  playerId: uuid('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  personality: jsonb('personality').notNull(),
  secretMotivation: text('secret_motivation'),
  historicalRef: text('historical_ref'),
  speechStyle: text('speech_style'),
  debtTo: jsonb('debt_to').default({}),
  lastMessages: jsonb('last_messages').default([]),
});

export const tradeHistory = pgTable('trade_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  playerId: uuid('player_id').notNull().references(() => players.id),
  turn: integer('turn').notNull(),
  portId: varchar('port_id', { length: 50 }).notNull(),
  goodId: varchar('good_id', { length: 50 }).notNull(),
  action: varchar('action', { length: 10 }).notNull(),
  quantity: integer('quantity').notNull(),
  priceLevel: varchar('price_level', { length: 20 }),
  goldAmount: integer('gold_amount').notNull(),
  firstArrival: boolean('first_arrival').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
