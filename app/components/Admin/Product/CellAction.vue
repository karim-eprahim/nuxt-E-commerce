<script setup lang="ts">
const props = defineProps<{
  products: {
    id: string;
  }
}>()
const { toggleLoading, showMessage, showError } = useStore();
const isAlertModalVisible = ref(false);
const deleteProduct = async () => {
  console.log(props.products.id)
  toggleLoading(true);
  try {
    await $fetch(`/api/admin/products/${props.products.id}`, {
      method: "DELETE",
    });

    showMessage({
      title: "Product deleted successfully",
      variant: "success",
    });

    await refreshNuxtData('products')
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
      <DropdownMenuItem class="p-0 m-0" @click="navigateTo(`/admin/products/${products.id}`)">
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
  <AlertModal :isOpen="isAlertModalVisible" @onConfirm="deleteProduct" @onClose="isAlertModalVisible = false">
  </AlertModal>
</template>