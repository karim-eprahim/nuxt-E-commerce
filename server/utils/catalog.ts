type ProductImageInput = {
  url: string;
  altText?: string;
  isThumbnail?: boolean;
  sortOrder?: number;
};

type ProductOptionInput = {
  name: string;
  values: string[];
};

type ProductVariantInput = {
  id?: string;
  title?: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  weight?: number;
  trackInventory?: boolean;
  isActive?: boolean;
  position?: number;
  stockQuantity?: number;
  reservedQuantity?: number;
  lowStockThreshold?: number;
  allowBackorders?: boolean;
  images?: ProductImageInput[];
  options?: Record<string, string>;
};

export type ProductPayload = {
  title?: string;
  name?: string;
  slug?: string;
  description?: string;
  brandId?: string;
  categoryId: string;
  isFeatured?: boolean;
  isArchived?: boolean;
  isActive?: boolean;
  tags?: string[];
  images?: ProductImageInput[];
  options?: ProductOptionInput[];
  variants?: ProductVariantInput[];
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stockQuantity?: number;
  reservedQuantity?: number;
  lowStockThreshold?: number;
  allowBackorders?: boolean;
  colorId?: string;
  sizeId?: string;
};

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildSku = (title: string) => {
  const prefix = slugify(title).replace(/-/g, "").slice(0, 10).toUpperCase() || "SKU";
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
};

export const normalizeImages = (images: ProductImageInput[] = []) =>
  images.map((image, index) => ({
    url: image.url,
    altText: image.altText,
    isThumbnail: image.isThumbnail ?? index === 0,
    sortOrder: image.sortOrder ?? index,
  }));

export const variantAvailableQuantity = (inventory?: { stockQuantity: number; reservedQuantity: number } | null) =>
  inventory ? inventory.stockQuantity - inventory.reservedQuantity : 0;

export const mapProductForStore = (product: any) => {
  const primaryVariant = product.variants?.[0];
  const productImage = product.images?.find((image: any) => image.isThumbnail) ?? product.images?.[0];
  const variantImage = primaryVariant?.images?.find((image: any) => image.isThumbnail) ?? primaryVariant?.images?.[0];

  return {
    ...product,
    name: product.title,
    price: primaryVariant?.price ?? 0,
    compareAtPrice: primaryVariant?.compareAtPrice,
    sku: primaryVariant?.sku,
    selectedVariantId: primaryVariant?.id,
    images: product.images?.length ? product.images : primaryVariant?.images ?? [],
    thumbnailUrl: variantImage?.url ?? productImage?.url,
  };
};

export const getVariantOptionSnapshot = (variant: any) =>
  variant.selections?.map((selection: any) => ({
    name: selection.value.option.name,
    value: selection.value.value,
  })) ?? [];

export const ensureLegacyOptions = async (payload: ProductPayload) => {
  const options = [...(payload.options ?? [])];
  const variantOptions: Record<string, string> = {};

  if (payload.colorId) {
    const color = await db.color.findUnique({ where: { id: payload.colorId } });
    if (color) {
      options.push({ name: "Color", values: [color.name] });
      variantOptions.Color = color.name;
    }
  }

  if (payload.sizeId) {
    const size = await db.size.findUnique({ where: { id: payload.sizeId } });
    if (size) {
      options.push({ name: "Size", values: [size.name] });
      variantOptions.Size = size.name;
    }
  }

  return {
    options: dedupeOptions(options),
    variantOptions,
  };
};

const dedupeOptions = (options: ProductOptionInput[]) => {
  const byName = new Map<string, Set<string>>();

  for (const option of options) {
    const name = option.name.trim();
    if (!name) continue;
    const values = byName.get(name) ?? new Set<string>();
    for (const value of option.values) {
      const cleanValue = value.trim();
      if (cleanValue) values.add(cleanValue);
    }
    byName.set(name, values);
  }

  return [...byName.entries()].map(([name, values]) => ({
    name,
    values: [...values],
  }));
};

export const buildDefaultVariant = (payload: ProductPayload, title: string, optionValues: Record<string, string>) => ({
  title: Object.values(optionValues).join(" / ") || "Default",
  sku: payload.sku || buildSku(title),
  barcode: payload.barcode,
  price: payload.price ?? 0,
  compareAtPrice: payload.compareAtPrice,
  costPrice: payload.costPrice,
  trackInventory: true,
  isActive: true,
  stockQuantity: payload.stockQuantity ?? 0,
  reservedQuantity: payload.reservedQuantity ?? 0,
  lowStockThreshold: payload.lowStockThreshold ?? 5,
  allowBackorders: payload.allowBackorders ?? false,
  options: optionValues,
  images: payload.images,
});
