<template>
  <template v-for="i in count" :key="i">
    <div
      class="group flex flex-col rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden animate-pulse"
    >
      <!-- Image area skeleton -->
      <div class="relative h-52 flex items-center justify-center overflow-hidden bg-muted/20">
        <!-- Center icon placeholder -->
        <Skeleton class="w-full h-full rounded" />
        
        <!-- Category chip skeleton -->
        <div class="absolute top-3 left-3">
          <Skeleton class="h-5 w-20 rounded-full" />
        </div>
      </div>

      <!-- Product info skeleton -->
      <div class="flex flex-col gap-3 p-4 flex-1">
        <div class="space-y-2">
          <!-- Title skeleton -->
          <Skeleton class="h-4 w-3/4" />
          <!-- Description skeletons -->
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-5/6" />
        </div>

        <!-- Price + actions skeleton -->
        <div class="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
          <!-- Price skeleton -->
          <Skeleton class="h-6 w-16" />

          <div class="flex items-center gap-1.5">
            <!-- Wishlist/Cart button skeletons -->
            <Skeleton class="w-8 h-8 rounded-full" />
            <Skeleton class="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 1
})
</script>
