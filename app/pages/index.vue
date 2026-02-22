<template>
  <div>
    <h1>Home Page</h1>
    <pre>{{ user }}</pre>
    <NuxtLink to="/admin">Admin</NuxtLink>
    <NuxtLink to="/auth/login">Login</NuxtLink>
    <NuxtLink to="/auth/register">Register</NuxtLink>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
const { user, clear } = useUserSession();
const logout = async () => {
  await clear();
  navigateTo("/auth/login");
};
</script>

<style scoped></style>
