<template>
  <section class="relative bg-background py-12 px-6 overflow-hidden">
    <div class="relative z-10 max-w-6xl mx-auto">
      <div class="mb-8 flex items-end justify-between">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 text-[0.65rem] font-bold tracking-widest uppercase mb-3">
            <span class="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
            Special Promotions
          </div>
          <h2 class="text-3xl font-black tracking-tight text-foreground">Weekly Highlights</h2>
        </div>
      </div>

      <Carousel
        class="relative w-full group"
        @set-api="setApi"
        :opts="{
          align: 'start',
          loop: true,
        }"
      >
        <CarouselContent class="-ml-4">
          <CarouselItem v-for="(promo, index) in promos" :key="index" class="pl-4 md:basis-1/2 lg:basis-1/3">
            <div class="relative h-[480px] rounded-3xl overflow-hidden group/card border border-border/50">
              <!-- Background Image -->
              <div class="absolute inset-0 bg-secondary overflow-hidden">
                <img
                  :src="promo.image"
                  :alt="promo.title"
                  class="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                />
              </div>

              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <!-- Content -->
              <div class="absolute inset-x-0 bottom-0 p-8 flex flex-col items-start gap-4 transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                <div class="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-[0.65rem] font-black tracking-widest uppercase text-white/80">
                  {{ promo.tag }}
                </div>
                <div>
                  <h3 class="text-2xl font-black text-white leading-tight mb-2">{{ promo.title }}</h3>
                  <p class="text-sm text-white/70 font-medium leading-relaxed line-clamp-2">
                    {{ promo.description }}
                  </p>
                </div>
                <button class="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold shadow-xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300">
                  {{ promo.cta }}
                </button>
              </div>

              <!-- Top Left Badge -->
              <div v-if="promo.isNew" class="absolute top-6 left-6 px-3 py-1 rounded-md bg-indigo-500 text-white text-[0.65rem] font-black uppercase tracking-widest">
                New Drop
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>

        <!-- Navigation Buttons -->
        <div class="absolute -top-16 right-0 flex items-center gap-2">
           <CarouselPrevious class="static translate-y-0 h-10 w-10 border-border/60 bg-secondary/30 backdrop-blur-sm text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400" />
           <CarouselNext class="static translate-y-0 h-10 w-10 border-border/60 bg-secondary/30 backdrop-blur-sm text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400" />
        </div>
      </Carousel>

      <!-- Custom pagination indicators -->
      <div v-if="count > 0" class="mt-8 flex justify-center gap-2">
          <div
            v-for="i in count"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="i - 1 === current ? 'w-8 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'w-2 bg-border/60'"
          />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CarouselApi } from '@/components/ui/carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { watchOnce } from '@vueuse/core'

const api = ref<CarouselApi>()
const current = ref(0)
const count = ref(0)

function setApi(val: CarouselApi) {
  api.value = val
}

watchOnce(api, (api) => {
  if (!api) return

  count.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap()

  api.on('select', () => {
    current.value = api.selectedScrollSnap()
  })
})

interface Promo {
  title: string
  description: string
  tag: string
  cta: string
  image: string
  isNew?: boolean
}

const promos: Promo[] = [
  {
    title: 'Precision Timepieces',
    description: 'Explore the fusion of heritage craftsmanship and modern luxury in our latest watch collection.',
    tag: 'Luxury',
    cta: 'Discover More',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    isNew: true
  },
  {
    title: 'Urban Nomads',
    description: 'High-performance footwear designed for the rhythm of modern city life. Comfort meets style.',
    tag: 'Athleisure',
    cta: 'Shop Collection',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Minimalist Spaces',
    description: 'Artisanal home decor that transforms your living space into a sanctuary of modern calm.',
    tag: 'Lifestyle',
    cta: 'View Gallery',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Editorial Style',
    description: 'Bespoke tailoring that reflects the sophistication of the modern boardroom professional.',
    tag: 'Fashion',
    cta: 'Book Fitting',
    image: 'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=800',
    isNew: true
  }
]
</script>

<style scoped>
/* No scoped CSS needed - all Tailwind */
</style>
