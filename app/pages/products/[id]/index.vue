<template>
    <div class="relative min-h-screen bg-background text-foreground overflow-hidden">
        <!-- ── Ambient Background ── -->
        <div
            class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div
            class="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />
        <div
            class="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Breadcrumbs -->
            <nav class="flex mb-8 text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-left-4 duration-500">
                <NuxtLink to="/" class="hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <Icon name="lucide:home" size="14" />
                    Home
                </NuxtLink>
                <Icon name="lucide:chevron-right" class="mx-2 opacity-50" size="14" />
                <NuxtLink to="/products" class="hover:text-indigo-400 transition-colors">Products</NuxtLink>
                <Icon name="lucide:chevron-right" class="mx-2 opacity-50" size="14" />
                <span class="text-foreground truncate max-w-[200px]">{{ product?.name || 'Product' }}</span>
            </nav>

            <!-- Loading State -->
            <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div class="space-y-4">
                    <Skeleton class="aspect-square w-full rounded-3xl" />
                    <div class="flex gap-4">
                        <Skeleton class="h-24 w-24 rounded-2xl" v-for="i in 3" :key="i" />
                    </div>
                </div>
                <div class="space-y-6">
                    <Skeleton class="h-10 w-3/4 rounded-lg" />
                    <Skeleton class="h-6 w-1/4 rounded-lg" />
                    <Skeleton class="h-24 w-full rounded-lg" />
                    <div class="space-y-2">
                        <Skeleton class="h-6 w-1/3 rounded-lg" />
                        <div class="flex gap-2">
                            <Skeleton class="h-10 w-10 rounded-full" v-for="i in 4" :key="i" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
                <div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                    <Icon name="lucide:alert-circle" size="40" />
                </div>
                <h2 class="text-3xl font-bold mb-2">Product Not Found</h2>
                <p class="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
                <Button variant="outline" as-child>
                    <NuxtLink to="/products">Back to Store</NuxtLink>
                </Button>
            </div>

            <!-- Product Content -->
            <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                <!-- ── Image Gallery Section ── -->
                <div class="space-y-6 sticky top-24">
                    <div class="group relative aspect-square rounded-[2rem] border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-500 hover:border-indigo-500/30">
                        <!-- Animated Background -->
                        <div class="absolute inset-0 opacity-20 pointer-events-none"
                            :style="{ background: `linear-gradient(135deg, #4f46e522, #7c3aed22)` }">
                        </div>

                        <Carousel class="w-full h-full" @init-api="setApi">
                            <CarouselContent class="p-0 m-0">
                                <CarouselItem class="relative w-full h-full p-0 m-0" v-for="(image, index) in product.images" :key="index">
                                    <NuxtImg 
                                        :src="image.url" 
                                        :alt="product.name" 
                                        class="w-full h-full object-contain p-8 lg:p-12 transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious class="left-4 bg-background/50 backdrop-blur-md border-border/50 hover:bg-background transition-all" />
                            <CarouselNext class="right-4 bg-background/50 backdrop-blur-md border-border/50 hover:bg-background transition-all" />
                        </Carousel>

                        <!-- Featured Badge -->
                        <div v-if="product.isFeatured" class="absolute top-6 left-6">
                            <Badge class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 font-bold tracking-wider rounded-lg shadow-lg">
                                FEATURED
                            </Badge>
                        </div>
                    </div>

                    <!-- Thumbnails -->
                    <div v-if="product.images.length > 1" class="flex flex-wrap gap-4 px-2">
                        <button 
                            v-for="(image, index) in product.images" 
                            :key="index"
                            @click="scrollToImage(index)"
                            class="relative w-24 h-24 rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-card/40 backdrop-blur-sm"
                            :class="current === (index as number) + 1 ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105' : 'border-border/50 hover:border-indigo-500/50'"
                        >
                            <NuxtImg :src="image.url" class="w-full h-full object-cover" />
                        </button>
                    </div>
                </div>

                <!-- ── Info Section ── -->
                <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <Badge variant="outline" class="border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                {{ product.category.name }}
                            </Badge>
                            <div class="flex items-center gap-1 text-amber-500">
                                <Icon name="lucide:star" v-for="i in 5" :key="i" size="14" class="fill-amber-500" />
                                <span class="text-xs text-muted-foreground ml-1">(4.8 / 120 reviews)</span>
                            </div>
                        </div>
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                            {{ product.name }}
                        </h1>
                        <div class="flex items-baseline gap-4 mb-6">
                            <span class="text-4xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                                ${{ product.price }}
                            </span>
                            <span v-if="product.price > 0" class="text-xl text-muted-foreground/50 line-through">
                                ${{ (product.price * 1.2).toFixed(2) }}
                            </span>
                        </div>
                        <p class="text-muted-foreground text-lg leading-relaxed max-w-xl">
                            Premium {{ product.name }} designed for those who value quality and aesthetics. 
                            Carefully crafted to provide the best experience in the {{ product.category.name.toLowerCase() }} category.
                        </p>
                    </div>

                    <Separator class="bg-border/40" />

                    <!-- Options Selection -->
                    <div class="space-y-8">
                        <!-- Color Selection -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Color</span>
                                <span class="text-sm font-medium">{{ selectedVariant?.title || 'Default' }}</span>
                            </div>
                            <div class="flex flex-wrap gap-3">
                                <button v-for="value in optionValues('Color')" :key="value"
                                    class="min-w-10 h-10 rounded-full border px-3 text-xs font-bold"
                                    :class="selectedOptionValue('Color') === value ? 'border-indigo-500 opacity-100' : 'opacity-50'"
                                >
                                    {{ value }}
                                </button>
                            </div>
                        </div>

                        <!-- Size Selection -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Size</span>
                                <!-- <button class="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Size Guide</button> -->
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="size in optionValues('Size')"
                                    :key="size"
                                    class="px-5 py-2.5 rounded-xl border text-sm font-bold transition-all duration-300"
                                    :class="selectedOptionValue('Size') === size 
                                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                        : 'border-border/50 cursor-not-allowed bg-card/40 text-muted-foreground disabled'"
                                >
                                    {{ size }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Separator class="bg-border/40" />

                    <!-- Actions -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-1 p-1 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
                                <button @click="quantity > 1 ? quantity-- : null" class="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-secondary/50 transition-all text-muted-foreground">
                                    <Icon name="lucide:minus" size="18" />
                                </button>
                                <span class="w-12 text-center font-bold text-lg">{{ quantity }}</span>
                                <button @click="quantity++" class="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-secondary/50 transition-all text-muted-foreground">
                                    <Icon name="lucide:plus" size="18" />
                                </button>
                            </div>
                            
                            <button class="flex-1 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                <Icon name="lucide:shopping-bag" size="22" />
                                Add to Cart
                            </button>

                            <button class="w-14 h-14 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300">
                                <Icon name="lucide:heart" size="24" />
                            </button>
                        </div>
                        <button class="w-full h-14 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 font-bold hover:bg-indigo-500/10 transition-all">
                            Buy Now
                        </button>
                    </div>

                    <!-- Trust Badges -->
                    <div class="grid grid-cols-2 gap-4 pt-4">
                        <div class="flex items-center gap-3 p-4 rounded-2xl border border-border/30 bg-card/20">
                            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Icon name="lucide:truck" size="20" />
                            </div>
                            <div>
                                <p class="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Free Shipping</p>
                                <p class="text-[0.65rem] text-muted-foreground/60 leading-tight">On orders over $150</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 p-4 rounded-2xl border border-border/30 bg-card/20">
                            <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                                <Icon name="lucide:shield-check" size="20" />
                            </div>
                            <div>
                                <p class="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Secure Payment</p>
                                <p class="text-[0.65rem] text-muted-foreground/60 leading-tight">100% Secure Checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Description & Future Sections ── -->
            <div v-if="product" class="mt-24 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <!-- Simple Tabs Logic Replacement -->
                <div class="space-y-10">
                    <div class="flex items-center gap-8 border-b border-border/40 overflow-x-auto pb-4 no-scrollbar">
                        <button 
                            v-for="tab in ['Description', 'Details', 'Reviews', 'Shipping']" 
                            :key="tab"
                            @click="activeTab = tab"
                            class="text-lg font-bold transition-all relative whitespace-nowrap"
                            :class="activeTab === tab ? 'text-indigo-400' : 'text-muted-foreground hover:text-foreground'"
                        >
                            {{ tab }}
                            <div v-if="activeTab === tab" class="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                        </button>
                    </div>

                    <div v-if="activeTab === 'Description'" class="max-w-4xl space-y-6">
                        <h3 class="text-2xl font-bold">Unmatched Quality & Style</h3>
                        <p class="text-muted-foreground leading-relaxed text-lg">
                            Elevate your everyday with the {{ product.name }}. Whether you're at work, traveling, or enjoying a night out, this piece from our {{ product.category.name }} collection is the perfect companion. Crafted from premium materials and finished with meticulous attention to detail, it embodies the perfect blend of functionality and modern design.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                            <div class="space-y-3">
                                <div class="flex items-center gap-2 font-bold">
                                    <Icon name="lucide:check-circle-2" class="text-indigo-500" size="18" />
                                    Ergonomic Design
                                </div>
                                <p class="text-sm text-muted-foreground">Optimized for comfort and ease of use in any environment.</p>
                            </div>
                            <div class="space-y-3">
                                <div class="flex items-center gap-2 font-bold">
                                    <Icon name="lucide:sparkles" class="text-indigo-500" size="18" />
                                    Premium Finish
                                </div>
                                <p class="text-sm text-muted-foreground">High-grade materials that ensure durability and a sleek look.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews Placeholder -->
                    <div v-if="activeTab === 'Reviews'" class="space-y-12">
                        <div class="flex flex-col md:flex-row gap-12 items-start">
                            <div class="p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-md w-full md:w-80 shrink-0">
                                <h4 class="text-xl font-bold mb-4">Customer Rating</h4>
                                <div class="text-5xl font-black mb-2">4.8</div>
                                <div class="flex items-center gap-1 text-amber-500 mb-2">
                                    <Icon name="lucide:star" v-for="i in 5" :key="i" size="20" class="fill-amber-500" />
                                </div>
                                <p class="text-sm text-muted-foreground">Based on 120 reviews</p>
                                
                                <div class="mt-8 space-y-3">
                                    <div v-for="i in [5, 4, 3, 2, 1]" :key="i" class="flex items-center gap-3">
                                        <span class="text-xs font-bold w-4 text-center">{{ i }}</span>
                                        <div class="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                                            <div class="h-full bg-indigo-500 rounded-full" :style="{ width: i === 5 ? '85%' : i === 4 ? '10%' : '5%' }" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex-1 space-y-8">
                                <div class="flex items-center justify-between pb-4 border-b border-border/20">
                                    <h4 class="text-xl font-bold">Recent Comments</h4>
                                    <Button variant="ghost" class="text-indigo-400 hover:text-indigo-300">View All</Button>
                                </div>
                                
                                <div class="text-center py-12 rounded-3xl border border-dashed border-border/50 bg-secondary/5">
                                    <div class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground/30">
                                        <Icon name="lucide:message-square-dashed" size="32" />
                                    </div>
                                    <p class="text-muted-foreground font-medium">Comments and Reviews section coming soon!</p>
                                    <p class="text-xs text-muted-foreground/60 mt-1">We're working on making this feature available for you.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Related Products Section -->
                <div class="space-y-8 hidden">
                    <div class="flex items-end justify-between">
                        <div>
                            <h3 class="text-3xl font-black tracking-tight">YOU MAY ALSO LIKE</h3>
                            <p class="text-muted-foreground">Handpicked alternatives based on your preference.</p>
                        </div>
                        <NuxtLink to="/products" class="text-indigo-400 font-bold hover:underline underline-offset-4 flex items-center gap-2">
                            Explore All
                            <Icon name="lucide:arrow-right" size="16" />
                        </NuxtLink>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Mock related products -->
                        <div v-for="i in 4" :key="i" class="group aspect-[4/5] rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm overflow-hidden p-4 flex flex-col transition-all hover:-translate-y-2 hover:border-indigo-500/30">
                            <div class="flex-1 rounded-xl bg-secondary/20 overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
                                <Skeleton v-if="i > 0" class="w-full h-full opacity-20" />
                            </div>
                            <div class="mt-4 space-y-1">
                                <div class="h-4 w-2/3 bg-muted rounded animate-pulse" />
                                <div class="h-4 w-1/3 bg-muted/60 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { CarouselApi } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const productId = route.params.id

// Fetch Product Data
const { data: product, pending, error } = await useFetch<any>(`/api/admin/products/${productId}`)

const selectedVariant = computed(() => product.value?.variants?.[0])
const optionValues = (name: string) =>
    product.value?.options?.find((option: any) => option.name === name)?.values?.map((value: any) => value.value) ?? []
const selectedOptionValue = (name: string) =>
    selectedVariant.value?.selections?.find((selection: any) => selection.value.option.name === name)?.value.value

// Carousel & Images Logic
const api = ref<CarouselApi>()
const current = ref(1)

function setApi(val: CarouselApi) {
    api.value = val
}

function scrollToImage(index: number | string) {
    api.value?.scrollTo(index as number)
}

watch(api, (newApi) => {
    if (!newApi) return
    current.value = newApi.selectedScrollSnap() + 1
    newApi.on('select', () => {
        current.value = newApi.selectedScrollSnap() + 1
    })
})

// UI State
const quantity = ref(1)
const activeTab = ref('Description')

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slide-in-from-left-4 {
    from { transform: translateX(-1rem); }
    to { transform: translateX(0); }
}

@keyframes slide-in-from-right-8 {
    from { transform: translateX(2rem); }
    to { transform: translateX(0); }
}

@keyframes slide-in-from-bottom-8 {
    from { transform: translateY(2rem); }
    to { transform: translateY(0); }
}

.animate-in {
    animation-duration: 0.5s;
    animation-fill-mode: both;
}

.fade-in {
    animation-name: fade-in;
}

.slide-in-from-left-4 {
    animation-name: slide-in-from-left-4;
}

.slide-in-from-right-8 {
    animation-name: slide-in-from-right-8;
}

.slide-in-from-bottom-8 {
    animation-name: slide-in-from-bottom-8;
}
</style>
