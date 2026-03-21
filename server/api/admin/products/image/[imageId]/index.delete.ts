import { deleteResourceFromCloudinary } from "~~/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  // Delete cloudinary images using REST API
  await deleteResourceFromCloudinary(`products/${event.context.params?.imageId}` as string);

  return { message: "Image deleted" };
});