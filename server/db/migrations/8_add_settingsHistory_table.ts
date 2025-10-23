import type { Kysely } from 'kysely'
import { sql } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('settingsHistory')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addColumn('settings', 'json', col => col.notNull())
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('settingsHistory').execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
