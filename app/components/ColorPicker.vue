<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits(["update:modelValue"])

const color = ref(props.modelValue || "#000000")

watch(color, (val) => {
  emit("update:modelValue", val)
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        class="w-[120px] justify-start gap-2"
      >
        <span
          class="w-4 h-4 rounded border"
          :style="{ backgroundColor: color }"
        />
        {{ color }}
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-52 space-y-3">
      <input
        type="color"
        v-model="color"
        class="w-full h-10 cursor-pointer"
      />

      <Input
        v-model="color"
        placeholder="#000000"
      />
    </PopoverContent>
  </Popover>
</template>