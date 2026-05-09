<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { profileInfoSchema, type ProfileInfoDto } from '~/entities/user/model'
import { ApiOperationResult, useApiOperation } from '~/shared/api'
import type { User } from '~/types/user.model'
import { useProfileInfoUpdateRequest } from '../api/useProfileInfoUpdateRequest'
import type { ProfileInfoUpdateModalResult } from '../contract/profile-info-update.contract'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ (e: 'close', value: ProfileInfoUpdateModalResult): void }>()

const initial = computed<ProfileInfoDto>(() => ({
  name: props.user.name ?? '',
}))

const state = reactive<ProfileInfoDto>({ ...initial.value })
const form = ref<Form<ProfileInfoDto>>()

const { updateProfileInfoRequest } = useProfileInfoUpdateRequest()

const {
  execute: updateProfileInfo,
  isLoading: isUpdating,
} = useApiOperation(updateProfileInfoRequest)

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<ProfileInfoDto>) {
  form.value?.clear()

  const result = await updateProfileInfo(e.data)

  if (result.status === ApiOperationResult.Success) {
    emit('close', { action: 'confirm', user: result.data })
    return
  }

  if (result.status === ApiOperationResult.Validation) {
    form.value?.setErrors(result.errors)
  }
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Edit account info</template>

    <template #body>
      <UForm ref="form" :state="state" :schema="profileInfoSchema" class="space-y-4" @submit="onSubmit">
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
