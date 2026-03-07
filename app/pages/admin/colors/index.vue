<template>
    <div class="flex flex-col gap-4">
        <div class="flex-1 space-y-4 p-8 pt-6">
            <AdminColorClient />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "admin",
})

</script>