<template>
  <div>
    <div class="flex items-center justify-between">
      <Heading class="w-full" :title="title" :description="description">
        <template #action>
          <Button @click="toggleAlertModal(true)" v-if="isEditing" variant="destructive" size="sm">
            <Icon name="lucide:trash" class="h-4 w-4" />
          </Button>
        </template>
      </Heading>
    </div>
    <Separator />
    <form @submit.prevent="onSubmit" class="space-y-8 w-full mt-4">
      <div class="md:grid md:grid-cols-3 md:gap-8">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Category Name" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              This is the name of the category.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <Button type="submit" :disabled="isLoading">
        <Icon name="lucide:save" class="h-4 w-4" />
        {{ action }}
      </Button>
    </form>

    <!-- <Modal :isModalVisible="isOpen" :title="title" :description="description" :action="action" @onClose="isOpen = $event"> -->
      <!-- <div class="grid gap-3">
            <Label for="name-1">Name</Label>
            <Input id="name-1" name="name" default-value="Pedro Duarte" />
          </div>
          <div class="grid gap-3">
            <Label for="username-1">Username</Label>
            <Input id="username-1" name="username" default-value="@peduarte" />
          </div> -->
    <!-- </Modal> -->
     <AlertModal @onConfirm="deleteCategory"></AlertModal>

  </div>
</template>

<script setup lang="ts">
import type { RouteParams } from "~~/types";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const { showError, showMessage, toggleLoading, isLoading, toggleAlertModal } = useStore();
const title = ref("Edit Category");
const description = ref("Edit a category");
const toastMessage = ref("Category updated");
const action = ref("Save Changes");
const isEditing = ref(false);

const route = useRoute();
const { data: currentCategory } = await useFetch(
  `/api/admin/categories/${(route.params as RouteParams).categoryId}`,
);
const formSchema = toTypedSchema(categorySchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: currentCategory.value || {
    name: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  toggleLoading(true);
  try {
    if(isEditing.value) {
      // await useFetch(`/api/admin/categories/${(route.params as RouteParams).categoryId}`, {
      //   method: "PUT",
      //   body: values,
      // });
      console.log("Editing",values)
    } else {
      await useFetch("/api/admin/categories", {
        method: "POST",
        body: values,
      });
    }
    showMessage({
      title: title.value,
      variant: "success",
    });
    navigateTo("/admin/categories");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
});

const deleteCategory = async () => {
  try {
    console.log("delete");
    toggleLoading(true);
    // await useFetch(`/api/admin/categories/${(route.params as RouteParams).categoryId}`, {
    //   method: "DELETE",
    // });
    showMessage({
      title: title.value,
      variant: "destructive",
    });
    // navigateTo("/admin/categories");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
};
</script>

<style scoped></style>
