<script setup lang="ts">
import { LayoutDashboard,Tag, Home, Inbox, ShoppingCart, Users } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    url: '/admin/products',
    icon: Tag,
  },
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: Tag,
  },
  {
    title: 'Colors',
    url: '/admin/colors',
    icon: Tag,
  },
  {
    title: 'Sizes',
    url: '/admin/sizes',
    icon: Tag,
  },
  {
    title: 'Orders',
    url: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
  },
]
</script>

<template>
  <Sidebar collapsible="icon" class="bg-white">

    <!-- header  -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Icon name="logos:nuxt-icon" />
            </div>
            <div class="">
              <h2 class="font-bold text-xl">KShops</h2>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>



    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem class="hover:bg-secondary transition rounded-lg " :class="{ 'bg-secondary': item.url === $route.path }" v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child>
                <a :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- footer  -->
    <SidebarFooter>
      <SidebarMenu>
      <SidebarMenuItem class="bg-secondary hover:bg-secondary/80 transition rounded-lg py-2">
        <SidebarMenuButton as-child>
          <a href="/" target="_blank" class="w-full flex items-center justify-center gap-2">
            <Icon name="lucide:store" />
            <span>View Store</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton class="h-30">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div class="flex flex-col">
                  <span class="font-bold">karim Ebrahim</span>
                  <span class="text-sm">admin</span>
                </div>
                <Icon class="ml-auto" name="lucide:chevron-up" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" class="w-(--reka-popper-anchor-width)">
              <DropdownMenuItem>
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
