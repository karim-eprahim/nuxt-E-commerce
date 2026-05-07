<template>
  <div>
    <h1>Admin Page</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
});

const { data: analytics, pending, error } = await useFetch('/api/admin/analytics',{
  lazy:true
})
</script>

<style scoped></style>
