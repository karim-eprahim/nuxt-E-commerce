<template>
    <div>
        <h1>Home Page</h1>
        <pre>{{ user }}</pre>
    </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
</script>

<style scoped>

</style>
