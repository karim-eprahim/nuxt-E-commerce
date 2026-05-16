import { productSchema } from "~/utils/validations";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  if (session.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized, You don't have permission to perform this action",
    });
  }

  const payload = await readValidatedBody(event, (body) => productSchema.parse(body));
  const title = payload.title ?? payload.name!;
  const { options: legacyOptions, variantOptions } = await ensureLegacyOptions(payload);
  const requestedVariants = payload.variants?.length
    ? payload.variants
    : [buildDefaultVariant(payload, title, variantOptions)];

  const optionInputs = collectVariantOptions(legacyOptions, requestedVariants);

  const product = await db.product.create({
    data: {
      title,
      slug: payload.slug || `${slugify(title)}-${Date.now().toString(36)}`,
      description: payload.description,
      brandId: payload.brandId || undefined,
      categoryId: payload.categoryId,
      isFeatured: payload.isFeatured ?? false,
      isArchived: payload.isArchived ?? false,
      isActive: payload.isActive ?? true,
      tags: payload.tags ?? [],
      userId: session.user.id,
      images: {
        create: normalizeImages(payload.images),
      },
    },
  });

  const optionValueIds = new Map<string, string>();
  for (const [optionIndex, option] of optionInputs.entries()) {
    const createdOption = await db.productOption.create({
      data: {
        productId: product.id,
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
    const inventory = {
      stockQuantity: variant.stockQuantity ?? 0,
      reservedQuantity: variant.reservedQuantity ?? 0,
      lowStockThreshold: variant.lowStockThreshold ?? 5,
      allowBackorders: variant.allowBackorders ?? false,
    };
    const createdVariant = await db.productVariant.create({
      data: {
        productId: product.id,
        sku: variant.sku || buildSku(title),
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
          create: {
            ...inventory,
            inStock: inventory.allowBackorders || inventory.stockQuantity - inventory.reservedQuantity > 0,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    for (const [name, value] of Object.entries(variant.options ?? {})) {
      const valueId = optionValueIds.get(`${name}:${value}`);
      if (!valueId) continue;
      await db.variantOptionSelection.create({
        data: {
          variantId: createdVariant.id,
          valueId,
        },
      });
    }

    if (createdVariant.inventory && inventory.stockQuantity > 0) {
      await db.inventoryTransaction.create({
        data: {
          inventoryId: createdVariant.inventory.id,
          type: "PURCHASE",
          quantityBefore: 0,
          quantityAfter: inventory.stockQuantity,
          delta: inventory.stockQuantity,
          referenceType: "INITIAL_STOCK",
          createdBy: session.user.id,
        },
      });
    }
  }

  return db.product.findUnique({
    where: { id: product.id },
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
