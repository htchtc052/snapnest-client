<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { reactive, ref } from 'vue'
import { passwordResetSchema, type PasswordResetDto } from '../contract/password-reset.contract'
import { usePasswordReset } from '../model/usePasswordReset'

const props = defineProps<{
  token: string
  email?: string
}>()

const state = reactive<PasswordResetDto>({
  token: props.token,
  email: props.email ?? '',
  password: '',
  password_confirmation: '',
})

const form = ref<Form<PasswordResetDto>>()
const { resetPassword, isLoading } = usePasswordReset()

async function onSubmit(e: FormSubmitEvent<PasswordResetDto>) {
  form.value?.clear()

  const errors = await resetPassword(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
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
</template>
