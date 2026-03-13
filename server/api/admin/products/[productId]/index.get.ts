export default defineEventHandler(async (event) => {
  await requireUserSession(event);
//   const session = await getUserSession(event);
  const product = await db.product.findUnique({
    where: {
      id: event.context.params?.productId,
    },
  });
  return product;
})