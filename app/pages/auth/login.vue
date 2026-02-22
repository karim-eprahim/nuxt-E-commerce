<script setup lang="ts">
// Nuxt 4 auto-imports ref and components by default
import { handelError } from "~~/server/utils/error";
const email = ref("admin@gmail.com");
const password = ref("admin123");

const { toggleLoading, showError, showMessage, isLoading } = useStore();
const { fetch: refreshSession } = useUserSession();

const onSubmit = async () => {
  toggleLoading(true);
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });
    await refreshSession();
    showMessage({
      title: "Welcom Back 👋",
      description: "You have successfully logged in",
      variant: "success",
    });
    await navigateTo("/");
  } catch (error: any) {
    const err = handelError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
};
</script>

<template>
  <div
    class="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <div
      class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
    >
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mr-2 h-6 w-6"
        >
          <path
            d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
          />
        </svg>
        Acme Inc
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;This dashboard has saved me countless hours of work and
            helped me deliver stunning designs to my clients faster than ever
            before.&rdquo;
          </p>
          <footer class="text-sm">Sofia Davis</footer>
        </blockquote>
      </div>
    </div>

    <div class="p-4 rounded-lg border md:p-0 md:border-none lg:p-8">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Login to account {{ isLoading }}
          </h1>
          <p class="text-sm text-muted-foreground">
            Enter your email below to access your dashboard
          </p>
        </div>

        <div class="grid gap-6">
          <form @submit.prevent="onSubmit">
            <div class="grid gap-4">
              <div class="grid gap-1">
                <Label class="sr-only" for="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  auto-capitalize="none"
                  auto-complete="email"
                  auto-correct="off"
                  :disabled="isLoading"
                  v-model="email"
                />
              </div>
              <div class="grid gap-1">
                <Label class="sr-only" for="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  :disabled="isLoading"
                  v-model="password"
                />
              </div>
              <Button :disabled="isLoading">
                <Icon name="mingcute:loading-fill" class="animate-spin" v-if="isLoading" />
                Sign In with Email
              </Button>
            </div>
          </form>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" type="button" :disabled="isLoading">
            Github
          </Button>
        </div>

        <p class="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="hover:text-primary underline underline-offset-4"
          >
            Sign Up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
