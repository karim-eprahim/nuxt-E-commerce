<template>
  <section class="relative bg-background py-24 px-6 overflow-hidden">

    <!-- Subtle radial glows -->
    <div class="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
    <div class="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

    <div class="relative z-10 max-w-6xl mx-auto">

      <!-- ── Header ── -->
      <div class="mb-12">
        <!-- Label -->
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 text-[0.68rem] font-bold tracking-widest uppercase mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Featured Products
        </div>

        <!-- Title row -->
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-[-0.04em] bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-3">
              FEATURED
            </h2>
            <p class="text-muted-foreground text-sm leading-relaxed max-w-md">
              Curated selections from this season's most anticipated drops. Each piece
              meticulously chosen for design integrity and cultural impact.
            </p>
          </div>
          <NuxtLink :to="{ name: 'products' }" class="inline-flex cursor-pointer items-center gap-1.5 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-400 text-sm font-bold hover:bg-indigo-500/14 hover:border-indigo-500/40 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ProductCard v-for="(product, index) in products" :key="index" :product="product" />
      </div>

      <!-- ── Load More ── -->
      <div class="flex justify-center mt-10">
        <NuxtLink :to="{ name: 'products' }" class="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full border border-border/60 bg-secondary/30 text-sm font-semibold text-muted-foreground backdrop-blur-sm hover:bg-indigo-500/8 hover:border-indigo-500/25 hover:text-indigo-400 hover:translate-y-0.5 transition-all duration-200">
          See More Products
          <Icon name="lucide:shopping-cart" size="20" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
const activeCategory = ref()
const selectedColor = ref()
const selectedSize = ref()

// const products: Product[] = [
//   { name: 'Noir Essentials',   description: 'Premium black collection featuring architectural silhouettes', price: '$299', originalPrice: '$420', category: 'Apparel',     icon: '👔', gradient: ['#0f172a', '#1e3a5f'] },
//   { name: 'Tech Fusion',       description: 'Smart accessories blending tech and haute couture',           price: '$649',                        category: 'Electronics', icon: '⌚', gradient: ['#1a1040', '#2d1b69'] },
//   { name: 'Artisan Leather',   description: 'Hand-crafted leather goods from master artisans',             price: '$399', originalPrice: '$560', category: 'Accessories', icon: '👜', gradient: ['#2c0d00', '#5c2a00'] },
//   { name: 'Urban Motion',      description: 'Performance footwear for the modern nomad',                   price: '$189',                        category: 'Footwear',    icon: '👟', gradient: ['#0f172a', '#1e293b'] },
//   { name: 'Editorial Prints',  description: 'Limited edition fashion photography series',                  price: '$449', originalPrice: '$599', category: 'Art',         icon: '📸', gradient: ['#1a0030', '#300050'] },
//   { name: 'Timepiece Classic', description: 'Sustainable luxury watches with heritage craftsmanship',      price: '$899',                        category: 'Jewelry',     icon: '⏰', gradient: ['#0a0a20', '#1a1a40'] },
// ]

const { data: products } = await useFetch('/api/admin/products?isFeatured=true')

</script>