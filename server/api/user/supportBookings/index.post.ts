import z from "zod";

const bodySchema = z.object({
  day: z.string(),
  time: z.string(),
  notes: z.string()
});

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)

  const { day, time, notes } = await readValidatedBody(event, (body) => bodySchema.parse(body));

  await supportBookingsUtils.create($profile.id, day, time, notes)

  return { success: true }
})
