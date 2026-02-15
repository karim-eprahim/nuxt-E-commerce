<script setup lang="ts">
defineProps<{
  label: string;
  icon: string;
}>();
const authenticate = () => {
  window.location.href = "/api/auth/github";
};
</script>

<template>
  <Button variant="outline" type="button" @click="authenticate">
    <Icon :name="icon" />
    {{ label }}
  </Button>
</template>
