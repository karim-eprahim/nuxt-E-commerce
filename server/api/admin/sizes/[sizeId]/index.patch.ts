import { sizeSchema } from "~/utils/validations";

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

  const { name,value } = await readValidatedBody(event, (body) =>
    sizeSchema.parse(body),
  );

  const sizeId = event.context.params?.sizeId;

  const size = await db.size.update({
    where: {
      id: sizeId,
    },
    data: {
      name,
      value,
    },
  });

  return size;
});
