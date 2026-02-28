export default defineEventHandler(async (event) => {
  await requireUserSession(event);
//   const session = await getUserSession(event);
  const category = await db.category.findUnique({
    where: {
      id: event.context.params?.categoryId,
    },
  });
  return category;
})