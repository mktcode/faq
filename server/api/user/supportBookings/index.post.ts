import z from "zod";

const bodySchema = z.object({
  day: z.string(),
  time: z.string(),
  notes: z.string()
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const { day, time, notes } = await readValidatedBody(event, (body) => bodySchema.parse(body));

  await supportBookingsUtils.create(user.id, day, time, notes)

  return { success: true }
})
