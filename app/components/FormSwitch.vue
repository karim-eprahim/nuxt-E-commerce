<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  label?: string
  description?: string
  disabled?: boolean
}

const props = defineProps<Props>()
const modelValue = defineModel<boolean>({ default: false })

const toggle = () => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
}
</script>

<template>
  <div class="flex items-start gap-4 group">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      @click="toggle"
      :class="cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-inner',
        modelValue ? 'bg-primary' : 'bg-input'
      )"
    >
      <span
        aria-hidden="true"
        :class="cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          modelValue ? 'translate-x-5' : 'translate-x-0'
        )"
      />
    </button>

    <div 
      v-if="label || description" 
      class="flex flex-col select-none cursor-pointer pt-0.5 space-y-1"
      @click="toggle"
    >
      <span 
        v-if="label" 
        :class="cn(
          'text-sm font-semibold leading-none transition-colors duration-200',
          disabled ? 'text-muted-foreground/50' : 'text-foreground group-hover:text-primary'
        )"
      >
        {{ label }}
      </span>
      <p v-if="description" class="text-xs text-muted-foreground/80 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
