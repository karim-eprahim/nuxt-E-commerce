export default defineEventHandler(async (event) => {
  const productId = event.context.params?.productId;

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: productInclude,
  });

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  return mapProductForStore(product);
});

const productInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sortOrder: "asc" } },
  options: {
    orderBy: { position: "asc" },
    include: { values: { orderBy: { position: "asc" } } },
  },
  variants: {
    orderBy: { position: "asc" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      selections: {
        include: {
          value: { include: { option: true } },
        },
      },
    },
  },
  reviews: {
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  },
} as const;
