<template>
  <div class="flex items-center justify-between">
    <Heading class="w-full" title="Sizes" description="Manage your sizes">
      <template #action>
        <NuxtLink to="/admin/sizes/new">
          <Button>
            <Icon name="mdi:plus" class="mr-2 h-4 w-4" />
            Add New
          </Button>
        </NuxtLink>
      </template>
    </Heading>
  </div>
  <DataTable v-if="status !== 'pending'" :data="sizes || []" :columns="columns" columnToSearch="name" />
</template>

<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { columns, type Size } from "@/components/Admin/Size/columns"

const { data: sizes, status } = await useFetch<Size[]>("/api/admin/sizes", {
  key: "sizes",
});

</script>

<style scoped></style>
