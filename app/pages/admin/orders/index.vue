<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <Heading title="Orders" description="Manage order status, payment state, fulfillment, and immutable item snapshots." />

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select v-model="filters.status">
          <SelectTrigger>
            <SelectValue placeholder="Order status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All orders</SelectItem>
            <SelectItem v-for="status in orderStatuses" :key="status" :value="status">{{ label(status) }}</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="filters.paymentStatus">
          <SelectTrigger>
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All payments</SelectItem>
            <SelectItem v-for="status in paymentStatuses" :key="status" :value="status">{{ label(status) }}</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="filters.fulfillmentStatus">
          <SelectTrigger>
            <SelectValue placeholder="Fulfillment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All fulfillment</SelectItem>
            <SelectItem v-for="status in fulfillmentStatuses" :key="status" :value="status">{{ label(status) }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="rounded-lg border bg-card p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Orders</p>
        <p class="mt-2 text-2xl font-semibold">{{ orders?.length || 0 }}</p>
      </div>
      <div class="rounded-lg border bg-card p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Revenue</p>
        <p class="mt-2 text-2xl font-semibold">{{ money(totalRevenue) }}</p>
      </div>
      <div class="rounded-lg border bg-card p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pending Payment</p>
        <p class="mt-2 text-2xl font-semibold">{{ pendingPaymentCount }}</p>
      </div>
      <div class="rounded-lg border bg-card p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Unfulfilled</p>
        <p class="mt-2 text-2xl font-semibold">{{ unfulfilledCount }}</p>
      </div>
    </div>

    <div v-if="status === 'pending'" class="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
      Loading orders...
    </div>

    <div v-else-if="!orders?.length" class="rounded-lg border border-dashed bg-card p-10 text-center">
      <Icon name="lucide:package-open" class="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
      <h3 class="font-semibold">No orders found</h3>
      <p class="mt-1 text-sm text-muted-foreground">New checkout orders will appear here with variant snapshots.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="rounded-lg border bg-card">
        <div class="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-semibold">{{ order.orderNumber }}</h3>
              <Badge :variant="order.status === 'CANCELLED' ? 'destructive' : 'secondary'">{{ label(order.status) }}</Badge>
              <Badge :variant="order.paymentStatus === 'PAID' ? 'default' : 'outline'">{{ label(order.paymentStatus) }}</Badge>
              <Badge variant="outline">{{ label(order.fulfillmentStatus) }}</Badge>
            </div>
            <p class="text-sm text-muted-foreground">
              {{ formatDate(order.createdAt) }} · {{ order.user?.email || "Guest checkout" }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-[560px]">
            <Select :model-value="order.status" @update:model-value="updateOrder(order, { status: $event })">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in orderStatuses" :key="status" :value="status">{{ label(status) }}</SelectItem>
              </SelectContent>
            </Select>
            <Select :model-value="order.paymentStatus" @update:model-value="updateOrder(order, { paymentStatus: $event })">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in paymentStatuses" :key="status" :value="status">{{ label(status) }}</SelectItem>
              </SelectContent>
            </Select>
            <Select :model-value="order.fulfillmentStatus" @update:model-value="updateOrder(order, { fulfillmentStatus: $event })">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in fulfillmentStatuses" :key="status" :value="status">{{ label(status) }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="divide-y">
          <div v-for="item in order.orderItems" :key="item.id" class="grid grid-cols-[64px_1fr] gap-4 p-4 md:grid-cols-[64px_1fr_auto] md:items-center">
            <div class="h-16 w-16 overflow-hidden rounded-md border bg-muted">
              <img v-if="item.snapshotImageUrl" :src="item.snapshotImageUrl" :alt="item.snapshotProductTitle" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground">
                <Icon name="lucide:image-off" class="h-5 w-5" />
              </div>
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-medium">{{ item.snapshotProductTitle }}</p>
                <Badge variant="outline">{{ item.snapshotSku }}</Badge>
              </div>
              <p class="text-sm text-muted-foreground">{{ item.snapshotVariantTitle }}</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="option in snapshotOptions(item)"
                  :key="`${item.id}-${option.name}`"
                  class="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  {{ option.name }}: {{ option.value }}
                </span>
              </div>
            </div>

            <div class="text-left md:text-right">
              <p class="font-semibold">{{ money(item.subtotal) }}</p>
              <p class="text-xs text-muted-foreground">{{ item.quantity }} x {{ money(item.unitPrice) }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 border-t bg-muted/30 p-4 text-sm md:grid-cols-5">
          <div>
            <p class="text-muted-foreground">Subtotal</p>
            <p class="font-medium">{{ money(order.subtotal) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Discount</p>
            <p class="font-medium">{{ money(order.discountAmount) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Tax</p>
            <p class="font-medium">{{ money(order.taxAmount) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Shipping</p>
            <p class="font-medium">{{ money(order.shippingFee) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Total</p>
            <p class="font-semibold">{{ money(order.total) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"];
const fulfillmentStatuses = ["UNFULFILLED", "PARTIALLY_FULFILLED", "FULFILLED", "RETURNED"];

const filters = reactive({
  status: "ALL",
  paymentStatus: "ALL",
  fulfillmentStatus: "ALL",
});

const query = computed(() => ({
  ...(filters.status !== "ALL" ? { status: filters.status } : {}),
  ...(filters.paymentStatus !== "ALL" ? { paymentStatus: filters.paymentStatus } : {}),
  ...(filters.fulfillmentStatus !== "ALL" ? { fulfillmentStatus: filters.fulfillmentStatus } : {}),
}));

const { data: orders, status, refresh } = await useFetch<any[]>("/api/admin/orders", {
  key: "admin-orders",
  query,
  default: () => [],
});

const { showError, showMessage } = useStore();

const label = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const money = (value = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const snapshotOptions = (item: any) => Array.isArray(item.snapshotOptions) ? item.snapshotOptions : [];

const totalRevenue = computed(() =>
  (orders.value || []).reduce((total, order) => total + (order.paymentStatus === "PAID" ? order.total : 0), 0),
);

const pendingPaymentCount = computed(() =>
  (orders.value || []).filter((order) => order.paymentStatus === "PENDING").length,
);

const unfulfilledCount = computed(() =>
  (orders.value || []).filter((order) => order.fulfillmentStatus === "UNFULFILLED").length,
);

const updateOrder = async (order: any, payload: Record<string, unknown>) => {
  try {
    await $fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      body: payload,
    });
    await refresh();
    showMessage({ title: "Order updated", variant: "success" });
  } catch (error) {
    showError(handleError(error));
  }
};

definePageMeta({
  layout: "admin",
});
</script>
