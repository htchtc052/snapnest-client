<script setup lang="ts">
import { PasswordResetForm } from '~/features/auth/password-reset'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })

const route = useRoute()
const token = String(route.params.token)
const email = typeof route.query.email === 'string' ? route.query.email : ''
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Reset password</h1>
    </template>

    <PasswordResetForm :token="token" :email="email" />

    <template #footer>
      <p class="text-center text-sm">
        Back to sign in
        <NuxtLink to="/login" class="text-primary">here</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
