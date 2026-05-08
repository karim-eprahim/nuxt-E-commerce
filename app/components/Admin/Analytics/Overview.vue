<template>
  <div class="h-[350px] w-full">
    <div v-if="!data || data.length === 0" class="flex h-full items-center justify-center text-muted-foreground">
      No data available
    </div>
    <div v-else class="flex h-full w-full items-end justify-between gap-2 px-2 pb-8 pt-4">
      <div 
        v-for="(item, index) in data" 
        :key="item.name"
        class="group relative flex flex-1 flex-col items-center justify-end h-full"
      >
        <!-- Bar -->
        <div 
          class="w-full max-w-[40px] rounded-t-md bg-primary transition-all duration-500 ease-out hover:bg-primary/80"
          :style="{ 
            height: `${(item.total / maxTotal) * 100}%`,
            transitionDelay: `${index * 50}ms`
          }"
        >
          <!-- Tooltip -->
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 rounded bg-foreground px-2 py-1 text-[10px] text-background transition-all group-hover:scale-100 whitespace-nowrap z-10">
            {{ formatCurrency(item.total) }}
          </div>
        </div>
        
        <!-- Label -->
        <span class="absolute -bottom-6 text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GraphData {
  name: string;
  total: number;
}

const props = defineProps<{
  data: GraphData[];
}>();

const maxTotal = computed(() => {
  const max = Math.max(...props.data.map((item) => item.total));
  return max === 0 ? 1 : max;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};
</script>

<style scoped>
/* Smooth entrance animation */
.bg-primary {
  transform-origin: bottom;
  animation: grow-up 1s ease-out forwards;
}

@keyframes grow-up {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
</style>
