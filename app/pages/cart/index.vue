<template>
  <div class="min-h-[80vh] bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Icon name="lucide:shopping-cart" class="w-8 h-8 text-blue-600" />
          Your Shopping Cart
          <span v-if="items.length > 0" class="ml-2 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {{ quantity }} {{ quantity === 1 ? 'item' : 'items' }}
          </span>
        </h1>
        
        <Button 
          v-if="items.length > 0"
          @click="clearCart"
          variant="destructive"
          size="sm"
          >
          <Icon name="lucide:trash-2" class="w-4 h-4" />
          Clear Shopping Cart
        </Button>
      </div>

      <div v-if="items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Cart Items List -->
        <div class="lg:col-span-8 space-y-6">
          <div 
            v-for="item in items" 
            :key="item.product.id"
            class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div class="p-5 flex flex-col sm:flex-row gap-6">
              <!-- Product Image -->
              <div class="relative w-full sm:w-40 h-40 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                <img 
                  :src="item.product.images[0].url" 
                  :alt="item.product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <!-- Product Info -->
              <div class="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
                        {{ item.product.name }}
                      </h3>
                      <p class="text-sm text-slate-500 mt-1">
                        {{ item.product.category?.name || 'Category' }}
                      </p>
                    </div>
                    <Button 
                      @click="removeItem(item.product.id)"
                      size="icon-sm"
                      variant="ghost"
                      color="red"
                    >
                      <Icon name="lucide:x" class="w-5 h-5 text-red-500" />
                    </Button>
                  </div>

                  <!-- Options: Size & Color -->
                  <div class="mt-4 flex flex-wrap gap-4 items-center">
                    <div v-if="item.product.size" class="flex items-center gap-2">
                      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Size:</span>
                      <span class="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded capitalize">
                        {{ item.product.size.name }}
                      </span>
                    </div>
                    <div v-if="item.product.color" class="flex items-center gap-2">
                      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Color:</span>
                      <div class="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded">
                        <div 
                          class="w-3 h-3 rounded-full border border-slate-300"
                          :style="{ backgroundColor: item.product.color.value }"
                        ></div>
                        <span class="text-sm font-semibold text-slate-700 capitalize">
                          {{ item.product.color.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <!-- Quantity Controls -->
                  <div class="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1">
                    <Button 
                      @click="updateQuantity(item.product.id, -1)"
                      size="sm"
                      variant="ghost"
                      :disabled="item.quantity === 1"
                      
                      >
                      <Icon name="lucide:minus" class="w-4 h-4" />
                    </Button>
                    <span class="w-10 text-center font-bold text-slate-900">{{ item.quantity }}</span>
                    <Button 
                      @click="updateQuantity(item.product.id, 1)"
                      size="sm"
                      variant="ghost"
                      >
                      <Icon name="lucide:plus" class="w-4 h-4" />
                    </Button>
                  </div>

                  <!-- Price -->
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-400">Total:</span>
                    <span class="text-xl font-bold text-slate-900">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="lg:col-span-4 sticky top-24">
          <div class="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div class="p-8">
              <h2 class="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div class="space-y-4">
                <div class="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span class="font-semibold text-slate-900">${{ total.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>Shipping Estimate</span>
                  <span class="text-green-600 font-medium">Free</span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>Tax Estimate</span>
                  <span class="font-semibold text-slate-900">$0.00</span>
                </div>
                
                <div class="pt-6 border-t border-slate-100">
                  <div class="flex justify-between items-end">
                    <div>
                      <p class="text-sm text-slate-500 mb-1">Total Amount</p>
                      <p class="text-3xl font-black text-slate-900 tracking-tight">${{ total.toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                @click="onCheckout"
                size="lg"
                variant="default"
                class="w-full mt-3 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3"
                >
                <!-- class="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1" -->
                Proceed to Checkout
                <Icon name="lucide:arrow-right" class="w-5 h-5" />
              </Button>

              <div class="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 font-medium">
                <Icon name="lucide:shield-check" class="w-4 h-4 text-green-500" />
                Secure Checkout Guaranteed
              </div>
            </div>
            
            <!-- Additional Info -->
            <div class="bg-slate-50 p-6 border-t border-slate-100">
              <p class="text-xs text-slate-500 text-center leading-relaxed">
                Prices and shipping costs are not confirmed until you've reached checkout. 
                Shipping available worldwide with full tracking support.
              </p>
            </div>
          </div>
          
          <!-- Continue Shopping Link -->
          <NuxtLink 
            to="/products"
            class="mt-6 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            Continue Shopping
          </NuxtLink>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Icon name="lucide:shopping-bag" class="w-10 h-10 text-blue-600" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p class="text-slate-500 mb-8 max-w-xs text-center">
          Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
        </p>
        <NuxtLink 
          to="/products"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/25"
        >
          Start Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { items, total, quantity, removeItem, updateQuantity, clearCart } = useCart();
const { showMessage } = useStore();
const route = useRoute()

const onCheckout = async () => {
    const cartItems = items.value.map(item => item.product.id);
    try{
        const response = await $fetch('/api/checkout', {
            method: 'POST',
            body: cartItems
        })
        console.log(response);
        // navigateTo('/')
        if(response){
          //@ts-ignore
          window.location.href = response.url
        }
        clearCart();
    }catch(error){
        console.log(error);
        showMessage({
            title: "Checkout failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        })
    }
//   showMessage({
//     title: "Checkout initiated",
//     description: "Proceeding to secure payment gateway...",
//     variant: "success"
//   });
};

definePageMeta({
  title: 'Your Shopping Cart'
})

onMounted(() => {
    const success = route.query.success
    if(success === '1'){
        showMessage({
            title: "Checkout successful",
            description: "Your order has been placed successfully.",
            variant: "success"
        })
    }
    else if(success === '2'){
        showMessage({
            title: "Checkout failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        })
    }
})
</script>

<style scoped>
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>