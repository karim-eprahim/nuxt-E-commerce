<template>
  <div>
    <div class="flex items-center justify-between">
      <Heading class="w-full" :title="title" :description="description">
        <template #action>
          <Button
            @click="toggleAlertModal(true)"
            v-if="isEditing"
            variant="destructive"
            size="sm"
          >
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
            <FormLabel>Category Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Electronics, Clothing..."
                v-bind="componentField"
                :disabled="isLoading"
              />
            </FormControl>
            <FormDescription>
              This name will be displayed in the store.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <Button type="submit" :disabled="isLoading">
        <Icon name="lucide:save" class="h-4 w-4" />
        {{ actionLabel }}
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

const { showError, showMessage, toggleLoading, isLoading, toggleAlertModal } =
  useStore();
const route = useRoute();
const params = route.params as RouteParams;

const isEditing = computed(
  () => !!params.categoryId && params.categoryId !== "new",
);

const title = computed(() =>
  isEditing.value ? "Edit Category" : "Create Category",
);
const description = computed(() =>
  isEditing.value
    ? "Update category information"
    : "Add a new category to your store",
);
const actionLabel = computed(() =>
  isEditing.value ? "Save Changes" : "Create",
);
const toastMessage = computed(() =>
  isEditing.value
    ? "Category updated successfully"
    : "Category created successfully",
);

const { data: currentCategory } = await useFetch(
  `/api/admin/categories/${params.categoryId}`,
  {
    immediate: isEditing.value,
  },
);

const formSchema = toTypedSchema(categorySchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: currentCategory.value || {
    name: "",
  },
});

// Sync form values if currentCategory is loaded asynchronously
watch(
  () => currentCategory.value,
  (newData) => {
    if (newData) {
      form.setValues({
        name: newData.name,
      });
    }
  },
  { immediate: true },
);

const onSubmit = form.handleSubmit(async (values) => {
  toggleLoading(true);
  try {
    const url = isEditing.value
      ? `/api/admin/categories/${params.categoryId}`
      : "/api/admin/categories";

    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(url, {
      method,
      body: values,
    });

    showMessage({
      title: toastMessage.value,
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
  if (!isEditing.value) return;

  toggleLoading(true);
  try {
    await $fetch(`/api/admin/categories/${params.categoryId}`, {
      method: "DELETE",
    });

    showMessage({
      title: "Category deleted",
      variant: "destructive",
    });

    navigateTo("/admin/categories");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
    toggleAlertModal(false);
  }
};
</script>

<style scoped></style>
