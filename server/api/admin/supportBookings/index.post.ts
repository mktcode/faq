import z from "zod";

const bodySchema = z.object({
  userId: z.number().nullable(),
  day: z.string(),
  time: z.string(),
  notes: z.string()
});

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const { userId, day, time, notes } = await readValidatedBody(event, (body) => bodySchema.parse(body));

  await supportBookingsUtils.create(userId, day, time, notes)

  return { success: true }
})
