<template>
  <Card class="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        {{ title }}
      </CardTitle>
      <div v-if="icon" class="h-4 w-4 text-muted-foreground">
        <Icon :name="icon" class="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ value }}</div>
      <p v-if="description" class="text-xs text-muted-foreground mt-1">
        {{ description }}
      </p>
    </CardContent>
    <!-- Background Gradient Decoration -->
    <div 
      class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-3xl"
    ></div>
  </Card>
</template>

<script setup lang="ts">
interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon?: string;
  description?: string;
}

defineProps<AnalyticsCardProps>();
</script>
