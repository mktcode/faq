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
    .createTable('catalogs')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('info', 'text', col => col.notNull())
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  await db.schema
    .createTable('qanda')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('catalogId', 'integer', col => col.notNull())
    .addColumn('topic', 'text')
    .addColumn('question', 'text', col => col.notNull())
    .addColumn('answer', 'text', col => col.notNull())
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('webauthnCredentials').execute()
  await db.schema.dropTable('payments').execute()
  await db.schema.dropTable('charges').execute()
  await db.schema.dropTable('catalogs').execute()
  await db.schema.dropTable('qanda').execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
