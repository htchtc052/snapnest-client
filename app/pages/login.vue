<script setup lang="ts">
import { loginSchema, type LoginDto } from '~/types/login.contract'

import type { Form, FormSubmitEvent } from '#ui/types'
import { useLogin } from '~/composables/auth/useLogin'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })

const route = useRoute()
const state = reactive<LoginDto>({ email: "", password: "" })

const { login, isLoading } = useLogin()
const form = ref<Form<LoginDto>>()

async function onSubmit(e: FormSubmitEvent<LoginDto>) {
  form.value?.clear()

  const errors = await login(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Sign in</h1>
    </template>

    <UForm
      ref="form"
      :schema="loginSchema"
      :state="state"
      class="space-y-4"
      method="post"
      autocomplete="on"
      novalidate
      @submit="onSubmit"
    >
      <UAlert
        v-if="route.query.reset === '1'"
        color="success"
        variant="soft"
        title="Password updated"
        description="Sign in with your new password."
      />

      <UFormField name="email" label="Email" type="email">
        <UInput
          v-model="state.email"
          type="email"
          name="email"
          autocomplete="username"
          inputmode="email"
          autocapitalize="none"
          spellcheck="false"
          placeholder="you@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField name="password" label="Password">
        <UInput
          v-model="state.password"
          type="password"
          name="password"
          autocomplete="current-password"
          placeholder="Enter password"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="isLoading">
        Sign in
      </UButton>
    </UForm>

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
