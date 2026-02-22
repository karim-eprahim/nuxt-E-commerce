export default defineNuxtRouteMiddleware(async(to, from) => {
    const { user } = useUserSession();
    if (!user.value) {
        return navigateTo("/auth/login");
    }
    if (user.value && user.value.role !== "ADMIN") {
        return navigateTo("/");
    }
})