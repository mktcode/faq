import z from "zod";

const routeParamsSchema = z.object({
  id: z.string(),
}).transform((data) => ({
  id: Number(data.id),
}));

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { id } = await getValidatedRouterParams(event, (data) => routeParamsSchema.parse(data));
  const db = await getDatabaseConnection()

  await db
    .deleteFrom('supportBookings')
    .where('id', '=', id)
    .where('userId', '=', user.id)
    .execute()

  return { success: true }
})
