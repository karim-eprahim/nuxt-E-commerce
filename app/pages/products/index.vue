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
                        <div class="relative group">
                            <Icon name="lucide:search"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-400 z-10 transition-colors"
                                size="18" />
                            <input type="text" placeholder="Search products..."
                                class="pl-10 pr-4 py-2.5 w-64 rounded-xl border border-border/50 bg-card/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all" />
                        </div>
                        <button
                            class="p-2.5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-md hover:bg-secondary/50 transition-all text-muted-foreground">
                            <Icon name="lucide:sliders-horizontal" size="20" />
                        </button>
                    </div>
                </div>
            </header>

            <div class="flex flex-col lg:flex-row gap-10">
                <!-- ── Sidebar Filters ── -->
                <aside class="w-full lg:w-72 shrink-0 space-y-10">
                    <!-- Categories -->
                    <div class="space-y-4">
                        <h3
                            class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                            <div class="w-1 h-4 bg-indigo-500 rounded-full" />
                            Categories
                        </h3>
                        <div class="grid grid-cols-2 lg:grid-cols-1 gap-2">
                            <button v-for="cat in categories" :key="cat"
                                class="flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200 group text-sm font-medium"
                                :class="activeCategory === cat ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-transparent border-border/40 text-muted-foreground hover:border-border/80 hover:bg-secondary/30'"
                                @click="activeCategory = cat">
                                {{ cat }}
                                <span
                                    class="text-[0.65rem] opacity-50 group-hover:opacity-100 transition-opacity">12</span>
                            </button>
                        </div>
                    </div>

                    <!-- Price Range -->
                    <div class="space-y-4">
                        <h3
                            class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                            <div class="w-1 h-4 bg-violet-500 rounded-full" />
                            Price Range
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-center gap-3">
                                <div class="relative flex-1">
                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-bold text-muted-foreground">$</span>
                                    <input type="number" placeholder="Min"
                                        class="w-full pl-6 pr-3 py-2 text-sm rounded-lg border border-border/40 bg-card/40 focus:outline-none focus:border-indigo-500/40" />
                                </div>
                                <div class="w-2 h-[1px] bg-border" />
                                <div class="relative flex-1">
                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-bold text-muted-foreground">$</span>
                                    <input type="number" placeholder="Max"
                                        class="w-full pl-6 pr-3 py-2 text-sm rounded-lg border border-border/40 bg-card/40 focus:outline-none focus:border-indigo-500/40" />
                                </div>
                            </div>
                            <!-- Simulated Slider Background -->
                            <div class="relative h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                <div
                                    class="absolute left-[10%] right-[30%] h-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                            </div>
                        </div>
                    </div>

                    <!-- Colors -->
                    <div class="space-y-4">
                        <h3
                            class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                            <div class="w-1 h-4 bg-blue-500 rounded-full" />
                            Colors
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            <button v-for="color in colors" :key="color.hex"
                                class="w-8 h-8 rounded-full border-2 transition-all p-0.5 hover:scale-110 active:scale-95"
                                :class="selectedColor === color.name ? 'border-indigo-500' : 'border-transparent'"
                                @click="selectedColor = color.name" :title="color.name">
                                <div class="w-full h-full rounded-full ring-1 ring-border/20"
                                    :style="{ backgroundColor: color.hex }" />
                            </button>
                        </div>
                    </div>

                    <!-- Sizes -->
                    <div class="space-y-4">
                        <h3
                            class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                            <div class="w-1 h-4 bg-amber-500 rounded-full" />
                            Sizes
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="size in sizes" :key="size"
                                class="min-w-[42px] h-10 flex items-center justify-center rounded-lg border text-xs font-bold transition-all"
                                :class="selectedSize === size ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-card/40 border-border/40 text-muted-foreground hover:border-border/80'"
                                @click="selectedSize = size">
                                {{ size }}
                            </button>
                        </div>
                    </div>

                    <!-- Reset bit -->
                    <button
                        class="w-full py-3 rounded-xl border border-dashed border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 text-xs font-bold text-muted-foreground hover:text-indigo-400 transition-all uppercase tracking-widest">
                        Reset Filters
                    </button>
                </aside>

                <!-- ── Main Content ── -->
                <main class="flex-1">
                    <!-- Active Tags -->
                    <div class="flex flex-wrap items-center gap-2 mb-8">
                        <span
                            class="text-sm font-medium text-muted-foreground mr-2 group flex items-center gap-1.5 cursor-default">
                            <Icon name="lucide:check-circle-2" class="text-indigo-500" size="14" />
                            Showing 24 products
                        </span>
                        <div v-if="activeCategory !== 'All'"
                            class="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[0.7rem] font-bold text-indigo-400 flex items-center gap-2">
                            {{ activeCategory }}
                            <button @click="activeCategory = 'All'">
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
import { ref } from 'vue'

interface Product {
    name: string
    description: string
    price: string
    originalPrice?: string
    category: string
    icon: string
    gradient: [string, string]
    images?: string[]
}

const activeCategory = ref('All')
const selectedColor = ref('Black')
const selectedSize = ref('M')

const categories = ['All', 'Apparel', 'Electronics', 'Accessories', 'Footwear', 'Art', 'Jewelry']

const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Indigo', hex: '#6366F1' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Amber', hex: '#F59E0B' }
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL']

const products: Product[] = [
    { name: 'Noir Essentials', description: 'Premium black collection featuring architectural silhouettes and breathable technical fabrics.', price: '$299', originalPrice: '$420', category: 'Apparel', icon: '👔', gradient: ['#0f172a', '#1e3a5f'], images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'] },
    { name: 'Tech Fusion 2.0', description: 'Next-gen smart accessories blending cutting-edge tech with minimalist aesthetic.', price: '$649', category: 'Electronics', icon: '⌚', gradient: ['#1a1040', '#2d1b69'], images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'] },
    { name: 'Artisan Bag', description: 'Hand-crafted full-grain leather goods aged to perfection by master artisans.', price: '$399', originalPrice: '$560', category: 'Accessories', icon: '👜', gradient: ['#2c0d00', '#5c2a00'], images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'] },
    { name: 'Urban Strider', description: 'High-performance comfort footwear designed for the modern urban landscape.', price: '$189', category: 'Footwear', icon: '👟', gradient: ['#0f172a', '#1e293b'], images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'] },
    { name: 'Vibrant Frames', description: 'Limited edition high-fidelity digital art prints on premium sustainable paper.', price: '$449', originalPrice: '$599', category: 'Art', icon: '📸', gradient: ['#1a0030', '#300050'], images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'] },
    { name: 'Solaris Chrono', description: 'Swiss-movement luxury timepieces featuring sapphire glass and celestial detailing.', price: '$899', category: 'Jewelry', icon: '⏰', gradient: ['#0a0a20', '#1a1a40'], images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'] },
]
</script>

<style scoped>
/* Custom Chrome/Safari hidden scrollbars */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>