import { productSchema } from "~/utils/validations";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const payload = await readValidatedBody(event, (body) => productSchema.parse(body));
  const productId = event.context.params?.productId;
  const title = payload.title ?? payload.name!;
  const requestedVariants = payload.variants?.length
    ? payload.variants
    : [buildDefaultVariant(payload, title, {})];
  const optionInputs = collectVariantOptions(payload.options ?? [], requestedVariants);

  await db.product.update({
    where: { id: productId },
    data: {
      title,
      slug: payload.slug || `${slugify(title)}-${productId}`,
      description: payload.description,
      brandId: payload.brandId || undefined,
      categoryId: payload.categoryId,
      isFeatured: payload.isFeatured ?? false,
      isArchived: payload.isArchived ?? false,
      isActive: payload.isActive ?? true,
      tags: payload.tags ?? [],
      images: {
        deleteMany: {},
        create: normalizeImages(payload.images),
      },
    },
  });

  const existingVariants = await db.productVariant.findMany({
    where: { productId },
    include: { inventory: true },
  });

  await db.productVariant.updateMany({
    where: { productId },
    data: { isActive: false },
  });

  await db.variantOptionSelection.deleteMany({
    where: {
      variant: { productId },
    },
  });

  await db.productOptionValue.deleteMany({
    where: {
      option: { productId },
    },
  });

  await db.productOption.deleteMany({
    where: { productId },
  });

  const optionValueIds = new Map<string, string>();
  for (const [optionIndex, option] of optionInputs.entries()) {
    const createdOption = await db.productOption.create({
      data: {
        productId: productId!,
        name: option.name,
        position: optionIndex,
      },
    });

    for (const [valueIndex, value] of option.values.entries()) {
      const createdValue = await db.productOptionValue.create({
        data: {
          optionId: createdOption.id,
          value,
          position: valueIndex,
        },
      });
      optionValueIds.set(`${option.name}:${value}`, createdValue.id);
    }
  }

  for (const [index, variant] of requestedVariants.entries()) {
    const sku = variant.sku || buildSku(title);
    const existing = existingVariants.find((item) => item.sku === sku);
    const stockQuantity = variant.stockQuantity ?? existing?.inventory?.stockQuantity ?? 0;
    const reservedQuantity = variant.reservedQuantity ?? existing?.inventory?.reservedQuantity ?? 0;
    const inventoryData = {
      stockQuantity,
      reservedQuantity,
      lowStockThreshold: variant.lowStockThreshold ?? existing?.inventory?.lowStockThreshold ?? 5,
      allowBackorders: variant.allowBackorders ?? existing?.inventory?.allowBackorders ?? false,
      inStock: (variant.allowBackorders ?? existing?.inventory?.allowBackorders ?? false) || stockQuantity - reservedQuantity > 0,
    };

    const savedVariant = existing
      ? await db.productVariant.update({
        where: { id: existing.id },
        data: {
          sku,
          barcode: variant.barcode,
          title: variant.title || Object.values(variant.options ?? {}).join(" / ") || "Default",
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          costPrice: variant.costPrice,
          weight: variant.weight,
          trackInventory: variant.trackInventory ?? true,
          isActive: variant.isActive ?? true,
          position: variant.position ?? index,
          images: {
            deleteMany: {},
            create: normalizeImages(variant.images ?? []),
          },
        },
        include: { inventory: true },
      })
      : await db.productVariant.create({
        data: {
          productId: productId!,
          sku,
          barcode: variant.barcode,
          title: variant.title || Object.values(variant.options ?? {}).join(" / ") || "Default",
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          costPrice: variant.costPrice,
          weight: variant.weight,
          trackInventory: variant.trackInventory ?? true,
          isActive: variant.isActive ?? true,
          position: variant.position ?? index,
          images: {
            create: normalizeImages(variant.images ?? []),
          },
          inventory: {
            create: inventoryData,
          },
        },
        include: { inventory: true },
      });

    if (existing && savedVariant.inventory) {
      const before = existing.inventory?.stockQuantity ?? 0;
      await db.variantInventory.update({
        where: { variantId: savedVariant.id },
        data: inventoryData,
      });

      if (before !== stockQuantity) {
        await db.inventoryTransaction.create({
          data: {
            inventoryId: savedVariant.inventory.id,
            type: "MANUAL_ADJUSTMENT",
            quantityBefore: before,
            quantityAfter: stockQuantity,
            delta: stockQuantity - before,
            referenceId: productId,
            referenceType: "PRODUCT_ADMIN",
            createdBy: session.user.id,
          },
        });
      }
    }

    await db.variantOptionSelection.deleteMany({
      where: { variantId: savedVariant.id },
    });

    for (const [name, value] of Object.entries(variant.options ?? {})) {
      const valueId = optionValueIds.get(`${name}:${value}`);
      if (!valueId) continue;
      await db.variantOptionSelection.create({
        data: {
          variantId: savedVariant.id,
          valueId,
        },
      });
    }
  }

  return db.product.findUnique({
    where: { id: productId },
    include: productInclude,
  });
});

const collectVariantOptions = (baseOptions: { name: string; values: string[] }[], variants: any[]) => {
  const options = new Map<string, Set<string>>();

  for (const option of baseOptions) {
    options.set(option.name, new Set(option.values));
  }

  for (const variant of variants) {
    for (const [name, value] of Object.entries(variant.options ?? {})) {
      const values = options.get(name) ?? new Set<string>();
      values.add(String(value));
      options.set(name, values);
    }
  }

  return [...options.entries()].map(([name, values]) => ({ name, values: [...values] }));
};

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
} as const;
