<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { reactive, ref } from 'vue'
import {
  passwordResetRequestSchema,
  type PasswordResetRequestDto,
} from '../contract/password-reset-request.contract'
import { usePasswordResetRequest } from '../model/usePasswordResetRequest'

const state = reactive<PasswordResetRequestDto>({
  email: '',
})

const form = ref<Form<PasswordResetRequestDto>>()
const { sendResetLink, isLoading, statusMessage } = usePasswordResetRequest()

async function onSubmit(e: FormSubmitEvent<PasswordResetRequestDto>) {
  form.value?.clear()

  const errors = await sendResetLink(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
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
</template>
