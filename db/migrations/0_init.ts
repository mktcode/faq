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
    .addColumn('googleId', 'text')
    .addColumn('balance', 'decimal(10, 2)', col => col.notNull().defaultTo(0))
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

  await db.schema
    .createTable('payments')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('amount', 'decimal(10, 2)', col => col.notNull())
    .addColumn('description', 'text')
    .addColumn('paymentMethod', 'varchar(50)')
    .addColumn('transactionId', 'text')
    .addColumn('status', 'varchar(20)', col => col.notNull().defaultTo('pending'))
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  await db.schema
    .createTable('charges')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('amount', 'decimal(10, 2)', col => col.notNull())
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // App

  await db.schema
    .createTable('qanda')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('topic', 'text')
    .addColumn('question', 'text', col => col.notNull())
    // .addColumn('questionEmbedding', 'vector(1536)', col => col.notNull())
    .addColumn('answer', 'text', col => col.notNull())
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Add questionEmbedding vector(1536) column
  await sql`ALTER TABLE qanda ADD COLUMN questionEmbedding vector(1536) NOT NULL`
    .execute(db)

  await db.schema
    .createTable('settings')
    .addColumn('userId', 'integer', col => col.primaryKey().notNull())
    .addColumn('settings', 'json', col => col.notNull().defaultTo('{}'))
    .execute()

  await db.schema
    .createTable('customerRequests')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('email', 'text')
    .addColumn('phone', 'text')
    .addColumn('message', 'text', col => col.notNull())
    .addColumn('status', 'varchar(20)', col => col.notNull().defaultTo('pending'))
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Add embedding vector(1536) column
  await sql`ALTER TABLE customerRequests ADD COLUMN embedding vector(1536) NOT NULL`
    .execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('webauthnCredentials').execute()
  await db.schema.dropTable('payments').execute()
  await db.schema.dropTable('charges').execute()
  await db.schema.dropTable('qanda').execute()
  await db.schema.dropTable('settings').execute()
  await db.schema.dropTable('customerRequests').execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
