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
    <form>
        
    </form>
  </div>
</template>

<script setup lang="ts">
const title = ref("Edit Category");
const description = ref("Edit a category");
const toastMessage = ref("Category updated");
const action = ref("Save Changes");
const isEditing = ref(false);
</script>

<style scoped></style>
