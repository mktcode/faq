export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)

  const db = await getDatabaseConnection()

  const otp = await db
    .selectFrom('users')
    .select(['oneTimePassword', 'oneTimePasswordCreatedAt'])
    .where('id', '=', $profile.id)
    .executeTakeFirstOrThrow()

  if (otp.oneTimePassword && otp.oneTimePasswordCreatedAt) {
    const secondsLeft = Math.max(0, Math.floor((otp.oneTimePasswordCreatedAt.getTime() + 15 * 60 * 1000 - Date.now()) / 1000))

    if (secondsLeft) {
      return {
        otp: otp.oneTimePassword,
        secondsLeft
      }
    } else {
      await db
        .updateTable('users')
        .set({
          oneTimePassword: null,
          oneTimePasswordCreatedAt: null
        })
        .where('id', '=', $profile.id)
        .execute()
    }
  }

  return {
    otp: null,
    secondsLeft: 0
  }
})
