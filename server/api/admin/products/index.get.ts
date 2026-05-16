export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const where: any = {};

  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.isFeatured !== undefined) where.isFeatured = query.isFeatured === "true" || query.isFeatured === true;
  if (query.isArchived !== undefined) where.isArchived = query.isArchived === "true" || query.isArchived === true;

  const optionFilters = await getLegacyOptionFilters(query);
  if (optionFilters.length) {
    where.variants = {
      some: {
        selections: {
          some: {
            value: {
              OR: optionFilters,
            },
          },
        },
      },
    };
  }

  const products = await db.product.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: productInclude,
  });

  return products.map(mapProductForStore);
});

const getLegacyOptionFilters = async (query: Record<string, any>) => {
  const filters: any[] = [];

  if (query.colorId) {
    const color = await db.color.findUnique({ where: { id: String(query.colorId) } });
    if (color) filters.push({ value: color.name, option: { name: "Color" } });
  }

  if (query.sizeId) {
    const size = await db.size.findUnique({ where: { id: String(query.sizeId) } });
    if (size) filters.push({ value: size.name, option: { name: "Size" } });
  }

  return filters;
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
