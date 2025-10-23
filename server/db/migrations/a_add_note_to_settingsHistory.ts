import type { Kysely } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('settingsHistory')
    .addColumn('note', 'varchar(255)')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('settingsHistory')
    .dropColumn('note')
    .execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
