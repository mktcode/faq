import type { Kysely } from 'kysely'
import { sql } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  // 1) Add temporary reference column
  await db.schema
    .alterTable('users')
    .addColumn('settings_ref', 'integer')
    .execute()

  // 2) Backfill settingsHistory from existing users.settings JSON
  // Insert one history row per user with current settings JSON
  await sql`
    INSERT INTO settingsHistory (userId, settings)
    SELECT id as userId, settings FROM users
  `.execute(db)

  // 3) Set users.settings_ref to the latest history row id for each user
  await sql`
    UPDATE users u
    JOIN (
      SELECT userId, MAX(id) AS latestId
      FROM settingsHistory
      GROUP BY userId
    ) h ON h.userId = u.id
    SET u.settings_ref = h.latestId
  `.execute(db)

  // 4) Drop old JSON settings column
  await db.schema
    .alterTable('users')
    .dropColumn('settings')
    .execute()

  // 5) Rename settings_ref -> settings (now integer reference)
  await db.schema
    .alterTable('users')
    .renameColumn('settings_ref', 'settings')
    .execute()

  // 6) Optional: add index for faster joins/lookups (keep nullable to ease create flow)
  await db.schema
    .alterTable('users')
    .addIndex('idx_users_settings_ref')
    .column('settings')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // 1) Add a temporary JSON column to hold settings payloads
  await db.schema
    .alterTable('users')
    .addColumn('settings_json', 'json')
    .execute()

  // 2) Copy JSON from referenced settingsHistory into the temp column
  await sql`
    UPDATE users u
    JOIN settingsHistory h ON h.id = u.settings
    SET u.settings_json = h.settings
  `.execute(db)

  // 3) Drop the integer reference column and index
  await db.schema
    .alterTable('users')
    .dropIndex('idx_users_settings_ref')
    .execute()

  await db.schema
    .alterTable('users')
    .dropColumn('settings')
    .execute()

  // 4) Rename the temp JSON column back to settings
  await db.schema
    .alterTable('users')
    .renameColumn('settings_json', 'settings')
    .execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
