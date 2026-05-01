<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { useProfileUpdateOperation } from '~/composables/features/useProfileUpdateOperation'
import { profileEditSchema, type ProfileUpdateDto } from '~/types/profile-update.contract'
import type { User } from '~/types/user.model'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ close: [boolean] }>()

const initial = computed<ProfileUpdateDto>(() => ({
  name: props.user.name ?? '',
}))

const state = reactive<ProfileUpdateDto>({ ...initial.value })
const form = ref<Form<ProfileUpdateDto>>()
const { updateProfile, isUpdating } = useProfileUpdateOperation()

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
  <UModal :close="{ onClick: closeModal }">
    <template #title>Edit account info</template>
    <template #body>
      <UForm ref="form" :state="state" :schema="profileEditSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Display name">
          <UInput v-model="state.name" class="w-full" />
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
  </UModal>
</template>
