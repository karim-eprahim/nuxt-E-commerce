<template>
  <div>
    <DashboardHeroSection />
    <DashboardPromoCarousel />
    <DashboardFeaturedSection />
    <DashboardFlashSection />
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
