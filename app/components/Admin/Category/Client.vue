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
</template>

<script setup lang="ts">
</script>

<style scoped></style>
