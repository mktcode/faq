import { sql, type Kysely } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('websites')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('plan', 'text', col => col.notNull())
    .addColumn('css', 'text')
    .addColumn('store', 'text')
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`NOW()`))
    .execute()
  
  await db.schema
    .createTable('websitePages')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('websiteId', 'integer', col => col.notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull())
    .addColumn('description', 'text', col => col.notNull())
    .addColumn('template', 'text', col => col.notNull())
    .addColumn('css', 'text', col => col.notNull())
    .addColumn('js', 'text', col => col.notNull())
    .execute()
  
  await db.schema
    .createTable('websitePartials')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('websiteId', 'integer', col => col.notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull())
    .addColumn('description', 'text', col => col.notNull())
    .addColumn('template', 'text', col => col.notNull())
    .addColumn('css', 'text', col => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('websites').execute()
  await db.schema.dropTable('websitePages').execute()
  await db.schema.dropTable('websitePartials').execute()
}
/* eslint-enable @typescript-eslint/no-explicit-any */
