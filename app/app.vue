<template>
  <NuxtLoadingIndicator />
  <Toaster richColors />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>