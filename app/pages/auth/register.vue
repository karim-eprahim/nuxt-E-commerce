<script setup lang="ts">
// Nuxt 4 state
// const name = ref("");
// const email = ref("");
// const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

type Payload = {
  name: string;
  email: string;
  password: string;
};

const form = ref<Payload>({
  name: "",
  email: "",
  password: "",
});

const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ""
  if (!checkConfirmPassword()) return
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: form.value,
    })
    navigateTo("/")
    isLoading.value = false
  } catch (error:any) {
    isLoading.value = false
    errorMessage.value = error.statusMessage
  }
}

const checkConfirmPassword = () => {
  if (form.value.password !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match"
    return false
  }
  return true
}
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
            &ldquo;Joining this platform was the best decision for our team's
            workflow.&rdquo;
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
            Create an account
          </h1>
          <p class="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        <div class="grid gap-6">
          <form @submit.prevent="onSubmit">
            <div class="grid gap-4">
              <div class="grid gap-1">
                <Label class="sr-only" for="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  auto-capitalize="words"
                  :disabled="isLoading"
                  v-model="form.name"
                  required
                />
              </div>

              <div class="grid gap-1">
                <Label class="sr-only" for="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  auto-capitalize="none"
                  auto-complete="email"
                  :disabled="isLoading"
                  v-model="form.email"
                  required
                />
              </div>

              <div class="grid gap-1">
                <Label class="sr-only" for="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  :disabled="isLoading"
                  v-model="form.password"
                  required
                />
              </div>

              <div class="grid gap-1">
                <Label class="sr-only" for="confirmPassword"
                  >Confirm Password</Label
                >
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  :disabled="isLoading"
                  v-model="confirmPassword"
                  required
                />
              </div>

              <Button :disabled="isLoading">
                <Icon name="mingcute:loading-fill" class="animate-spin" v-if="isLoading" />
                Create Account
              </Button>
            </div>
          </form>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <AuthSocialButton label="Github" icon="octicon:mark-github-24" />
        </div>

        <p class="px-8 text-center text-sm text-muted-foreground">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="hover:text-primary underline underline-offset-4"
          >
            Login
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
