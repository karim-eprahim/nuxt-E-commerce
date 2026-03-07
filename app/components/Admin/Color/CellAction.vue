<script setup lang="ts">
const props = defineProps<{
  color: {
    id: string;
  }
}>()
const { toggleLoading, showMessage, showError } = useStore();
const isAlertModalVisible = ref(false);
const deleteColor = async () => {
  toggleLoading(true);
  try {
    await $fetch(`/api/admin/colors/${props.color.id}`, {
      method: "DELETE",
    });

    showMessage({
      title: "Color deleted successfully",
      variant: "success",
    });

    await refreshNuxtData('colors')
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
    isAlertModalVisible.value = false;
  }
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <Icon name="lucide:more-horizontal" class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem class="p-0 m-0" @click="navigateTo(`/admin/colors/${color.id}`)">
        <Button variant="ghost" size="sm" class="w-full m-0 p-0 justify-start">
          <Icon name="lucide:edit" class="h-4 w-4  ml-2" />
          Edit
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem class="p-0 m-0" @click="isAlertModalVisible = true">
        <Button variant="ghost" size="sm"
          class="w-full m-0 p-0 justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500">
          <Icon name="lucide:trash" class="h-4 w-4  ml-2" />
          Delete
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <AlertModal :isOpen="isAlertModalVisible" @onConfirm="deleteColor" @onClose="isAlertModalVisible = false">
  </AlertModal>
</template>