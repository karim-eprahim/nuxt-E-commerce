export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  
  const productId = event.context.params?.productId;
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
      category: true,
      color: true,
      size: true,
    }
  });
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }
  return product;
});