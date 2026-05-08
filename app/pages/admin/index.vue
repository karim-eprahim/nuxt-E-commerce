<template>
  <div class="flex-col">
    <div class="flex-1 space-y-4 p-8 pt-6">
      <Heading 
        title="Dashboard" 
        description="Overview of your store performance" 
      />
      <Separator />

      <!-- Loading State -->
      <div v-if="pending" class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="i in 3" :key="i" class="h-[120px]">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-8 w-[120px] mb-2" />
            <Skeleton class="h-3 w-[80px]" />
          </CardContent>
        </Card>
        <Card class="col-span-full h-[400px]">
          <CardHeader>
            <Skeleton class="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="rounded-full bg-destructive/10 p-4 mb-4">
          <Icon name="lucide:alert-circle" class="h-8 w-8 text-destructive" />
        </div>
        <h3 class="text-lg font-semibold">Failed to load analytics</h3>
        <p class="text-muted-foreground max-w-xs mx-auto">
          Something went wrong while fetching the data. Please try again later.
        </p>
        <Button variant="outline" class="mt-4" @click="refresh">
          Try Again
        </Button>
      </div>

      <!-- Content -->
      <div v-else-if="analytics" class="space-y-4">
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AdminAnalyticsStatCard 
            title="Total Revenue" 
            :value="formatPrice(analytics.totalRevenue)"
            icon="lucide:dollar-sign"
            description="+20.1% from last month"
          />
          <AdminAnalyticsStatCard 
            title="Sales" 
            :value="`+${analytics.salesCount}`"
            icon="lucide:credit-card"
            description="+180.1% from last month"
          />
          <AdminAnalyticsStatCard 
            title="Products in Stock" 
            :value="analytics.stockcount"
            icon="lucide:package"
            description="Active products in your store"
          />
        </div>

        <Card class="col-span-4 overflow-hidden border-none shadow-sm">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent class="pl-2">
            <AdminAnalyticsOverview :data="analytics.graphData" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
});

const { data: analytics, pending, error, refresh } = await useFetch('/api/admin/analytics', {
  lazy: true
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
</script>

<style scoped></style>

