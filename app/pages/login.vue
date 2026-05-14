<script setup lang="ts">
import { SignInForm } from '~/features/auth/sign-in'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })

const route = useRoute()
const router = useRouter()
const toast = useToast()

onMounted(() => {
  if (route.query.reset !== '1') return

  toast.add({
    title: 'Password updated',
    description: 'Sign in with your new password.',
    color: 'success',
  })

  const query = { ...route.query }
  delete query.reset

  void router.replace({
    path: route.path,
    query,
  })
})
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Sign in</h1>
    </template>

    <SignInForm />

    <template #footer>
      <div class="text-center text-sm space-y-1">
        <p>
          Don’t have an account?
          <NuxtLink to="/register" class="text-primary">Sign&nbsp;up</NuxtLink>
        </p>
        <p>
          Forgot password?
          <NuxtLink to="/forgot-password" class="text-primary">Reset&nbsp;it</NuxtLink>
        </p>
      </div>
    </template>
  </UCard>
</template>
