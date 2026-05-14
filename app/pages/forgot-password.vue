<script setup lang="ts">
import { PasswordResetRequestForm } from '~/features/auth/password-reset-request'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Forgot password</h1>
    </template>

    <PasswordResetRequestForm />

    <template #footer>
      <p class="text-center text-sm">
        Remembered your password?
        <NuxtLink to="/login" class="text-primary">Sign&nbsp;in</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
