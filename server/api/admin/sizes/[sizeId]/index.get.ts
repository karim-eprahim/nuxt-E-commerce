export default defineEventHandler(async (event) => {
  await requireUserSession(event);
//   const session = await getUserSession(event);
  const size = await db.size.findUnique({
    where: {
      id: event.context.params?.sizeId,
    },
  });
  return size;
})