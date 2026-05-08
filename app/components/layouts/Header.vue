<script setup lang="ts">
import {
  Search,
  Sun,
  Moon,
  Heart,
  ShoppingCart,
  ShoppingBag,
} from "lucide-vue-next";
import ThemeToggle from '../ThemeToggle.vue'

const { user, clear } = useUserSession();
const logout = async () => {
  await clear();
  navigateTo("/auth/login");
};
const isDark = ref(false);
const searchQuery = ref("");
const { items, quantity } = useCart();


const navLinks = [
  { label: "Products", to: "/products" },
  { label: "Featured", to: "/featured" },
  { label: "New Arrivals", to: "/new-arrivals" },
];
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b shadow-lg">
    <div
      class="mx-auto flex h-16 max-w-screen-2xl items-center gap-6 px-4 lg:px-8"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <div
          class="flex h-9 w-9 text-white bg-blue-500 items-center justify-center rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.5)]"
        >
          <ShoppingBag class="h-5 w-5" />
        </div>
        <span class="text-xl font-bold tracking-tight"> KShops </span>
      </NuxtLink>

      <!-- Nav Links -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 active:bg-white/20"
          active-class=""
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Search Bar -->
      <div class="flex-1 max-w-xs lg:max-w-sm xl:max-w-md">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-xl border bg-white/5 py-2 pl-9 pr-4 text-sm placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500/60 focus: focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-1 ml-auto shrink-0">

        <ThemeToggle />

        <!-- Wishlist -->
        <button
          class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:text-rose-400 hover:bg-rose-500/10"
          title="Wishlist"
        >
          <Heart class="h-4.5 w-4.5" />
        </button>

        <!-- Cart -->
        <button
          class="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:text-blue-400 hover:bg-blue-500/10"
          title="Cart"
          @click="navigateTo('/cart')"
        >
          <!-- <ShoppingCart class="h-4.5 w-4.5" /> -->
          <Icon name="lucide:shopping-cart" size="20" />
          <span
            v-if="quantity > 0"
            class="absolute   -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold"
          >
            {{ quantity }}
          </span>
        </button>

        <!-- Divider -->
        <div class="mx-1 h-6 w-px" />

        <!-- Auth Buttons -->
        <div v-if="!user">
          <NuxtLink
            to="/login"
            class="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
          >
            Sign in
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="px-4 py-2 text-sm font-semibold rounded-xl   bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all duration-200 hover:bg-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95"
          >
            Sign up
          </NuxtLink>
        </div>

        <DropdownMenu v-else>
          <DropdownMenuTrigger as-child>
            <Avatar class="cursor-pointer">
              <AvatarImage
                :src="user?.avatarUrl || ''"
                :alt="user?.name || ''"
              />
              <AvatarFallback>{{ user?.name?.charAt(0) }}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top">
            <DropdownMenuItem>
              <NuxtLink
                to="/account"
                class="flex items-center gap-2 text-foreground w-full h-full cursor-pointer"
              >
                <Icon name="lucide:user" />
                <span>Account</span>
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="logout"
              class="text-red-500 hover:text-red-600 hover:bg-red-500/20 cursor-pointer"
            >
              <button
                class="flex items-center gap-2 text-red-500 w-full h-full"
              >
                <Icon name="lucide:log-out" />
                <span>Sign out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
