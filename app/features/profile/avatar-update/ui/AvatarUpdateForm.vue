<script setup lang="ts">
import { useAvatarUpdateForm } from '../model/useAvatarUpdate'

const emit = defineEmits<{ (e: 'close'): void }>()

const {
  form,
  formState,
  avatarUrl,
  userName,
  isUpdating,
  isUpdated,
  handleAvatarUpdate,
} = useAvatarUpdateForm(() => emit('close'))
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
