import type { Kysely } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('supportBookings')
    .modifyColumn('userId', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('supportBookings')
    .modifyColumn('userId', 'integer', (col) => col.notNull())
    .execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
