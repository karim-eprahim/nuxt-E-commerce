import { categorySchema } from "~/utils/validations";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  // Only ADMIN can update categories
  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { name } = await readValidatedBody(event, (body) =>
    categorySchema.parse(body),
  );

  const categoryId = event.context.params?.categoryId;

  const category = await db.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
    },
  });

  return category;
});
