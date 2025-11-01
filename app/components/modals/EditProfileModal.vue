<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'

import { mapFormError } from '~/http/map-form-error'
import type { User } from '~/models/user'
import { updateAccount } from '~/api/account'
import {profileEditSchema, type ProfileUpdateDto} from "~/contracts/profile-edit.contract";

const props = defineProps<{ user: User }>()
const emit  = defineEmits<{ close: [boolean] }>()

const initial = computed<ProfileUpdateDto>(() => ({
  name: props.user.name ?? '',
  bio: props.user.bio ?? null,
  birth_date: props.user.birth_date ?? null
}))

const state = reactive<ProfileUpdateDto>({ ...initial.value })
const form  = ref<Form<ProfileUpdateDto>>()
const isLoading = ref(false)

async function onSubmit(e: FormSubmitEvent<ProfileUpdateDto>) {
  isLoading.value = true
  form.value?.clear()
  try {
    await updateAccount(e.data)
    emit('close', true)
  } catch (error: unknown) {
    const parsed = mapFormError(error)
    if (parsed.isValidationError) form.value?.setErrors(parsed.bag)
    else console.error(error)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  emit('close', false)
}
</script>


<template>
  <AppModal @close="closeModal">
    <template #title> Edit account info</template>
    <template #default>
      <UForm
          ref="form"
          :state="state"
          :schema="profileEditSchema"
          class="space-y-4"
          @submit="onSubmit"
      >
        <UFormField name="name" label="Your name">
          <UInput v-model="state.name" class="w-full"
          />
        </UFormField>

        <UFormField name="birth_date" label="Birth date">
          <UInput v-model="state.birth_date" type="date" class="w-full"/>
        </UFormField>

        <UFormField name="bio" label="Bio">
          <UTextarea v-model="state.bio" :rows="4" class="w-full"/>
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isLoading">
            Save changes
          </UButton>
        </div>
      </UForm>
    </template>
  </AppModal>
</template>
