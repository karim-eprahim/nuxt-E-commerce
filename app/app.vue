<template>
  <NuxtLoadingIndicator />
  <Toaster richColors />
  <NuxtLayout :name="layout">
    <NuxtPage/>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'
const { user } = useUserSession()
const route = useRoute()
const publicPages = ['/auth/Login' , '/auth/login' , '/auth/register']

const layout = computed(() => {
  if (publicPages.includes(route.path)) {
    return 'blank'
  } else if (user.value?.role === 'ADMIN' && !publicPages.includes(route.path)) {
    return 'admin'
  } else {
    return 'default'
  }
})
</script>