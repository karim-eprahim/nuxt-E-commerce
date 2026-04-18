<template>
    <aside class="w-full lg:w-72 shrink-0 space-y-10">
        
        <!-- Categories -->
        <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                <div class="w-1 h-4 bg-indigo-500 rounded-full" />
                Categories
            </h3>
            <div class="grid grid-cols-2 lg:grid-cols-1 gap-2">
                <button v-for="cat in categories" :key="cat"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200 group text-sm font-medium"
                    :class="activeCategory?.name === cat.name ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-transparent border-border/40 text-muted-foreground hover:border-border/80 hover:bg-secondary/30'"
                    @click="activeCategory = cat">
                    {{ cat.name }}
                    <span class="text-[0.65rem] opacity-50 group-hover:opacity-100 transition-opacity">12</span>
                </button>
            </div>
        </div>

        <!-- Price Range -->
        <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
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
                    <div class="absolute left-[10%] right-[30%] h-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>
            </div>
        </div>

        <!-- Colors -->
        <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                <div class="w-1 h-4 bg-blue-500 rounded-full" />
                Colors
            </h3>
            <div class="flex flex-wrap gap-3">
                <button v-for="color in colors" :key="color.name"
                    class="w-8 h-8 rounded-full border-2 transition-all p-0.5 hover:scale-110 active:scale-95"
                    :class="selectedColor?.name === color.name ? 'border-indigo-500' : 'border-transparent'"
                    @click="selectedColor = color" :title="color.name">
                    <div class="w-full h-full rounded-full ring-1 ring-border/20"
                        :style="{ backgroundColor: color.value }" />
                </button>
            </div>
        </div>

        <!-- Sizes -->
        <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                <div class="w-1 h-4 bg-amber-500 rounded-full" />
                Sizes
            </h3>
            <div class="flex flex-wrap gap-2">
                <button v-for="size in sizes" :key="size"
                    class="min-w-[42px] h-10 flex items-center justify-center rounded-lg border text-xs font-bold transition-all"
                    :class="selectedSize?.name === size.name ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-card/40 border-border/40 text-muted-foreground hover:border-border/80'"
                    @click="selectedSize = size">
                    {{ size.name }}
                </button>
            </div>
        </div>

        <!-- Reset bit -->
        <button @click="resetFilters"
            class="w-full py-3 rounded-xl border border-dashed border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 text-xs font-bold text-muted-foreground hover:text-indigo-400 transition-all uppercase tracking-widest">
            Reset Filters
        </button>
    </aside>
</template>

<script setup lang="ts">
import { useNuxtData } from '#app'

// interface filterProps {
//     category: string
//     color: string
//     size: string
// }
// const props = defineProps<filterProps>()
const activeCategory = defineModel<any>('category')
const selectedColor = defineModel<any>('color')
const selectedSize = defineModel<any>('size')

const {data:cashedSizes} = useNuxtData('sizes')
const { data: sizes,status:sizeStatus } = await useFetch('/api/admin/sizes',{
    key:'sizes',
    default(){
        return cashedSizes.value
    }
})

const {data:cashedCategories} = useNuxtData('categories')
const { data: categories,status:categoryStatus } = await useFetch('/api/admin/categories',{
    key:'categories',
    default(){
        return cashedCategories.value
    }
})

const {data:cashedColors} = useNuxtData('colors')
const { data: colors,status:colorStatus } = await useFetch('/api/admin/colors',{
    key:'colors',
    default(){
        return cashedColors.value
    }
})

// const {data:cashedColors} = useNuxtData('colors')
// const {data:cashedSizes} = useNuxtData('sizes')

// const { data: colors } = await useFetch('/api/admin/colors')
// const { data: sizes } = await useFetch('/api/admin/sizes')

// console.log(categories.value)
// console.log(colors.value)
// console.log(sizes.value)

const resetFilters = () => {
  activeCategory.value = null
  selectedColor.value = null
  selectedSize.value = null
}
</script>