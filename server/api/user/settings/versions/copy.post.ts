import { z } from 'zod'

const bodySchema = z.object({
  versionId: z.number(),
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { versionId } = await readValidatedBody(event, body => bodySchema.parse(body))

  const db = await getDatabaseConnection()

  const count = await db
    .selectFrom("settingsHistory")
    .select(db.fn.countAll().as("count"))
    .executeTakeFirstOrThrow()
    .then(result => { return Number(result.count.toString()) })
  
  if (count >= 10) {
    throw createError({ statusCode: 400, statusMessage: 'Version limit reached', message: 'You have reached the maximum number of saved versions. Please delete some versions before copying.' })
  }

  const settingsToCopy = await db
    .selectFrom('settingsHistory')
    .select(['id', 'settings', 'note'])
    .where('userId', '=', $profile.id)
    .where('id', '=', versionId)
    .executeTakeFirstOrThrow()

  const newVersion = {
    userId: $profile.id,
    settings: settingsToCopy.settings,
    note: `Kopie: ${settingsToCopy.note ?? 'Keine Notiz'}`,
  }

  const insertResult = await db
    .insertInto('settingsHistory')
    .values(newVersion)
    .executeTakeFirstOrThrow()

  const newVersionId = Number(insertResult.insertId)



  return { id: newVersionId, ...newVersion }
})
