<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { reactive, ref } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { User } from '~/entities/user'
import { useAvatarUpdateRequest } from '../api/useAvatarUpdateRequest'
import {
  avatarUpdateSchema,
  type AvatarUpdateDto,
} from '../contract/avatar-update.contract'

const emit = defineEmits<{ (e: 'close'): void }>()
const { user } = useSanctumAuth<User>()

const formState = reactive<AvatarUpdateDto>({
  avatar: null,
})
const form = ref<Form<AvatarUpdateDto>>()
const isUpdated = ref(false)

const { updateAvatarRequest } = useAvatarUpdateRequest()
const {
  execute: updateAvatar,
  isLoading: isUpdating,
} = useApiOperation(updateAvatarRequest)

async function onAvatarChange() {
  form.value?.clear()
  isUpdated.value = false

  if (!formState.avatar || isUpdating.value) return

  await form.value?.submit()
}

async function onSubmit(event: FormSubmitEvent<AvatarUpdateDto>) {
  form.value?.clear()

  if (!event.data.avatar) return

  const result = await updateAvatar(event.data.avatar)

  if (result.status === ApiResultStatus.Success) {
    formState.avatar = null
    user.value = result.data
    isUpdated.value = true
    setTimeout(() => emit('close'), 1200)

    return
  }

  if (result.status === ApiResultStatus.Validation) {
    isUpdated.value = false
    form.value?.setErrors(result.errors)
  }
}
</script>

<template>
  <UForm
    ref="form"
    :state="formState"
    :schema="avatarUpdateSchema"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="flex justify-center">
      <UAvatar
        :src="user?.avatarUrl || undefined"
        :alt="user?.name ?? ''"
        size="3xl"
        class="size-28 text-5xl ring-4 ring-default"
      />
    </div>

    <UAlert
      v-if="isUpdated"
      color="success"
      variant="soft"
      title="Avatar updated"
      description="Your new avatar is now visible in the profile."
    />

    <UFormField name="avatar">
      <UFileUpload
        v-model="formState.avatar"
        accept="image/*"
        icon="i-heroicons-photo-20-solid"
        label="Choose avatar image"
        description="Image file up to 5 MB"
        layout="list"
        size="md"
        :file-image="false"
        :disabled="isUpdating"
        class="mx-auto w-full max-w-3xl"
        @change="onAvatarChange"
      />
    </UFormField>

    <div v-if="isUpdating" class="space-y-2 pt-1">
      <UProgress size="sm" />
      <p class="text-sm text-muted">
        Uploading avatar...
      </p>
    </div>
  </UForm>
</template>
