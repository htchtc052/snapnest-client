<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { useRegister } from '~/composables/useRegister'
import { registrationSchema, type RegistrationDto } from '~/types/registration.contract'

definePageMeta({ layout: 'auth', sanctum: { guestOnly: true } })


const state = reactive<RegistrationDto>({
  name: 'Alonecat81+10',
  email: 'htchtc052+10@gmail.com',
  password: '',
  password_confirmation: ''
})

const { register, isLoading } = useRegister()
const form = ref<Form<RegistrationDto>>()

async function onSubmit(e: FormSubmitEvent<RegistrationDto>) {
  form.value?.clear()

  const errors = await register(e.data)
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
    <UForm ref="form" :schema="registrationSchema" :state="state" class="space-y-4" novalidate @submit="onSubmit">
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
