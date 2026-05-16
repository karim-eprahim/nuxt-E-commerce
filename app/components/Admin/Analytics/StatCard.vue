<template>
  <Card class="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
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
