<!-- <script setup lang="ts">
const colorMode = useColorMode()

const toggle = () => {
    colorMode.preference =
    colorMode.value === 'dark' ? 'light' : 'dark'
    console.log(colorMode.value)
}
</script>

<template>
    <UButton variant="ghost" :class="colorMode.value === 'dark' ? 'text-[#f7c143]' : 'text-[#528bb9]'" :icon="colorMode.value === 'dark'
        ? 'i-heroicons-sun'
        : 'i-heroicons-moon'" @click="toggle" />
</template> -->

<!-- <template>
    <Button variant="ghost" class="rounded-full" size="icon" @click="toggle">
        <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon v-else class="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
    </Button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const colorMode = useColorMode()

const toggle = () => {
    colorMode.preference =
    colorMode.value === 'dark' ? 'light' : 'dark'
    console.log(colorMode.value)
}
</script> -->

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference =
    colorMode.value === 'dark'
      ? 'light'
      : 'dark'
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleTheme"
  >
    <Sun
      v-if="colorMode.value === 'dark'"
      class="h-[2rem] w-[2rem]"
    />

    <Moon
      v-else
      class="h-[2rem] w-[2rem]"
    />

    <span class="sr-only">
      Toggle theme
    </span>
  </Button>
</template>