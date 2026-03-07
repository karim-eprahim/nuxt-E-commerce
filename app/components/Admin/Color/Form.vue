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
            <FormLabel>Color Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Red, Blue..."
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
            <FormLabel>Color Value</FormLabel>
            <FormControl>
              <div class="flex items-center gap-2">
                <ColorPicker v-bind="componentField" />
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
    <AlertModal :isOpen="isAlertModalVisible" @onClose="isAlertModalVisible = false" @onConfirm="deleteColor"></AlertModal>
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

const isEditing = computed(() => !!params.colorId && params.colorId !== "new");

const title = computed(() => isEditing.value ? "Edit Color" : "Create Color");
const description = computed(() => isEditing.value ? "Update color information" : "Add a new color to your store");
const actionLabel = computed(() => isEditing.value ? "Save Changes" : "Create");
const toastMessage = computed(() => isEditing.value ? "Color updated successfully" : "Color created successfully");

const { data: currentColor } = await useFetch(
  `/api/admin/colors/${params.colorId}`,
  {
    immediate: isEditing.value,
  },
);

const formSchema = toTypedSchema(colorSchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: currentColor.value || {
    name: "",
    value: "#000000",
  },
});

// Sync form values if currentColor is loaded asynchronously
watch(
  () => currentColor.value,
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
      ? `/api/admin/colors/${params.colorId}`
      : "/api/admin/colors";

    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(url, {
      method,
      body: values,
    });

    showMessage({
      title: toastMessage.value,
      variant: "success",
    });

    navigateTo("/admin/colors");
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
});

const deleteColor = async () => {
  if (!isEditing.value) return;

  toggleLoading(true);
  try {
    await $fetch(`/api/admin/colors/${params.colorId}`, {
      method: "DELETE",
    });

    showMessage({
      title: "Color deleted",
      variant: "destructive",
    });

    navigateTo("/admin/colors");
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
