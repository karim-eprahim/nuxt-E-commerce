<script setup lang="ts">
// import type { Category } from "@/components/Admin/Category/columns";
// import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { MoreHorizontalIcon } from "lucide-vue-next";

const props = defineProps<{
    category:{
        id:string;
    }
}>()
const { toggleAlertModal,toggleLoading,showMessage,showError } = useStore();

const deleteCategory = async () => {
  toggleLoading(true);
  try {
    await $fetch(`/api/admin/categories/${props.category.id}`, {
      method: "DELETE",
    });

    showMessage({
      title: "Category deleted",
      variant: "destructive",
    });

    refreshNuxtData('categories')
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
    toggleAlertModal(false);
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
            <DropdownMenuItem @click="navigateTo(`/admin/categories/${category.id}`)">Edit</DropdownMenuItem>
            <DropdownMenuItem @click="toggleAlertModal(true)" variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <AlertModal @onConfirm="deleteCategory"></AlertModal>
</template>