<template>
    <div class="relative min-h-screen bg-background text-foreground overflow-hidden">
        <!-- ── Ambient Background ── -->
        <div
            class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div
            class="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />
        <div
            class="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div class="relative z-10 max-w-[1400px] mx-auto px-6 py-12">
            <!-- ── Header Section ── -->
            <header class="mb-12">
                <div
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[0.7rem] font-bold tracking-widest uppercase mb-6">
                    <Icon name="lucide:sparkles" size="12" />
                    Our Collection
                </div>
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1
                            class="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                            THE STORE
                        </h1>
                        <p class="text-muted-foreground text-lg max-w-xl leading-relaxed">
                            Explore our meticulously curated selection of premium goods, where craftsmanship meets
                            contemporary vision.
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="relative group w-full">
                            <Icon name="lucide:search"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-400 z-10 transition-colors"
                                size="18" />
                            <input type="text" placeholder="Search products..."
                                class="w-full rounded-xl border bg-white/5 py-2 pl-9 pr-4 text-sm placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500/60 focus: focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>
                </div>
            </header>

            <div class="flex flex-col lg:flex-row gap-10">
                <div
                    class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
                <div
                    class="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />
                <div
                    class="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
                <!-- ── Sidebar Filters ── -->
                <ProductFilter v-model:category="activeCategory" v-model:color="selectedColor"
                    v-model:size="selectedSize" />

                <!-- ── Main Content ── -->
                <main class="flex-1">
                    <!-- Active Tags -->
                    <div class="flex flex-wrap items-center gap-2 mb-8">
                        <span
                            class="text-sm font-medium text-muted-foreground mr-2 group flex items-center gap-1.5 cursor-default">
                            <Icon name="lucide:check-circle-2" class="text-indigo-500" size="14" />
                            Showing 24 products
                        </span>
                        <div v-if="activeCategory"
                            class="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[0.7rem] font-bold text-indigo-400 flex items-center gap-2">
                            {{ activeCategory?.name }}
                            <button @click="activeCategory = null">
                                <Icon name="lucide:x" size="12" />
                            </button>
                        </div>
                    </div>

                    <!-- Products Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        <ProductCard v-for="(product, index) in products" :key="index" :product="product" />
                    </div>


                    <!-- Pagination -->
                    <div class="mt-16 flex justify-center">
                        <nav
                            class="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md">
                            <button
                                class="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary/50 transition-all">
                                <Icon name="lucide:chevron-left" size="20" />
                            </button>
                            <button v-for="p in 3" :key="p"
                                class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                                :class="p === 1 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-muted-foreground hover:bg-secondary/50'">
                                {{ p }}
                            </button>
                            <button
                                class="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary/50 transition-all">
                                <Icon name="lucide:chevron-right" size="20" />
                            </button>
                        </nav>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProductCard from '~/components/product/ProductCard.vue'
import { ref } from 'vue'

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

const { data: products } = await useFetch('/api/admin/products', {
    key: 'products',
    query: computed(() => ({
        categoryId: activeCategory.value?.id,
        colorId: selectedColor.value?.id,
        sizeId: selectedSize.value?.id
    })),
    watch: [activeCategory, selectedColor, selectedSize]
})

</script>

<style scoped>
/* Custom Chrome/Safari hidden scrollbars */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>