<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { signUpSchema, type SignUpDto, useSignUp } from '~/features/auth/sign-up'

definePageMeta({ layout: 'guest', sanctum: { guestOnly: true } })


const state = reactive<SignUpDto>({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const { signUp, isLoading } = useSignUp()
const form = ref<Form<SignUpDto>>()

async function onSubmit(e: FormSubmitEvent<SignUpDto>) {
  form.value?.clear()

  const errors = await signUp(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-center text-xl font-semibold">Sign up</h1>
    </template>
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
    <template #footer>
      <p class="text-center text-sm">
        Already have an account?
        <NuxtLink to="/login" class="text-primary">Sign&nbsp;in</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
