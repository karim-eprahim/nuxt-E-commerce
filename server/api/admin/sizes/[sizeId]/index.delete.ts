export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  // Only ADMIN can delete sizes
  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const sizeId = event.context.params?.sizeId;

  await db.size.delete({
    where: {
      id: sizeId,
    },
  });

  return { message: "Size deleted" };
});
