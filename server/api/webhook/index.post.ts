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
    throw createError({
      statusCode: 400,
      statusMessage: error.message || "Invalid signature",
    });
  }

  if (stripeEvent.type !== "checkout.session.completed" && stripeEvent.type !== "checkout.session.expired") {
    return { received: true };
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing order id",
    });
  }

  if (stripeEvent.type === "checkout.session.expired") {
    await releaseReservations(orderId);
    await db.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        paymentStatus: "FAILED",
      },
    });
    return { received: true };
  }

  const address = session.customer_details?.address;
  const shippingAddress = address
    ? {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postal_code,
      country: address.country,
    }
    : undefined;

  const order = await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CONFIRMED",
      paymentStatus: "PAID",
      phone: session.customer_details?.phone || undefined,
      shippingAddress,
    },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              inventory: true,
            },
          },
        },
      },
    },
  });

  for (const item of order.orderItems) {
    const inventory = item.variant.inventory;
    if (!inventory || !item.variant.trackInventory) continue;

    const stockBefore = inventory.stockQuantity;
    const stockAfter = stockBefore - item.quantity;
    const reservedBefore = inventory.reservedQuantity;
    const reservedAfter = Math.max(0, reservedBefore - item.quantity);

    await db.variantInventory.update({
      where: { variantId: item.variantId },
      data: {
        stockQuantity: stockAfter,
        reservedQuantity: reservedAfter,
        inStock: inventory.allowBackorders || stockAfter - reservedAfter > 0,
      },
    });

    await db.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type: "SALE",
        quantityBefore: stockBefore,
        quantityAfter: stockAfter,
        delta: -item.quantity,
        referenceId: order.id,
        referenceType: "ORDER",
      },
    });
  }

  return { received: true };
});

const releaseReservations = async (orderId: string) => {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          variant: {
            include: { inventory: true },
          },
        },
      },
    },
  });

  if (!order) return;

  for (const item of order.orderItems) {
    const inventory = item.variant.inventory;
    if (!inventory) continue;

    const before = inventory.reservedQuantity;
    const after = Math.max(0, before - item.quantity);

    await db.variantInventory.update({
      where: { variantId: item.variantId },
      data: {
        reservedQuantity: after,
        inStock: inventory.allowBackorders || inventory.stockQuantity - after > 0,
      },
    });

    await db.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type: "RESERVATION_RELEASE",
        quantityBefore: before,
        quantityAfter: after,
        delta: -item.quantity,
        referenceId: order.id,
        referenceType: "ORDER",
      },
    });
  }
};
