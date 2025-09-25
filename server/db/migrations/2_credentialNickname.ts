import type { Kysely } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('webauthnCredentials')
    .addColumn('credentialNickname', 'varchar(50)', col => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('webauthnCredentials')
    .dropColumn('credentialNickname')
    .execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
