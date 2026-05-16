import { stripe } from "../../utils/stripe";

type CheckoutLineInput = string | {
  productId?: string;
  variantId?: string;
  quantity?: number;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<CheckoutLineInput[]>(event);
  const lines = normalizeCheckoutLines(body);

  if (!lines.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Products are required",
    });
  }

  const requestedIds = lines.map((line) => line.variantId);
  const matchingVariants = await db.productVariant.findMany({
    where: {
      OR: [
        { id: { in: requestedIds } },
        { productId: { in: requestedIds } },
      ],
      isActive: true,
      product: {
        isArchived: false,
        isActive: true,
      },
    },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
        },
      },
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      selections: {
        include: {
          value: { include: { option: true } },
        },
      },
    },
  });

  const variants = lines
    .map((line) => matchingVariants.find((item) => item.id === line.variantId || item.productId === line.variantId))
    .filter(Boolean);

  if (variants.length !== lines.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "One or more variants were not found",
    });
  }

  const lineByVariantId = new Map<string, { variantId: string; quantity: number }>();
  for (const line of lines) {
    const variant = matchingVariants.find((item) => item.id === line.variantId || item.productId === line.variantId);
    if (variant) lineByVariantId.set(variant.id, line);
  }

  for (const variant of variants) {
    const requestedQuantity = lineByVariantId.get(variant.id)?.quantity ?? 1;
    if (!variant.trackInventory || variant.inventory?.allowBackorders) continue;
    if (variantAvailableQuantity(variant.inventory) < requestedQuantity) {
      throw createError({
        statusCode: 409,
        statusMessage: `${variant.product.title} - ${variant.title} is out of stock`,
      });
    }
  }

  const subtotal = variants.reduce((total, variant) => {
    const quantity = lineByVariantId.get(variant.id)?.quantity ?? 1;
    return total + variant.price * quantity;
  }, 0);

  const order = await db.order.create({
    data: {
      orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
      subtotal,
      total: subtotal,
      status: "PENDING",
      paymentStatus: "PENDING",
      fulfillmentStatus: "UNFULFILLED",
      orderItems: {
        create: variants.map((variant) => {
          const quantity = lineByVariantId.get(variant.id)?.quantity ?? 1;
          const productImage = variant.product.images?.find((image: any) => image.isThumbnail) ?? variant.product.images?.[0];
          const variantImage = variant.images?.find((image: any) => image.isThumbnail) ?? variant.images?.[0];

          return {
            variantId: variant.id,
            quantity,
            snapshotProductTitle: variant.product.title,
            snapshotVariantTitle: variant.title,
            snapshotSku: variant.sku,
            snapshotImageUrl: variantImage?.url ?? productImage?.url,
            snapshotOptions: getVariantOptionSnapshot(variant),
            unitPrice: variant.price,
            subtotal: variant.price * quantity,
          };
        }),
      },
    },
  });

  for (const variant of variants) {
    const quantity = lineByVariantId.get(variant.id)?.quantity ?? 1;
    if (!variant.trackInventory || !variant.inventory) continue;
    const before = variant.inventory.reservedQuantity;
    const after = before + quantity;

    await db.variantInventory.update({
      where: { variantId: variant.id },
      data: {
        reservedQuantity: after,
        inStock: variant.inventory.allowBackorders || variant.inventory.stockQuantity - after > 0,
      },
    });

    await db.inventoryTransaction.create({
      data: {
        inventoryId: variant.inventory.id,
        type: "RESERVATION",
        quantityBefore: before,
        quantityAfter: after,
        delta: quantity,
        referenceId: order.id,
        referenceType: "ORDER",
      },
    });
  }

  const origin = getRequestURL(event).origin;
  const session = await stripe().checkout.sessions.create({
    line_items: variants.map((variant) => {
      const quantity = lineByVariantId.get(variant.id)?.quantity ?? 1;
      return {
        quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: `${variant.product.title} - ${variant.title}`,
          },
          unit_amount: Math.round(variant.price * 100),
        },
      };
    }),
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${origin}/cart?success=1`,
    cancel_url: `${origin}/cart?success=2`,
    metadata: {
      orderId: order.id,
    },
  });

  await db.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return {
    url: session.url,
  };
});

const normalizeCheckoutLines = (input: CheckoutLineInput[] = []) =>
  input
    .map((item) => {
      if (typeof item === "string") {
        return { variantId: item, quantity: 1 };
      }

      return {
        variantId: item.variantId ?? item.productId ?? "",
        quantity: Math.max(1, item.quantity ?? 1),
      };
    })
    .filter((item) => item.variantId);
