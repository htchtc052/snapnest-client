<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { User } from '~/entities/user'
import { useAvatarUpdateRequest } from '../api/useAvatarUpdateRequest'
import type {
  AvatarUpdateDto,
  AvatarUpdateFormResult,
} from '../contract/avatar-update.contract'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ (e: 'close', value: AvatarUpdateFormResult): void }>()

const formState = reactive<AvatarUpdateDto>({
  avatar: null,
})
const form = ref<Form<AvatarUpdateDto>>()
const previewUrl = ref<string | null>(null)

const { updateAvatarRequest } = useAvatarUpdateRequest()
const {
  execute: updateAvatar,
  isLoading: isUpdating,
} = useApiOperation(updateAvatarRequest)

const avatarPreviewUrl = computed(() => previewUrl.value ?? props.user.avatarUrl ?? undefined)

onBeforeUnmount(() => {
  revokePreviewUrl()
})

function cancel() {
  emit('close', { action: 'cancel' })
}

function onAvatarUpdate(file?: File | null) {
  form.value?.clear()
  formState.avatar = file ?? null

  revokePreviewUrl()

  if (!file) return

  previewUrl.value = URL.createObjectURL(file)
}

async function onSubmit(e: FormSubmitEvent<AvatarUpdateDto>) {
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

  const result = await updateAvatar(e.data.avatar)

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
  <UForm ref="form" :state="formState" class="space-y-4" @submit="onSubmit">
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
        :model-value="formState.avatar"
        accept="image/*"
        icon="i-heroicons-photo-20-solid"
        label="Choose avatar image"
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
