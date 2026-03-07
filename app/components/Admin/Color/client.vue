<template>
  <div class="flex items-center justify-between">
    <Heading class="w-full" title="Colors" description="Manage your colors">
      <template #action>
        <NuxtLink to="/admin/colors/new">
          <Button>
            <Icon name="mdi:plus" class="mr-2 h-4 w-4" />
            Add New
          </Button>
        </NuxtLink>
      </template>
    </Heading>
  </div>
  <DataTable v-if="status !== 'pending'" :data="colors || []" :columns="columns" columnToSearch="name" />
</template>

<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import { columns, type Color } from "@/components/Admin/Color/columns"

const { data: colors, status } = await useFetch<Color[]>("/api/admin/colors", {
  key: "colors",
});

</script>

<style scoped></style>
