<template>
  <Modal :isModalVisible="isModalVisible" title="Are You Sure?" description="This action cannot be undone." action="Continue" @onClose="emit('onClose')">
    <div class="flex items-center justify-end space-x-2">
      <Button variant="outline" @click="emit('onClose')">Cancel</Button>
      <Button :disabled="isLoading" variant="destructive" @click="onConfirm">
        <Spinner v-if="isLoading" class="animate-spin" />
        Continue
      </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
}>()
const { isLoading} = useStore();
const isModalVisible = computed(() => {
  return props.isOpen;
});
const emit = defineEmits(['onConfirm','onClose'])
const onConfirm = () => {
  emit('onConfirm')
}
</script>

<style scoped>

</style>