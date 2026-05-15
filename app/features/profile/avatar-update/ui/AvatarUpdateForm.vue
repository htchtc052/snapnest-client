<script setup lang="ts">
import type { Form } from '#ui/types'
import { computed, reactive, ref, watch } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { User } from '~/entities/user'
import { useAvatarUpdateRequest } from '../api/useAvatarUpdateRequest'
import type {
  AvatarUpdateDto,
  AvatarUpdateFormResult,
} from '../contract/avatar-update.contract'

const emit = defineEmits<{ (e: 'close', value?: AvatarUpdateFormResult): void }>()
const { user } = useSanctumAuth<User>()

const formState = reactive<AvatarUpdateDto>({
  avatar: null,
})
const form = ref<Form<AvatarUpdateDto>>()

const { updateAvatarRequest } = useAvatarUpdateRequest()
const {
  execute: updateAvatar,
  isLoading: isUpdating,
} = useApiOperation(updateAvatarRequest)

const avatarUrl = computed(() => user.value?.avatarUrl ?? undefined)
const userName = computed(() => user.value?.name ?? '')

watch(() => formState.avatar, (avatar) => {
  form.value?.clear()

  if (!avatar || isUpdating.value) return

  void uploadAvatar(avatar)
})

function close() {
  emit('close')
}

function clearAvatarErrors() {
  form.value?.clear()
}

async function uploadAvatar(avatar: File) {
  form.value?.clear()

  const result = await updateAvatar(avatar)

  if (result.status === ApiResultStatus.Success) {
    emit('close', result.data)
    return
  }

  if (result.status === ApiResultStatus.Validation) {
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
        class="size-24 text-4xl ring-4 ring-default"
      />
    </div>

    <UFormField name="avatar" label="Avatar image">
      <UFileUpload
        v-model="formState.avatar"
        accept="image/*"
        icon="i-heroicons-photo-20-solid"
        label="Choose avatar image"
        description="Image file up to 5 MB"
        layout="list"
        size="lg"
        :file-image="false"
        :disabled="isUpdating"
        class="w-full"
        @change="clearAvatarErrors"
      />
    </UFormField>

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" :disabled="isUpdating" @click="close">
        Close
      </UButton>

      <UButton v-if="isUpdating" type="button" loading disabled>
        Uploading
      </UButton>
    </div>
  </UForm>
</template>
