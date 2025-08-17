import { Kysely, MysqlDialect } from 'kysely'
import mysql from 'mysql2'
import type { Database } from '~/types/db'

let connection: Kysely<Database> | null = null

export async function getDatabaseConnection() {
  const { databaseUrl } = useRuntimeConfig()
  if (!databaseUrl) {
    throw new Error(`Database URL is not defined in the runtime configuration. (Value: ${databaseUrl})`)
  }

  if (connection) {
    return connection
  }

  connection = new Kysely({
    dialect: new MysqlDialect({ pool: mysql.createPool({
      uri: databaseUrl,
      typeCast(field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          return field.string() === '1'
        }
        else if (field.type === 'NEWDECIMAL') {
          return Number(field.string())
        }
        else {
          return next()
        }
      },
    }) }),
  })

  return connection
}
