import { colorSchema } from "~/utils/validations";

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
    colorSchema.parse(body),
  );

  const colorId = event.context.params?.colorId;

  const color = await db.color.update({
    where: {
      id: colorId,
    },
    data: {
      name,
      value,
    },
  });

  return color;
});
