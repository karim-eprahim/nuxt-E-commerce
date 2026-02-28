export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  // Only ADMIN can delete categories
  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const categoryId = event.context.params?.categoryId;

  await db.category.delete({
    where: {
      id: categoryId,
    },
  });

  return { message: "Category deleted" };
});
