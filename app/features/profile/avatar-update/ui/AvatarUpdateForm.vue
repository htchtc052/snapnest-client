<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
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

function cancel() {
  emit('close')
}

function clearAvatarErrors() {
  form.value?.clear()
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
    emit('close', result.data)
    return
  }

  if (result.status === ApiResultStatus.Validation) {
    form.value?.setErrors(result.errors)
  }
}
</script>

<template>
  <UForm ref="form" :state="formState" class="space-y-4" @submit="onSubmit">
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
        class="w-full"
        @change="clearAvatarErrors"
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
