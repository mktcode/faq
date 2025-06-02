export async function updateUserBalance(userId: number) {
  const db = await getDatabaseConnection()

  // get sum of all user's succeeded payments
  const payments = await db
    .selectFrom('payments')
    .select(({ fn }) => [
      fn.sum('amount').as('totalPaid'),
    ])
    .where('userId', '=', userId)
    .where('status', '=', 'succeeded')
    .executeTakeFirstOrThrow()

  const totalPaid = Number(payments.totalPaid) || 0

  // get sum of all user's charges
  const charges = await db
    .selectFrom('charges')
    .select(({ fn }) => [
      fn.sum('amount').as('totalCharged'),
    ])
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow()

  const totalCharged = Number(charges.totalCharged) || 0

  const balance = totalPaid - totalCharged

  // Update the user's balance in the database
  await db
    .updateTable('users')
    .set({ balance })
    .where('id', '=', userId)
    .execute()
}
