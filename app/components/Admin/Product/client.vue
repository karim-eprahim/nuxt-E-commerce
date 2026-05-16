<template>
  <div class="flex items-center justify-between">
    <Heading class="w-full" title="products" description="Manage your products">
      <template #action>
        <NuxtLink to="/admin/products/new">
          <Button>
            <Icon name="mdi:plus" class="mr-2 h-4 w-4" />
            Add New
          </Button>
        </NuxtLink>
      </template>
    </Heading>
  </div>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
    <div class="rounded-lg border bg-card p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Products</p>
      <p class="mt-2 text-2xl font-semibold">{{ products?.length || 0 }}</p>
    </div>
    <div class="rounded-lg border bg-card p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Variants</p>
      <p class="mt-2 text-2xl font-semibold">{{ variantCount }}</p>
    </div>
    <div class="rounded-lg border bg-card p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Available Stock</p>
      <p class="mt-2 text-2xl font-semibold">{{ availableStock }}</p>
    </div>
    <div class="rounded-lg border bg-card p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Archived</p>
      <p class="mt-2 text-2xl font-semibold">{{ archivedCount }}</p>
    </div>
  </div>

  <DataTable v-if="status !== 'pending'" :data="products || []" :columns="columns" columnToSearch="title" />
</template>

<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { columns, type Products } from "@/components/Admin/Product/columns"

const { data: products, status } = await useFetch<Products[]>("/api/admin/products", {
  key: "products",
});

const variantCount = computed(() =>
  (products.value || []).reduce((sum, product) => sum + (product.variants?.length || 0), 0),
);

const availableStock = computed(() =>
  (products.value || []).reduce((total, product) => {
    return total + (product.variants || []).reduce((sum, variant) => {
      const stock = variant.inventory?.stockQuantity || 0;
      const reserved = variant.inventory?.reservedQuantity || 0;
      return sum + stock - reserved;
    }, 0);
  }, 0),
);

const archivedCount = computed(() =>
  (products.value || []).filter((product) => product.isArchived).length,
);

</script>

<style scoped></style>

