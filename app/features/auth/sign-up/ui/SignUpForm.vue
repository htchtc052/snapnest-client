<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { reactive, ref } from 'vue'
import { signUpSchema, type SignUpDto } from '../contract/sign-up.contract'
import { useSignUp } from '../model/useSignUp'

const state = reactive<SignUpDto>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const form = ref<Form<SignUpDto>>()
const { signUp, isLoading } = useSignUp()

async function onSubmit(e: FormSubmitEvent<SignUpDto>) {
  form.value?.clear()

  const errors = await signUp(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UForm ref="form" :schema="signUpSchema" :state="state" class="space-y-4" novalidate @submit="onSubmit">
    <UFormField name="name" label="Name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <UFormField name="email" label="Email">
      <UInput v-model="state.email" type="email" class="w-full" />
    </UFormField>

    <UFormField name="password" label="Password">
      <UInput v-model="state.password" type="password" class="w-full" />
    </UFormField>

    <UFormField name="password_confirmation" label="Confirm password">
      <UInput v-model="state.password_confirmation" type="password" class="w-full" />
    </UFormField>

    <UButton type="submit" block :loading="isLoading">
      Sign up
    </UButton>
  </UForm>
</template>
