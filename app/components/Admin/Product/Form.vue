<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">{{ pageTitle }}</h1>
          <p class="text-sm text-muted-foreground">{{ pageDescription }}</p>
        </div>
        <Button v-if="isEditing" @click="isAlertModalVisible = true" variant="destructive" size="sm" class="gap-2">
          <Icon name="lucide:trash" class="h-4 w-4" />
          Delete
        </Button>
      </div>

      <form class="space-y-6" @submit.prevent="onSubmit">
        <section class="rounded-lg border bg-card p-5">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon name="lucide:box" class="h-4 w-4" />
            </div>
            <div>
              <h2 class="text-base font-semibold">Product Template</h2>
              <p class="text-xs text-muted-foreground">Shared catalog details for all variants.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="space-y-2">
              <Label>Title</Label>
              <Input v-model="form.title" :disabled="isLoading" placeholder="Classic Cotton T-Shirt" />
            </div>

            <div class="space-y-2">
              <Label>Slug</Label>
              <Input v-model="form.slug" :disabled="isLoading" placeholder="classic-cotton-t-shirt" />
            </div>

            <div class="space-y-2">
              <Label>Category</Label>
              <Select v-model="form.categoryId" :disabled="isLoading">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="category in categories || []" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Tags</Label>
              <Input v-model="tagInput" :disabled="isLoading" placeholder="summer, cotton, essentials" />
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <textarea
                v-model="form.description"
                :disabled="isLoading"
                class="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder="Short product description for the storefront."
              />
            </div>
          </div>
        </section>

        <section class="rounded-lg border bg-card p-5">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon name="lucide:image" class="h-4 w-4" />
            </div>
            <div>
              <h2 class="text-base font-semibold">Product Images</h2>
              <p class="text-xs text-muted-foreground">Used as gallery images and variant fallbacks.</p>
            </div>
          </div>
          <ImageUpload :model-value="form.images" @update:model-value="form.images = normalizeUploadedImages($event)" />
        </section>

        <section class="rounded-lg border bg-card p-5">
          <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon name="lucide:list-plus" class="h-4 w-4" />
              </div>
              <div>
                <h2 class="text-base font-semibold">Options</h2>
                <p class="text-xs text-muted-foreground">Create dynamic attributes such as Color, Size, Storage, or Material.</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" class="gap-2" @click="addOption">
              <Icon name="lucide:plus" class="h-4 w-4" />
              Add Option
            </Button>
          </div>

          <div class="space-y-3">
            <div v-for="(option, optionIndex) in form.options" :key="option.localId" class="rounded-md border p-4">
              <div class="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_auto] md:items-start">
                <div class="space-y-2">
                  <Label>Option Name</Label>
                  <Input v-model="option.name" placeholder="Color" @update:model-value="generateVariants" />
                </div>

                <div class="space-y-2">
                  <Label>Values</Label>
                  <div class="flex flex-wrap gap-2">
                    <div v-for="(value, valueIndex) in option.values" :key="value.localId" class="flex items-center gap-1 rounded-md border px-2 py-1">
                      <Input v-model="value.value" class="h-7 w-32 border-0 px-1 shadow-none focus-visible:ring-0" placeholder="Red" @update:model-value="generateVariants" />
                      <button type="button" class="text-muted-foreground hover:text-destructive" @click="removeOptionValue(optionIndex, valueIndex)">
                        <Icon name="lucide:x" class="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Button type="button" variant="ghost" size="sm" class="gap-2" @click="addOptionValue(optionIndex)">
                      <Icon name="lucide:plus" class="h-4 w-4" />
                      Value
                    </Button>
                  </div>
                </div>

                <Button type="button" variant="ghost" size="icon" class="text-muted-foreground hover:text-destructive" @click="removeOption(optionIndex)">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div v-if="!form.options.length" class="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
              No options yet. Products without options will use one default variant.
            </div>
          </div>
        </section>

        <section class="rounded-lg border bg-card p-5">
          <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon name="lucide:barcode" class="h-4 w-4" />
              </div>
              <div>
                <h2 class="text-base font-semibold">Variants & Inventory</h2>
                <p class="text-xs text-muted-foreground">Each row is a sellable SKU with its own pricing and stock.</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" class="gap-2" @click="generateVariants">
              <Icon name="lucide:refresh-cw" class="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <div class="overflow-x-auto rounded-md border">
            <table class="w-full min-w-[980px] text-sm">
              <thead class="bg-muted/70 text-left">
                <tr>
                  <th class="px-3 py-2 font-medium">Variant</th>
                  <th class="px-3 py-2 font-medium">SKU</th>
                  <th class="px-3 py-2 font-medium">Price</th>
                  <th class="px-3 py-2 font-medium">Compare</th>
                  <th class="px-3 py-2 font-medium">Cost</th>
                  <th class="px-3 py-2 font-medium">Stock</th>
                  <th class="px-3 py-2 font-medium">Reserved</th>
                  <th class="px-3 py-2 font-medium">Low</th>
                  <th class="px-3 py-2 font-medium">Backorders</th>
                  <th class="px-3 py-2 font-medium">Active</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="variant in form.variants" :key="variant.key" class="border-t">
                  <td class="px-3 py-2">
                    <div class="font-medium">{{ variant.title }}</div>
                    <div class="text-xs text-muted-foreground">{{ variantSubtitle(variant) }}</div>
                  </td>
                  <td class="px-3 py-2">
                    <Input v-model="variant.sku" class="h-8" />
                  </td>
                  <td class="px-3 py-2">
                    <Input v-model.number="variant.price" type="number" min="0" step="0.01" class="h-8" />
                  </td>
                  <td class="px-3 py-2">
                    <Input v-model.number="variant.compareAtPrice" type="number" min="0" step="0.01" class="h-8" />
                  </td>
                  <td class="px-3 py-2">
                    <Input v-model.number="variant.costPrice" type="number" min="0" step="0.01" class="h-8" />
                  </td>
                  <td class="px-3 py-2">
                    <Input v-model.number="variant.stockQuantity" type="number" min="0" class="h-8" />
                  </td>
                  <td class="px-3 py-2">
                    <Input v-model.number="variant.reservedQuantity" type="number" min="0" class="h-8" />
                  </td>
                  <td class="px-3 py-2">
                    <Input v-model.number="variant.lowStockThreshold" type="number" min="0" class="h-8" />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <Checkbox v-model:checked="variant.allowBackorders" />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <Checkbox v-model:checked="variant.isActive" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="rounded-lg border bg-card p-5">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon name="lucide:eye" class="h-4 w-4" />
            </div>
            <div>
              <h2 class="text-base font-semibold">Visibility</h2>
              <p class="text-xs text-muted-foreground">Control storefront and admin lifecycle state.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label class="flex items-center justify-between rounded-md border p-4">
              <span>
                <span class="block text-sm font-medium">Featured</span>
                <span class="text-xs text-muted-foreground">Show in featured sections.</span>
              </span>
              <Checkbox v-model:checked="form.isFeatured" />
            </label>
            <label class="flex items-center justify-between rounded-md border p-4">
              <span>
                <span class="block text-sm font-medium">Archived</span>
                <span class="text-xs text-muted-foreground">Hide without deleting.</span>
              </span>
              <Checkbox v-model:checked="form.isArchived" />
            </label>
            <label class="flex items-center justify-between rounded-md border p-4">
              <span>
                <span class="block text-sm font-medium">Active</span>
                <span class="text-xs text-muted-foreground">Available to storefront APIs.</span>
              </span>
              <Checkbox v-model:checked="form.isActive" />
            </label>
          </div>
        </section>

        <div class="flex items-center gap-3 border-t pt-4">
          <Button type="submit" :disabled="isLoading" class="gap-2">
            <Icon v-if="isLoading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <Icon v-else name="lucide:check" class="h-4 w-4" />
            {{ actionLabel }}
          </Button>
          <Button type="button" variant="outline" :disabled="isLoading" @click="navigateTo('/admin/products')">
            Cancel
          </Button>
        </div>
      </form>
    </div>

    <AlertModal :isOpen="isAlertModalVisible" @onClose="isAlertModalVisible = false" @onConfirm="deleteProduct" />
  </div>
</template>

<script setup lang="ts">
import type { RouteParams } from "~~/types";

type ProductOptionValueForm = {
  localId: string;
  value: string;
};

type ProductOptionForm = {
  localId: string;
  name: string;
  values: ProductOptionValueForm[];
};

type ProductVariantForm = {
  key: string;
  title: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  weight?: number;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  allowBackorders: boolean;
  trackInventory: boolean;
  isActive: boolean;
  options: Record<string, string>;
};

const { showError, showMessage, toggleLoading, isLoading } = useStore();
const route = useRoute();
const params = route.params as RouteParams;
const isAlertModalVisible = ref(false);

const isEditing = computed(() => !!params.productId && params.productId !== "new");
const pageTitle = computed(() => isEditing.value ? "Edit Product Template" : "Create Product Template");
const pageDescription = computed(() => "Manage shared product data, dynamic options, variants, and inventory.");
const actionLabel = computed(() => isEditing.value ? "Save Changes" : "Create Product");
const toastMessage = computed(() => isEditing.value ? "Product updated successfully" : "Product created successfully");

const { data: categories } = await useFetch<any[]>("/api/admin/categories");
const { data: currentProduct } = await useFetch<any>(
  `/api/admin/products/${params.productId}`,
  { immediate: isEditing.value },
);

const form = reactive({
  title: "",
  slug: "",
  description: "",
  categoryId: "",
  brandId: "",
  images: [] as any[],
  options: [] as ProductOptionForm[],
  variants: [] as ProductVariantForm[],
  isFeatured: false,
  isArchived: false,
  isActive: true,
});

const tagInput = ref("");

const localId = () => Math.random().toString(36).slice(2);
const cleanSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeUploadedImages = (images: any[] = []) =>
  images.map((image, index) => ({
    url: image.url,
    altText: image.altText,
    isThumbnail: image.isThumbnail ?? index === 0,
    sortOrder: image.sortOrder ?? index,
  }));

const addOption = () => {
  form.options.push({
    localId: localId(),
    name: "",
    values: [{ localId: localId(), value: "" }],
  });
};

const removeOption = (optionIndex: number) => {
  form.options.splice(optionIndex, 1);
  generateVariants();
};

const addOptionValue = (optionIndex: number) => {
  form.options[optionIndex].values.push({ localId: localId(), value: "" });
  generateVariants();
};

const removeOptionValue = (optionIndex: number, valueIndex: number) => {
  form.options[optionIndex].values.splice(valueIndex, 1);
  generateVariants();
};

const normalizedOptions = () =>
  form.options
    .map((option) => ({
      name: option.name.trim(),
      values: option.values.map((value) => value.value.trim()).filter(Boolean),
    }))
    .filter((option) => option.name && option.values.length);

const cartesian = (entries: { name: string; values: string[] }[]) =>
  entries.reduce<Record<string, string>[]>(
    (acc, option) => acc.flatMap((item) => option.values.map((value) => ({ ...item, [option.name]: value }))),
    [{}],
  );

const generateVariants = () => {
  const existing = new Map(form.variants.map((variant) => [variant.key, variant]));
  const combinations = normalizedOptions().length ? cartesian(normalizedOptions()) : [{}];

  form.variants = combinations.map((options, index) => {
    const title = Object.values(options).join(" / ") || "Default";
    const key = Object.entries(options).map(([name, value]) => `${name}:${value}`).join("|") || "default";
    const previous = existing.get(key);

    return {
      key,
      title,
      sku: previous?.sku || buildSku(form.title || "Product", title),
      price: previous?.price ?? 0,
      compareAtPrice: previous?.compareAtPrice,
      costPrice: previous?.costPrice,
      stockQuantity: previous?.stockQuantity ?? 0,
      reservedQuantity: previous?.reservedQuantity ?? 0,
      lowStockThreshold: previous?.lowStockThreshold ?? 5,
      allowBackorders: previous?.allowBackorders ?? false,
      trackInventory: previous?.trackInventory ?? true,
      isActive: previous?.isActive ?? true,
      options,
    };
  });
};

const buildSku = (productTitle: string, variantTitle: string) => {
  const base = `${productTitle}-${variantTitle}`
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
  return base || `SKU-${Date.now().toString(36).toUpperCase()}`;
};

const variantSubtitle = (variant: ProductVariantForm) =>
  Object.entries(variant.options).map(([name, value]) => `${name}: ${value}`).join(" | ") || "No options";

const hydrateFromProduct = (product: any) => {
  form.title = product.title || product.name || "";
  form.slug = product.slug || "";
  form.description = product.description || "";
  form.categoryId = product.categoryId || "";
  form.brandId = product.brandId || "";
  form.images = normalizeUploadedImages(product.images || []);
  form.options = (product.options || []).map((option: any) => ({
    localId: option.id || localId(),
    name: option.name,
    values: (option.values || []).map((value: any) => ({
      localId: value.id || localId(),
      value: value.value,
    })),
  }));
  form.variants = (product.variants || []).map((variant: any, index: number) => {
    const options = Object.fromEntries(
      (variant.selections || []).map((selection: any) => [selection.value.option.name, selection.value.value]),
    );
    const title = variant.title || Object.values(options).join(" / ") || "Default";
    return {
      key: Object.entries(options).map(([name, value]) => `${name}:${value}`).join("|") || `default-${index}`,
      title,
      sku: variant.sku,
      barcode: variant.barcode,
      price: variant.price ?? 0,
      compareAtPrice: variant.compareAtPrice,
      costPrice: variant.costPrice,
      weight: variant.weight,
      stockQuantity: variant.inventory?.stockQuantity ?? 0,
      reservedQuantity: variant.inventory?.reservedQuantity ?? 0,
      lowStockThreshold: variant.inventory?.lowStockThreshold ?? 5,
      allowBackorders: variant.inventory?.allowBackorders ?? false,
      trackInventory: variant.trackInventory ?? true,
      isActive: variant.isActive ?? true,
      options,
    };
  });
  form.isFeatured = product.isFeatured ?? false;
  form.isArchived = product.isArchived ?? false;
  form.isActive = product.isActive ?? true;
  tagInput.value = (product.tags || []).join(", ");
  if (!form.variants.length) generateVariants();
};

if (currentProduct.value) {
  hydrateFromProduct(currentProduct.value);
} else {
  addOption();
  form.options[0].name = "Color";
  form.options[0].values[0].value = "Default";
  generateVariants();
}

watch(() => form.title, (title) => {
  if (!isEditing.value && !form.slug) form.slug = cleanSlug(title);
});

const buildPayload = () => ({
  title: form.title,
  name: form.title,
  slug: form.slug || cleanSlug(form.title),
  description: form.description,
  categoryId: form.categoryId,
  brandId: form.brandId || undefined,
  images: form.images,
  options: normalizedOptions(),
  variants: form.variants.map((variant, position) => ({
    title: variant.title,
    sku: variant.sku,
    barcode: variant.barcode,
    price: Number(variant.price || 0),
    compareAtPrice: variant.compareAtPrice === undefined || variant.compareAtPrice === null ? undefined : Number(variant.compareAtPrice),
    costPrice: variant.costPrice === undefined || variant.costPrice === null ? undefined : Number(variant.costPrice),
    weight: variant.weight === undefined || variant.weight === null ? undefined : Number(variant.weight),
    stockQuantity: Number(variant.stockQuantity || 0),
    reservedQuantity: Number(variant.reservedQuantity || 0),
    lowStockThreshold: Number(variant.lowStockThreshold || 0),
    allowBackorders: variant.allowBackorders,
    trackInventory: variant.trackInventory,
    isActive: variant.isActive,
    position,
    options: variant.options,
  })),
  tags: tagInput.value.split(",").map((tag) => tag.trim()).filter(Boolean),
  isFeatured: form.isFeatured,
  isArchived: form.isArchived,
  isActive: form.isActive,
});

const onSubmit = async () => {
  toggleLoading(true);
  try {
    const url = isEditing.value ? `/api/admin/products/${params.productId}` : "/api/admin/products";
    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(url, { method, body: buildPayload() });
    await refreshNuxtData("products");

    showMessage({ title: toastMessage.value, variant: "success" });
    navigateTo("/admin/products");
  } catch (error) {
    showError(handleError(error));
  } finally {
    toggleLoading(false);
  }
};

const deleteProduct = async () => {
  if (!isEditing.value) return;
  toggleLoading(true);
  try {
    await $fetch(`/api/admin/products/${params.productId}`, { method: "DELETE" });
    await refreshNuxtData("products");
    showMessage({ title: "Product deleted", variant: "destructive" });
    navigateTo("/admin/products");
  } catch (error) {
    showError(handleError(error));
  } finally {
    toggleLoading(false);
    isAlertModalVisible.value = false;
  }
};
</script>
