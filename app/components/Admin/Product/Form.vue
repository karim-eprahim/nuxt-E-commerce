<template>
  <div class="min-h-screen p-6">
    <!-- Header -->
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
          <p class="text-sm mt-1">{{ description }}</p>
        </div>
        <Button
          v-if="isEditing"
          @click="isAlertModalVisible = true"
          variant="destructive"
          size="sm"
          class="gap-2"
        >
          <Icon name="lucide:trash" class="h-4 w-4" />
          Delete
        </Button>
      </div>

      <Separator class="my-6" />

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-8">

        <!-- Section: Basic Info -->
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-widest mb-4">Basic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Product Name -->
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel class="text-sm font-medium">Product Name</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    :disabled="isLoading"
                    placeholder="e.g. Classic White Sneaker"
                    class="h-10 rounded-lg transition-all"
                  />
                </FormControl>
                <FormDescription class="text-xs">This name will appear in the store.</FormDescription>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>

            <!-- Price -->
            <FormField v-slot="{ componentField }" name="price">
              <FormItem>
                <FormLabel class="text-sm font-medium">Price</FormLabel>
                <FormControl>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm">$</span>
                    <Input
                      v-bind="componentField"
                      type="number"
                      step="0.01"
                      min="0"
                      :disabled="isLoading"
                      placeholder="0.00"
                      class="h-10 rounded-lg pl-7 transition-all"
                    />
                  </div>
                </FormControl>
                <FormDescription class="text-xs">Set the retail price in USD.</FormDescription>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>

          </div>
        </div>

        <!-- Section: Classification -->
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-widest mb-4">Classification</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <!-- Category -->
            <FormField v-slot="{ componentField }" name="categoryId">
              <FormItem>
                <FormLabel class="text-sm font-medium">Category</FormLabel>
                <FormControl>
                  <Select v-bind="componentField" :disabled="isLoading">
                    <SelectTrigger class="h-10 rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>

            <!-- Size -->
            <FormField v-slot="{ componentField }" name="sizeId">
              <FormItem>
                <FormLabel class="text-sm font-medium">Size</FormLabel>
                <FormControl>
                  <Select v-bind="componentField" :disabled="isLoading">
                    <SelectTrigger class="h-10 rounded-lg">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="size in sizes"
                        :key="size.id"
                        :value="size.id"
                      >
                        {{ size.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>

            <!-- Color -->
            <FormField v-slot="{ componentField }" name="colorId">
              <FormItem>
                <FormLabel class="text-sm font-medium">Color</FormLabel>
                <FormControl>
                  <Select v-bind="componentField" :disabled="isLoading">
                    <SelectTrigger class="h-10 rounded-lg">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="color in colors"
                        :key="color.id"
                        :value="color.id"
                      >
                        <div class="flex items-center gap-2">
                          <span
                            class="w-3.5 h-3.5 rounded-full border inline-block flex-shrink-0"
                            :style="{ backgroundColor: color.value }"
                          />
                          {{ color.name }}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>

          </div>
        </div>

        <!-- Section: Images -->
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-widest mb-4">Images</h2>
          <FormField v-slot="{ componentField }" name="images">
            <FormItem>
              <FormControl>
                <!-- Image Upload Area -->
                <div
                  class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer group"
                  @click="triggerImageUpload"
                  @dragover.prevent
                  @drop.prevent="handleImageDrop"
                >
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                      <Icon name="lucide:image-plus" class="h-6 w-6 transition-colors" />
                    </div>
                    <div>
                      <p class="text-sm font-medium">Click to upload images</p>
                      <p class="text-xs mt-1">PNG, JPG up to 10MB each</p>
                    </div>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    class="hidden"
                    @change="handleImageSelect"
                  />
                </div>

                <!-- Image Previews -->
                <div v-if="previewImages.length" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                  <div
                    v-for="(img, idx) in previewImages"
                    :key="idx"
                    class="relative group aspect-square rounded-lg overflow-hidden border"
                  >
                    <img :src="img" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      @click="removeImage(idx)"
                      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Icon name="lucide:x" class="h-5 w-5" />
                    </button>
                  </div>
                </div>

              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
        </div>

        <!-- Section: Visibility -->
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-widest mb-4">Visibility</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- Featured -->
            <FormField v-slot="{ value, handleChange }" name="isFeatured">
              <FormItem>
                <div class="flex items-start gap-4 p-4 rounded-xl border transition-colors">
                  <FormControl>
                    <Switch
                      :checked="value"
                      @update:checked="handleChange"
                      :disabled="isLoading"
                      class="mt-0.5"
                    />
                  </FormControl>
                  <div>
                    <FormLabel class="text-sm font-medium cursor-pointer">Featured Product</FormLabel>
                    <FormDescription class="text-xs mt-0.5">
                      Show this product on the homepage and featured sections.
                    </FormDescription>
                  </div>
                </div>
              </FormItem>
            </FormField>

            <!-- Archived -->
            <FormField v-slot="{ value, handleChange }" name="isArchived">
              <FormItem>
                <div class="flex items-start gap-4 p-4 rounded-xl border transition-colors">
                  <FormControl>
                    <Switch
                      :checked="value"
                      @update:checked="handleChange"
                      :disabled="isLoading"
                      class="mt-0.5"
                    />
                  </FormControl>
                  <div>
                    <FormLabel class="text-sm font-medium cursor-pointer">Archive Product</FormLabel>
                    <FormDescription class="text-xs mt-0.5">
                      Hide this product from the store without deleting it.
                    </FormDescription>
                  </div>
                </div>
              </FormItem>
            </FormField>

          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2 border-t">
          <Button
            type="submit"
            :disabled="isLoading"
            class="font-medium px-6 h-10 rounded-lg gap-2 transition-all"
          >
            <Icon v-if="isLoading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <Icon v-else name="lucide:check" class="h-4 w-4" />
            {{ actionLabel }}
          </Button>
          <Button
            type="button"
            variant="outline"
            :disabled="isLoading"
            @click="navigateTo('/admin/products')"
            class="h-10 px-4 rounded-lg"
          >
            Cancel
          </Button>
        </div>

      </form>
    </div>

    <!-- Alert Modal -->
    <AlertModal
      :isOpen="isAlertModalVisible"
      @onClose="isAlertModalVisible = false"
      @onConfirm="deleteProduct"
    />
  </div>
</template>

<script setup lang="ts">
import type { RouteParams } from "~~/types";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const { showError, showMessage, toggleLoading, isLoading } = useStore();
const route = useRoute();
const params = route.params as RouteParams;
const isAlertModalVisible = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const previewImages = ref<string[]>([]);

// ─── Computed ────────────────────────────────────────────────────────────────
const isEditing    = computed(() => !!params.productId && params.productId !== "new");
const title        = computed(() => isEditing.value ? "Edit Product"              : "Create Product");
const description  = computed(() => isEditing.value ? "Update product information" : "Add a new product to your store");
const actionLabel  = computed(() => isEditing.value ? "Save Changes"              : "Create Product");
const toastMessage = computed(() => isEditing.value ? "Product updated successfully" : "Product created successfully");

// ─── Mock data (replace with your API calls) ─────────────────────────────────
const { data: categories } = await useFetch('/api/admin/categories')
const { data: sizes } = await useFetch('/api/admin/sizes')
const { data: colors } = await useFetch('/api/admin/colors')

// ─── Fetch existing product if editing ───────────────────────────────────────
const { data: currentProduct } = await useFetch(
  `/api/admin/products/${params.productId}`,
  { immediate: isEditing.value },
);

// ─── Form ─────────────────────────────────────────────────────────────────────
const formSchema = toTypedSchema(productSchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: currentProduct.value
    ? {
        ...currentProduct.value,
        // @ts-ignore
        price: parseFloat(currentProduct.value.price),
      }
    : {
        name:       "",
        images:     [],
        price:      0,
        categoryId: "",
        sizeId:     "",
        colorId:    "",
        isFeatured: false,
        isArchived: false,
      },
});

// Populate preview images when editing
// @ts-ignore
if (currentProduct.value?.images?.length) {
  previewImages.value = currentProduct.value.Images.map((img: any) => img.url ?? img);
}

// ─── Image Handling ───────────────────────────────────────────────────────────
const triggerImageUpload = () => fileInput.value?.click();

const handleImageSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  console.log(Array.from(files))
  if (!files) return;
  addImageFiles(Array.from(files));
};

const handleImageDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (!files) return;
  addImageFiles(Array.from(files));
};

const addImageFiles = (files: File[]) => {
  files.forEach((file) => {
    // form.setFieldValue("images", [...form.values.images, file]);
    const reader = new FileReader();
    console.log(reader)
    reader.onload = (e) => {
      if (e.target?.result) {
        previewImages.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index: number) => {
  previewImages.value.splice(index, 1);
};

// ─── Submit ───────────────────────────────────────────────────────────────────
const onSubmit=()=>{
  console.log("submit");
  console.log(form.values);
}
// const onSubmit = form.handleSubmit(async (values) => {
//   toggleLoading(true);
//   try {
//     const url    = isEditing.value ? `/api/admin/products/${params.productId}` : "/api/admin/products";
//     const method = isEditing.value ? "PATCH" : "POST";

//     await $fetch(url, { method, body: { ...values, images: previewImages.value } });

//     showMessage({ title: toastMessage.value, variant: "success" });
//     navigateTo("/admin/products");
//   } catch (error) {
//     showError(handleError(error));
//   } finally {
//     toggleLoading(false);
//   }
// });

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteProduct = async () => {
  if (!isEditing.value) return;
  toggleLoading(true);
  try {
    await $fetch(`/api/admin/products/${params.productId}`, { method: "DELETE" });
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

<!-- <script setup lang="ts">
import type { RouteParams } from "~~/types";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const categories = await useFetch('/api/admin/categories')
const colors = await useFetch('/api/admin/colors')
const sizes = await useFetch('/api/admin/sizes')

const { showError, showMessage, toggleLoading, isLoading } = useStore();
const route = useRoute();
const params = route.params as RouteParams;
const isAlertModalVisible = ref(false);

const isEditing = computed(() => !!params.productId && params.productId !== "new");

const title = computed(() => isEditing.value ? "Edit Product" : "Create Product");
const description = computed(() => isEditing.value ? "Update product information" : "Add a new product to your store");
const actionLabel = computed(() => isEditing.value ? "Save Changes" : "Create");
const toastMessage = computed(() => isEditing.value ? "Product updated successfully" : "Product created successfully");

const { data: currentProduct } = await useFetch(
  `/api/admin/products/${params.productId}`,
  {
    immediate: isEditing.value,
  },
);

const formSchema = toTypedSchema(productSchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: currentProduct.value ? {
    ...currentProduct.value,
    // @ts-ignore
    price: parseFloat(currentProduct.value.price),
  } : {
    name: "",
    images: [],
    price: 0,
    categoryId: "",
    sizeId: "",
    colorId: "",
    isFeatured: false,
    isArchived: false,
  },
});

// Sync form values if currentProduct is loaded asynchronously
// watch(
//   () => currentProduct.value,
//   (newData) => {
//     if (newData) {
//       form.setValues({
//         name: newData.name,
//         categoryId: newData.categoryId,
//         colorId: newData.colorId,
//         sizeId: newData.sizeId,
//       });
//     }
//   },
//   { immediate: true },
// );

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values);
  toggleLoading(true);
  try {
    const url = isEditing.value
      ? `/api/admin/products/${params.productId}`
      : "/api/admin/products";

    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(url, {
      method,
      body: values,
    });

    showMessage({
      title: toastMessage.value,
      variant: "success",
    });

    navigateTo("/admin/products");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
});

const deleteProduct = async () => {
  if (!isEditing.value) return;

  toggleLoading(true);
  try {
    await $fetch(`/api/admin/products/${params.productId}`, {
      method: "DELETE",
    });

    showMessage({
      title: "Product deleted",
      variant: "destructive",
    });

    navigateTo("/admin/products");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
    isAlertModalVisible.value = false;
  }
};
</script>

<style scoped></style> -->
