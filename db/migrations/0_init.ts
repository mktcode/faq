import type { Kysely } from 'kysely'
import { sql } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('userName', 'varchar(50)', col => col.notNull().unique())
    .addColumn('email', 'text')
    .addColumn('emailConfirmationToken', 'varchar(36)')
    .addColumn('published', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('domain', 'varchar(100)', col => col.unique())
    .addColumn('domainIsExternal', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('domainContactId', 'integer')
    .addColumn('domainCode', 'varchar(100)')
    .addColumn('mailboxes', 'json', col => col.notNull())
    .addColumn('stripeCustomerId', 'varchar(255)', col => col.unique())
    .addColumn('stripeCheckoutSessionId', 'varchar(255)', col => col.unique())
    .addColumn('plan', 'varchar(10)')
    .addColumn('chatwootSourceId', 'varchar(150)')
    .addColumn('lastPaidAt', 'timestamp')
    .addColumn('settings', 'json', col => col.notNull())
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  await db.schema
    .createTable('webauthnCredentials')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('credentialId', 'varchar(255)', col => col.notNull().unique())
    .addColumn('publicKey', 'text', col => col.notNull())
    .addColumn('counter', 'integer', col => col.notNull())
    .addColumn('backedUp', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('transports', 'text')
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // App

  await db.schema
    .createTable('qanda')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('question', 'text', col => col.notNull())
    .addColumn('answer', 'text', col => col.notNull())
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Add embedding vector(1536) column
  await sql`ALTER TABLE qanda ADD COLUMN embedding vector(1536)`
    .execute(db)

  await db.schema
    .createTable('customerRequests')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('uuid', 'varchar(36)', col => col.notNull().unique())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('email', 'text')
    .addColumn('phone', 'text')
    .addColumn('status', 'varchar(20)', col => col.notNull().defaultTo('pending'))
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('customerRequestId', 'integer', col => col.notNull())
    .addColumn('body', 'text', col => col.notNull())
    .addColumn('isCustomer', 'boolean', col => col.notNull().defaultTo(true))
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Add embedding vector(1536) column
  await sql`ALTER TABLE messages ADD COLUMN embedding vector(1536)`
    .execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('webauthnCredentials').execute()
  await db.schema.dropTable('payments').execute()
  await db.schema.dropTable('charges').execute()
  await db.schema.dropTable('qanda').execute()
  await db.schema.dropTable('customerRequests').execute()
  await db.schema.dropTable('messages').execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
