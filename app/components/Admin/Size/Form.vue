<template>
  <div>
    <div class="flex items-center justify-between">
      <Heading class="w-full" :title="title" :description="description">
        <template #action>
          <Button
            @click="isAlertModalVisible = true"
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
            <FormLabel>Size Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Small, Medium, Large..."
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
        <FormField v-slot="{ componentField }" name="value">
          <FormItem>
            <FormLabel>Size Value</FormLabel>
            <FormControl>
              <div class="flex items-center gap-2">
                <Input
                placeholder="e.g. 38, 39, 40..."
                v-bind="componentField"
                :disabled="isLoading"
              />
              </div>
            </FormControl>
            <FormDescription>
              This name will be displayed in the store.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <Button type="submit" :disabled="isLoading">
        <!-- <Icon name="lucide:save" class="h-4 w-4" /> -->
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
    <AlertModal :isOpen="isAlertModalVisible" @onClose="isAlertModalVisible = false" @onConfirm="deleteSize"></AlertModal>
    <!-- <AlertModal  @onConfirm="deleteColor" @onClose="isAlertModalVisible = false"></AlertModal> -->

  </div>
</template>

<script setup lang="ts">
import type { RouteParams } from "~~/types";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const { showError, showMessage, toggleLoading, isLoading } = useStore();
const route = useRoute();
const params = route.params as RouteParams;
const isAlertModalVisible = ref(false);

const isEditing = computed(() => !!params.sizeId && params.sizeId !== "new");

const title = computed(() => isEditing.value ? "Edit Size" : "Create Size");
const description = computed(() => isEditing.value ? "Update size information" : "Add a new size to your store");
const actionLabel = computed(() => isEditing.value ? "Save Changes" : "Create");
const toastMessage = computed(() => isEditing.value ? "Size updated successfully" : "Size created successfully");

const { data: currentSize } = await useFetch(
  `/api/admin/sizes/${params.sizeId}`,
  {
    immediate: isEditing.value,
  },
);

const formSchema = toTypedSchema(sizeSchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: currentSize.value || {
    name: "",
    value: "",
  },
});

// Sync form values if currentSize is loaded asynchronously
watch(
  () => currentSize.value,
  (newData) => {
    if (newData) {
      form.setValues({
        name: newData.name,
        value: newData.value,
      });
    }
  },
  { immediate: true },
);

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values);
  toggleLoading(true);
  try {
    const url = isEditing.value
      ? `/api/admin/sizes/${params.sizeId}`
      : "/api/admin/sizes";

    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(url, {
      method,
      body: values,
    });

    showMessage({
      title: toastMessage.value,
      variant: "success",
    });

    navigateTo("/admin/sizes");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
});

const deleteSize = async () => {
  if (!isEditing.value) return;

  toggleLoading(true);
  try {
    await $fetch(`/api/admin/sizes/${params.sizeId}`, {
      method: "DELETE",
    });

    showMessage({
      title: "Color deleted",
      variant: "destructive",
    });

    navigateTo("/admin/sizes");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
    isAlertModalVisible.value = false;
  }
};
</script>

<style scoped></style>
