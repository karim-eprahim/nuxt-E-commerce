<template>
  <div>
    <div class="flex items-center justify-between">
      <Heading class="w-full" :title="title" :description="description">
        <template #action>
          <Button v-if="isEditing" variant="destructive" size="sm">
            <Icon name="lucide:trash" class="h-4 w-4" />
          </Button>
        </template>
      </Heading>
    </div>
    <Separator />
    <form class="space-y-8 w-full mt-4">
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
  </div>
</template>

<script setup lang="ts">
import type { RouteParams } from "~~/types";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { categorySchema } from "@/../utils/validations";
import { handelError } from "@/../utils/error";

const { showError, showMessage, toggleLoading, isLoading } = useStore();
const title = ref("Edit Category");
const description = ref("Edit a category");
const toastMessage = ref("Category updated");
const action = ref("Save Changes");
const isEditing = ref(true);

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
    // if(isEditing.value) {
    //   await useFetch(`/api/admin/categories/${(route.params as RouteParams).categoryId}`, {
    //     method: "PUT",
    //     body: values,
    //   });
    // } else {
    //   await useFetch("/api/admin/categories", {
    //     method: "POST",
    //     body: values,
    //   });
    // }
    showMessage({
      title: title.value,
      variant: "success",
    });
  } catch (error) {
    const err = handelError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
});
</script>

<style scoped></style>
