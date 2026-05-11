<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { passwordResetSchema, type PasswordResetDto, usePasswordReset } from '~/features/password-reset'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })

const route = useRoute()

const state = reactive<PasswordResetDto>({
  token: route.params.token as string,
  email: typeof route.query.email === 'string' ? route.query.email : '',
  password: '',
  password_confirmation: '',
})

const { resetPassword, isLoading } = usePasswordReset()
const form = ref<Form<PasswordResetDto>>()

async function onSubmit(e: FormSubmitEvent<PasswordResetDto>) {
  form.value?.clear()

  const errors = await resetPassword(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Reset password</h1>
    </template>

    <UForm
      ref="form"
      :schema="passwordResetSchema"
      :state="state"
      class="space-y-4"
      method="post"
      autocomplete="on"
      novalidate
      @submit="onSubmit"
    >
      <UFormField name="email" label="Email" type="email">
        <UInput
          v-model="state.email"
          type="email"
          name="email"
          autocomplete="email"
          inputmode="email"
          autocapitalize="none"
          spellcheck="false"
          placeholder="you@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField name="password" label="New password">
        <UInput
          v-model="state.password"
          type="password"
          name="password"
          autocomplete="new-password"
          placeholder="Enter new password"
          class="w-full"
        />
      </UFormField>

      <UFormField name="password_confirmation" label="Confirm new password">
        <UInput
          v-model="state.password_confirmation"
          type="password"
          name="password_confirmation"
          autocomplete="new-password"
          placeholder="Confirm new password"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="isLoading">
        Reset password
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm">
        Back to sign in
        <NuxtLink to="/login" class="text-primary">here</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
