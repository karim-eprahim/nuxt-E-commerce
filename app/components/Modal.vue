<script setup lang="ts">
const props = defineProps<{
  isModalVisible: boolean;
  title?: string;
  description?: string;
}>();

const emit = defineEmits(["onClose"]);
const isOpen = computed({
  get: () => props.isModalVisible,
  set: (value) => emit("onClose", value),
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle v-if="title">{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4">
        <slot />
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
