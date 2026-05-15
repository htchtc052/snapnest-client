<script setup lang="ts">
import type { Form } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { User } from '~/entities/user'
import { useAvatarUpdateRequest } from '../api/useAvatarUpdateRequest'
import type { AvatarUpdateDto } from '../contract/avatar-update.contract'

defineEmits<{ (e: 'close'): void }>()
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

const avatarUrl = computed(() => user.value?.avatarUrl ?? undefined)
const userName = computed(() => user.value?.name ?? '')

function handleAvatarUpdate(avatar: File | null | undefined) {
  formState.avatar = avatar ?? null
  form.value?.clear()
  isUpdated.value = false

  if (!avatar || isUpdating.value) return

  void uploadAvatar(avatar)
}

async function uploadAvatar(avatar: File) {
  form.value?.clear()

  const result = await updateAvatar(avatar)

  if (result.status === ApiResultStatus.Success) {
    formState.avatar = null
    user.value = result.data
    isUpdated.value = true

    return
  }

  if (result.status === ApiResultStatus.Validation) {
    isUpdated.value = false
    form.value?.setErrors(result.errors)
  }
}
</script>

<template>
  <UForm ref="form" :state="formState" class="space-y-4">
    <div class="flex justify-center">
      <UAvatar
        :src="avatarUrl"
        :alt="userName"
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
        @update:model-value="handleAvatarUpdate"
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
