<template>
  <div class="flex items-center justify-between">
    <Heading class="w-full" title="Categories" description="Manage your categories">
      <template #action>
        <NuxtLink to="/admin/categories/new">
          <Button>
            <Icon name="mdi:plus" class="mr-2 h-4 w-4" />
            Add New
          </Button>
        </NuxtLink>
      </template>
    </Heading>
  </div>
  <DataTable v-if="status !== 'pending'" :data="categories || []" :columns="columns" columnToSearch="name" />
</template>

<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { columns, type Category } from "@/components/Admin/Category/columns"

const { data: categories, status } = await useFetch<Category[]>("/api/admin/categories", {
  key: "categories",
});

</script>

<style scoped></style>
