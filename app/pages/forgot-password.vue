<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import {
  passwordResetRequestSchema,
  type PasswordResetRequestDto,
  usePasswordResetRequest,
} from '~/features/auth/password-reset-request'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })

const state = reactive<PasswordResetRequestDto>({
  email: '',
})

const { sendResetLink, isLoading, statusMessage } = usePasswordResetRequest()
const form = ref<Form<PasswordResetRequestDto>>()

async function onSubmit(e: FormSubmitEvent<PasswordResetRequestDto>) {
  form.value?.clear()

  const errors = await sendResetLink(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Forgot password</h1>
    </template>

    <div class="space-y-4">
      <UAlert
        v-if="statusMessage"
        color="success"
        variant="soft"
        title="Check your email"
        :description="statusMessage"
      />

      <UForm
        ref="form"
        :schema="passwordResetRequestSchema"
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

        <UButton type="submit" block :loading="isLoading">
          Send reset link
        </UButton>
      </UForm>
    </div>

    <template #footer>
      <p class="text-center text-sm">
        Remembered your password?
        <NuxtLink to="/login" class="text-primary">Sign&nbsp;in</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
