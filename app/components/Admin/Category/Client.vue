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
  <DataTable v-if="status !== 'pending'" :data="categories" :columns="columns" columnToSearch="name" />
</template>

<script setup lang="ts">
const categories = ref<{
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}[]>([])
const { data,status } = await useFetch("/api/admin/categories",{
  key:"categories",
});
categories.value = data.value as any[]
import DataTable from "@/components/DataTable.vue"
import { columns } from "@/components/Admin/Category/columns"

console.log(categories.value);
</script>

<style scoped></style>
