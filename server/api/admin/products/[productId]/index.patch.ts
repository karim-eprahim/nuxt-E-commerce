import { productSchema } from "~/utils/validations";

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

  const { name, price, isFeatured, isArchived, sizeId, colorId, categoryId , images } = await readValidatedBody(event, (body) =>
    productSchema.parse(body),
  );

  const productId = event.context.params?.productId;

  const product = await db.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images: {
        deleteMany: {},
        createMany: {
          data: [...images.map((img) => img)],
        },
      },
      isFeatured,
      isArchived,
      userId: session.user.id,
    },
  });

  return product;
});
