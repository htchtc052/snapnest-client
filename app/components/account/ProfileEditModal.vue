<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import BaseModal from '~/components/ui/containers/BaseModal.vue'
import { useProfileUpdate } from '~/composables/account/useProfileUpdate'
import { profileEditSchema, type ProfileUpdateDto } from '~/types/profile-update.contract'
import type { User } from '~/types/user.model'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ close: [boolean] }>()

const initial = computed<ProfileUpdateDto>(() => ({
  name: props.user.name ?? '',
  bio: props.user.bio ?? null,
  birthDate: props.user.birthDate ?? null
}))

const state = reactive<ProfileUpdateDto>({ ...initial.value })
const form = ref<Form<ProfileUpdateDto>>()
const { updateProfile, isUpdating } = useProfileUpdate()

async function onSubmit(e: FormSubmitEvent<ProfileUpdateDto>) {
  form.value?.clear()
  const result = await updateProfile(e.data)
  if (result === true) {
    emit('close', true)
  } else if (result) {
    form.value?.setErrors(result)
  }
}

function closeModal() {
  emit('close', false)
}
</script>


<template>
  <BaseModal @close="closeModal">
    <template #title> Edit account info</template>
    <template #default>
      <UForm ref="form" :state="state" :schema="profileEditSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Your name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField name="birthDate" label="Birth date">
          <UInput v-model="state.birthDate" type="date" class="w-full" />
        </UFormField>

        <UFormField name="bio" label="Bio">
          <UTextarea v-model="state.bio" :rows="4" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isUpdating">
            Save changes
          </UButton>
        </div>
      </UForm>
    </template>
  </BaseModal>
</template>
