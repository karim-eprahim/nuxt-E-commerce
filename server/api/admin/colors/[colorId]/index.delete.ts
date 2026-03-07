export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  // Only ADMIN can delete colors
  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const colorId = event.context.params?.colorId;

  await db.color.delete({
    where: {
      id: colorId,
    },
  });

  return { message: "Color deleted" };
});
