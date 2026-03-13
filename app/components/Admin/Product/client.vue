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
  <DataTable v-if="status !== 'pending'" :data="products || []" :columns="columns" columnToSearch="name" />
</template>

<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { columns, type Products } from "@/components/Admin/Product/columns"

const { data: products, status } = await useFetch<Products[]>("/api/admin/products", {
  key: "products",
});

</script>

<style scoped></style>

