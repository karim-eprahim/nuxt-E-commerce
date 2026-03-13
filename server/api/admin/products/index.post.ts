import { productSchema } from "~/utils/validations";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);
  if (session.user && session.user?.role == "ADMIN") {
    const { name,images,price,categoryId,colorId,sizeId,isFeatured,isArchived } = await readValidatedBody(event, (body) =>
      productSchema.parse(body),
    );
    const product = await db.product.create({
      data: {
        name,
        images:{
            createMany:{
                data:{
                    ...images.map(img => img)
                }
            }
        },
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        userId: session.user.id,
      },
    });
    return product;
  } else {
    throw createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized, You don't have permission to perform this action",
    });
  }
  return null;
});
