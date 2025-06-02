import { sql } from 'kysely'

export default defineTask({
  meta: {
    name: 'charge',
    description: 'Look for users to charge.',
  },
  async run() {
    const db = await getDatabaseConnection()
    const { public: { defaultPrice } } = useRuntimeConfig()

    await db.transaction().execute(async (trx) => {
      // TODO: This doesn't scale very well. But we need a better job queue system anyway.
      const users = await trx
        .selectFrom('users')
        .select(['id'])
        .forUpdate()
        .skipLocked()
        .where(sql<boolean>`createdAt < NOW() - INTERVAL 1 MONTH`)
        .execute()

      for (const user of users) {
        const chargesThisMonth = await trx
          .selectFrom('charges')
          .select(({ fn }) => [
            fn.count('id').as('count'),
          ])
          .where(sql<boolean>`createdAt > NOW() - INTERVAL 1 MONTH`)
          .forUpdate()
          .skipLocked()
          .executeTakeFirstOrThrow()

        const chargesThisMonthCount = Number(chargesThisMonth.count) || 0

        if (chargesThisMonthCount === 0) {
          await trx
            .insertInto('charges')
            .values({
              userId: user.id,
              amount: defaultPrice,
            })
            .execute()
        }
      }
    })

    return { result: 'Success' }
  },
})
