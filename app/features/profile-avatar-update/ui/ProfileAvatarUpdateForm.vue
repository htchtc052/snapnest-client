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

onBeforeUnmount(() => {
  revokePreviewUrl()
})

function cancel() {
  emit('close', { action: 'cancel' })
}

function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  form.value?.clear()
  state.avatar = file

  revokePreviewUrl()

  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
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
      />
    </div>

    <UFormField name="avatar" label="Avatar image">
      <UInput
        type="file"
        accept="image/*"
        class="w-full"
        @change="onAvatarChange"
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
