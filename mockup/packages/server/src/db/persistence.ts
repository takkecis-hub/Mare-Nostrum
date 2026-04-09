import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import type { GameState } from '../../../shared/src/types/index.js';

const SNAPSHOT_KEY = 'singleplayer';

export interface StatePersistence {
  load(): Promise<GameState | null>;
  save(state: GameState): Promise<void>;
}

export async function createStatePersistence(databaseUrl = process.env.DATABASE_URL): Promise<StatePersistence | null> {
  if (!databaseUrl) {
    return null;
  }

  const client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });
  const db = drizzle(client);

  await db.execute(sql`
    create table if not exists game_snapshots (
      snapshot_key text primary key,
      state jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);

  return {
    async load() {
      const rows = await client<{ state: GameState }[]>`
        select state
        from game_snapshots
        where snapshot_key = ${SNAPSHOT_KEY}
        limit 1
      `;

      return rows[0]?.state ?? null;
    },
    async save(state: GameState) {
      const snapshot = state as unknown as Parameters<typeof client.json>[0];
      await client`
        insert into game_snapshots (snapshot_key, state, updated_at)
        values (${SNAPSHOT_KEY}, ${client.json(snapshot)}, now())
        on conflict (snapshot_key)
        do update set state = excluded.state, updated_at = now()
      `;
    },
  };
}
