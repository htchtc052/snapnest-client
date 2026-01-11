<script setup lang="ts">
import { loginSchema, type LoginDto } from '~/contracts/login.contract';

import type { Form, FormSubmitEvent } from '#ui/types';
import { useLogin } from '~/http/composables/useLogin';
import { mapFormError } from "~/http/utils/handle-form-error";

definePageMeta({ layout: 'auth', sanctum: { guestOnly: true } })

const state = reactive<LoginDto>({ email: "htchtc052@gmail.com", password: "12301230" })

const isLoading = ref(false)
const form = ref<Form<LoginDto>>()

async function onSubmit(e: FormSubmitEvent<LoginDto>) {
  isLoading.value = true
  form.value?.clear()

  try {
    await useLogin(e.data)
  }
  catch (error: unknown) {
    const parsed = mapFormError(error)

    if (parsed.isValidationError)
      form.value?.setErrors(parsed.bag)
    else
      console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Sign in</h1>
    </template>

    <UForm ref="form" :schema="loginSchema" :state="state" class="space-y-4" novalidate @submit="onSubmit">
      <UFormField name="email" label="Email" type="email">
        <UInput v-model="state.email" type="string" placeholder="you@example.com" class="w-full" />
      </UFormField>

      <UFormField name="password" label="Password">
        <UInput v-model="state.password" type="password" placeholder="Enter password" class="w-full" />
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
