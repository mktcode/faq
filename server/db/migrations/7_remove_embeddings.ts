import type { Kysely } from 'kysely'
import { sql } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  // Remove embedding columns from qanda and messages
  await sql`ALTER TABLE qanda DROP COLUMN embedding`.execute(db)
  await sql`ALTER TABLE messages DROP COLUMN embedding`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  // Re-add embedding vector(1536) columns to qanda and messages
  await sql`ALTER TABLE qanda ADD COLUMN embedding vector(1536)`.execute(db)
  await sql`ALTER TABLE messages ADD COLUMN embedding vector(1536)`.execute(db)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
