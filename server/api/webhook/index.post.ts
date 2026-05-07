import Stripe from "stripe";
import { stripe } from "../../utils/stripe";

export default defineEventHandler(async (event) => {
  const signature = getHeader(event, "stripe-signature");

  if (!signature) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing stripe signature",
    });
  }

  const body = await readRawBody(event);

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing body",
    });
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe().webhooks.constructEvent(
      body,
      signature,
      useRuntimeConfig().stripeWebhookSecret
    );
  } catch (error: any) {
    console.log("WEBHOOK ERROR:");
    console.log(error.message);
    console.log(error);

    throw createError({
      statusCode: 400,
      statusMessage: "Invalid signature",
    });
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session;

  console.log(session);

  const address = session.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter(Boolean).join(",");

  if (stripeEvent.type === "checkout.session.completed") {
    const order = await db.order.update({
      where: {
        id: session.metadata?.orderId as string,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map(
      (orderItem) => orderItem.productId
    );

    await db.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });
  }
});