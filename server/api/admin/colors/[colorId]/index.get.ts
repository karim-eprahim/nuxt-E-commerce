export default defineEventHandler(async (event) => {
  await requireUserSession(event);
//   const session = await getUserSession(event);
  const color = await db.color.findUnique({
    where: {
      id: event.context.params?.colorId,
    },
  });
  return color;
})