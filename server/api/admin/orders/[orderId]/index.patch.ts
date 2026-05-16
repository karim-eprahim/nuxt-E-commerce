import { z } from "zod";

const orderUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"]).optional(),
  fulfillmentStatus: z.enum(["UNFULFILLED", "PARTIALLY_FULFILLED", "FULFILLED", "RETURNED"]).optional(),
  notes: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const orderId = event.context.params?.orderId;
  const body = await readValidatedBody(event, (value) => orderUpdateSchema.parse(value));

  return db.order.update({
    where: { id: orderId },
    data: body,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      orderItems: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
              inventory: true,
            },
          },
        },
      },
    },
  });
});
