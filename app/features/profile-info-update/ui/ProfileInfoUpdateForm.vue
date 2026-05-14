<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { profileInfoSchema, type ProfileInfoDto } from '~/entities/user/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { User } from '~/entities/user'
import { useProfileInfoUpdateRequest } from '../api/useProfileInfoUpdateRequest'
import type { ProfileInfoUpdateFormResult } from '../contract/profile-info-update.contract'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ (e: 'close', value: ProfileInfoUpdateFormResult): void }>()

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

function cancel() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<ProfileInfoDto>) {
  form.value?.clear()

  const result = await updateProfileInfo(e.data)

  if (result.status === ApiResultStatus.Success) {
    emit('close', { action: 'confirm', user: result.data })
    return
  }

  if (result.status === ApiResultStatus.Validation) {
    form.value?.setErrors(result.errors)
  }
}
</script>

<template>
  <UForm ref="form" :state="state" :schema="profileInfoSchema" class="space-y-4" @submit="onSubmit">
    <UFormField name="name" label="Display name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" @click="cancel">
        Cancel
      </UButton>

      <UButton type="submit" :loading="isUpdating">
        Save changes
      </UButton>
    </div>
  </UForm>
</template>
