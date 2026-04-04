<script setup lang="ts">
import Header from '~/components/layouts/Header.vue'
</script>

<template>
  <div>
    <Header />
    <!-- <div class="p-3 lg:p-6"> -->
    <div>
      <slot />
    </div>
  </div>
</template>