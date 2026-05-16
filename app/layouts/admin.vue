<script setup lang="ts">
import SidebarLayout from '@/components/layouts/Sidebar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'


</script>

<template>
    <SidebarLayout color="slate">
        <!-- <Header /> -->
        <header class="border-b py-2 px-3 lg:px-6">
            <div class="flex items-center justify-between">
                <SidebarTrigger />
                <ThemeToggle />
            </div>
        </header>
        <!-- <div class="p-3 lg:p-6"> -->
        <div>
            <slot />
        </div>
    </SidebarLayout>
</template>