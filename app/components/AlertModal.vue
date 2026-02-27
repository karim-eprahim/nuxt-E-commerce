<template>
  <Modal :isModalVisible="isModalVisible" title="Are You Sure?" description="This action cannot be undone." action="Continue" @onClose="toggleAlertModal(false)">
    <div class="flex items-center justify-end space-x-2">
      <Button variant="outline" @click="toggleAlertModal(false)">Cancel</Button>
      <Button variant="destructive" @click="onConfirm">Continue</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const { isLoading, isAlertModalVisible, toggleAlertModal} = useStore();
const isModalVisible = computed(() => {
  return isAlertModalVisible.value;
});
const emit = defineEmits(['onConfirm'])
const onConfirm = () => {
  emit('onConfirm')
}
</script>

<style scoped>

</style>