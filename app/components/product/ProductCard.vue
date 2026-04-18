<template>
  <div
    class="group shadow-md flex flex-col rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/30 hover:shadow-[0_30px_70px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.1)]">
    <!-- Image Section -->
    <div class="relative h-64 overflow-hidden flex items-center justify-center">
      <!-- :style="{ background: `linear-gradient(135deg, #0f172a22, #1e3a5f22)` }" -->
      <!-- Animated Background Pattern -->
      <div class="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
        :style="{ background: `linear-gradient(135deg, #0f172a22, #1e3a5f22)` }">
        <div class="absolute inset-0"
          style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 24px 24px;">
        </div>
      </div>

      <!-- Carousel -->
      <Carousel class="absolute w-full h-full" @init-api="setApi">
        <CarouselContent class="absolute w-full h-full p-0 m-0">
          <CarouselItem class="w-full h-full p-0 m-0" v-for="(image, index) in product?.images" :key="index">
            <img :src="image?.url" alt="" class="w-full h-full object-cover" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <!-- Quick Actions Overlay -->
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button
          class="px-6 py-2.5 rounded-full bg-white text-gray-950 text-[0.75rem] font-bold shadow-xl hover:bg-indigo-50 hover:scale-105 transition-all">
          View Details
        </button>
      </div>

      <!-- Badges -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <div
          class="px-2.5 py-1 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md text-[0.6rem] font-black uppercase tracking-widest text-white/70">
          {{ product.category.name }}
        </div>
      </div>
      <div v-if="product.price"
        class="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-red-500/80 text-[0.6rem] font-black uppercase tracking-widest text-white shadow-lg">
        SALE
      </div>
    </div>

    <!-- Info Section -->
    <div class="p-6 flex flex-col flex-1 gap-4 relative">
      <div v-if="totalCount > 1" class="absolute py-2 text-center text-sm text-muted-foreground"
        style="transform: translate(50%, -120%); top: 0; right: 50%;">
        <ul class="flex items-center gap-2">
          <li v-for="(_, index) in totalCount" :key="index">
            <div class="w-4 h-4 rounded-full border cursor-pointer" @click="scrollToImage(index)"
              :class="current === index + 1 ? 'bg-indigo-500' : ''" />
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-bold text-foreground group-hover:text-indigo-400 transition-colors duration-300 mb-1">
          {{ product.name }}
        </h3>
        <!-- <p class="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {{ product.description }}
        </p> -->
      </div>

      <div class="mt-auto flex items-end justify-between">
        <div class="flex flex-col">
          <span v-if="product.price" class="text-xs text-muted-foreground/60 line-through mb-0.5">
            {{ product.price }}
          </span>
          <span
            class="text-2xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            {{ product.price }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="w-10 h-10 rounded-xl border border-border/40 bg-secondary/20 flex items-center justify-center text-muted-foreground hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300">
            <Icon name="lucide:heart" size="18" />
          </button>
          <button
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:scale-110 hover:shadow-indigo-500/40 transition-all duration-300">
            <Icon name="lucide:shopping-cart" size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselApi } from '@/components/ui/carousel'
import { ref, watch } from 'vue'

interface Product {
  name: string
  // description: string
  price: any
  originalPrice?: string
  category: any
  size: any
  color: any
  // icon: string
  images?: any
}


const props = defineProps<{
  product: Product
}>()

const api = ref<CarouselApi>()
const totalCount = ref(0)
const current = ref(0)

function setApi(val: CarouselApi) {
  api.value = val
}

function scrollToImage(index: number) {
  api.value?.scrollTo(index)
}

watch(api, (newApi) => {
  if (!newApi) return

  totalCount.value = newApi.scrollSnapList().length
  current.value = newApi.selectedScrollSnap() + 1

  newApi.on('select', () => {
    current.value = newApi.selectedScrollSnap() + 1
  })
})
</script>
