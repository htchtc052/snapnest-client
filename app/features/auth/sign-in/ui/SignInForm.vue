<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { reactive, ref } from 'vue'
import { signInSchema, type SignInDto } from '../contract/sign-in.contract'
import { useSignIn } from '../model/useSignIn'

const state = reactive<SignInDto>({
  email: '',
  password: '',
})

const form = ref<Form<SignInDto>>()
const { signIn, isLoading } = useSignIn()

async function onSubmit(e: FormSubmitEvent<SignInDto>) {
  form.value?.clear()

  const errors = await signIn(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="signInSchema"
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
</template>
