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
          <a href="#" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-400 text-sm font-bold hover:bg-indigo-500/14 hover:border-indigo-500/40 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- ── Products Grid ── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="group flex flex-col rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_0_1px_rgba(99,102,241,0.15)]"
          :class="{ 'border-indigo-500/20 shadow-[0_0_0_1px_rgba(99,102,241,0.1)]': index === 0 }"
        >
          <!-- Image area -->
          <div
            class="relative h-52 flex items-center justify-center overflow-hidden"
            :style="{ background: `linear-gradient(145deg, ${product.gradient[0]}, ${product.gradient[1]})` }"
          >
            <!-- Quick-add overlay -->
            <div class="absolute inset-0 bg-black/55 backdrop-blur-[3px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[0.82rem] font-bold text-gray-900 shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Quick Add
              </button>
            </div>

            <!-- Product icon -->
            <div class="w-20 h-20 rounded-full border border-white/15 bg-white/8 flex items-center justify-center z-10 transition-transform duration-400 group-hover:scale-110">
              <span class="text-3xl">{{ product.icon }}</span>
            </div>

            <!-- Category chip -->
            <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full border border-white/10 bg-black/45 backdrop-blur-sm text-[0.62rem] font-bold uppercase tracking-widest text-white/60">
              {{ product.category }}
            </div>

            <!-- Sale badge -->
            <div v-if="product.originalPrice" class="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-500/80 text-[0.6rem] font-extrabold uppercase tracking-wide text-white">
              Sale
            </div>
          </div>

          <!-- Product info -->
          <div class="flex flex-col gap-3 p-4 flex-1">
            <div>
              <h3 class="text-sm font-bold text-foreground mb-0.5">{{ product.name }}</h3>
              <p class="text-[0.78rem] text-muted-foreground leading-relaxed line-clamp-2">{{ product.description }}</p>
            </div>

            <!-- Price + actions -->
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
              <div class="flex items-baseline gap-2">
                <span class="font-extrabold text-base bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {{ product.price }}
                </span>
                <s v-if="product.originalPrice" class="text-xs text-muted-foreground">{{ product.originalPrice }}</s>
              </div>

              <div class="flex items-center gap-1.5">
                <!-- Wishlist -->
                <button class="w-8 h-8 rounded-full border border-border/60 bg-secondary/30 flex items-center justify-center text-muted-foreground hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200" aria-label="Add to wishlist">
                  <Icon name="lucide:heart" size="15" />
                </button>
                <!-- Cart -->
                <button class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-[0_3px_10px_rgba(99,102,241,0.3)] hover:scale-110 hover:shadow-[0_5px_16px_rgba(99,102,241,0.45)] transition-all duration-200" aria-label="Add to cart">
                  <Icon name="lucide:shopping-cart" size="15" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Load More ── -->
      <div class="flex justify-center mt-10">
        <button class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/60 bg-secondary/30 text-sm font-semibold text-muted-foreground backdrop-blur-sm hover:bg-indigo-500/8 hover:border-indigo-500/25 hover:text-indigo-400 hover:translate-y-0.5 transition-all duration-200">
          Load More Products
          <Icon name="lucide:shopping-cart" size="20" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Product {
  name: string
  description: string
  price: string
  originalPrice?: string
  category: string
  icon: string
  gradient: [string, string]
}

const products: Product[] = [
  { name: 'Noir Essentials',   description: 'Premium black collection featuring architectural silhouettes', price: '$299', originalPrice: '$420', category: 'Apparel',     icon: '👔', gradient: ['#0f172a', '#1e3a5f'] },
  { name: 'Tech Fusion',       description: 'Smart accessories blending tech and haute couture',           price: '$649',                        category: 'Electronics', icon: '⌚', gradient: ['#1a1040', '#2d1b69'] },
  { name: 'Artisan Leather',   description: 'Hand-crafted leather goods from master artisans',             price: '$399', originalPrice: '$560', category: 'Accessories', icon: '👜', gradient: ['#2c0d00', '#5c2a00'] },
  { name: 'Urban Motion',      description: 'Performance footwear for the modern nomad',                   price: '$189',                        category: 'Footwear',    icon: '👟', gradient: ['#0f172a', '#1e293b'] },
  { name: 'Editorial Prints',  description: 'Limited edition fashion photography series',                  price: '$449', originalPrice: '$599', category: 'Art',         icon: '📸', gradient: ['#1a0030', '#300050'] },
  { name: 'Timepiece Classic', description: 'Sustainable luxury watches with heritage craftsmanship',      price: '$899',                        category: 'Jewelry',     icon: '⏰', gradient: ['#0a0a20', '#1a1a40'] },
]
</script>