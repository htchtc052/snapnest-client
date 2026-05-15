<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { User } from '~/entities/user'
import { useProfileAvatarUpdateRequest } from '../api/useProfileAvatarUpdateRequest'
import type {
  ProfileAvatarUpdateDto,
  ProfileAvatarUpdateFormResult,
} from '../contract/profile-avatar-update.contract'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ (e: 'close', value: ProfileAvatarUpdateFormResult): void }>()

const state = reactive<ProfileAvatarUpdateDto>({
  avatar: null,
})
const form = ref<Form<ProfileAvatarUpdateDto>>()
const previewUrl = ref<string | null>(null)

const { updateProfileAvatarRequest } = useProfileAvatarUpdateRequest()
const {
  execute: updateProfileAvatar,
  isLoading: isUpdating,
} = useApiOperation(updateProfileAvatarRequest)

const avatarPreviewUrl = computed(() => previewUrl.value ?? props.user.avatarUrl ?? undefined)
const avatarUploadLabel = computed(() => state.avatar?.name ?? 'Choose avatar image')

onBeforeUnmount(() => {
  revokePreviewUrl()
})

function cancel() {
  emit('close', { action: 'cancel' })
}

function onAvatarUpdate(file?: File | null) {
  form.value?.clear()
  state.avatar = file ?? null

  revokePreviewUrl()

  if (!file) return

  previewUrl.value = URL.createObjectURL(file)
}

async function onSubmit(e: FormSubmitEvent<ProfileAvatarUpdateDto>) {
  form.value?.clear()

  if (!e.data.avatar) {
    form.value?.setErrors([
      {
        name: 'avatar',
        message: 'Choose an image',
      },
    ])
    return
  }

  const result = await updateProfileAvatar(e.data.avatar)

  if (result.status === ApiResultStatus.Success) {
    emit('close', { action: 'confirm', user: result.data })
    return
  }

  if (result.status === ApiResultStatus.Validation) {
    form.value?.setErrors(result.errors)
  }
}

function revokePreviewUrl() {
  if (!previewUrl.value) return

  URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}
</script>

<template>
  <UForm ref="form" :state="state" class="space-y-4" @submit="onSubmit">
    <div class="flex justify-center">
      <UAvatar
        :src="avatarPreviewUrl"
        :alt="props.user.name"
        size="3xl"
        class="size-24 text-4xl ring-4 ring-default"
      />
    </div>

    <UFormField name="avatar" label="Avatar image">
      <UFileUpload
        :model-value="state.avatar"
        accept="image/*"
        icon="i-heroicons-photo-20-solid"
        :label="avatarUploadLabel"
        description="Image file up to 5 MB"
        size="lg"
        :preview="false"
        class="w-full"
        @update:model-value="onAvatarUpdate"
      />
    </UFormField>

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" @click="cancel">
        Cancel
      </UButton>

      <UButton type="submit" :loading="isUpdating">
        Save avatar
      </UButton>
    </div>
  </UForm>
</template>
