import { getResourceName } from "~/../app/utils";
import { deleteResourceFromCloudinary } from "~~/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  // Only ADMIN can delete products
  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Get product with images
  const product = await db.product.findUnique({
    where: {
      id: event.context.params?.productId,
      userId: session.user?.id,
    },
    include: {
      images: true,
    },
  });

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  // Delete cloudinary images using REST API
  for (const image of product.images) {
    const { public_id } = getResourceName(image.url);
    if (public_id) {
      await deleteResourceFromCloudinary(public_id);
    }
  }

  // Delete product and its images from DB
  await db.product.delete({
    where: {
      id: event.context.params?.productId,
      userId: session.user?.id,
    },
  });

  return { message: "Product deleted", product };
});