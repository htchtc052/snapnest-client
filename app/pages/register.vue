<script setup lang="ts">
import { SignUpForm } from '~/features/auth/sign-up'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Sign up</h1>
    </template>

    <SignUpForm />

    <template #footer>
      <p class="text-center text-sm">
        Already have an account?
        <NuxtLink to="/login" class="text-primary">Sign&nbsp;in</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
