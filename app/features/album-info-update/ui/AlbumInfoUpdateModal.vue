<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { albumInfoSchema, type AccountAlbum, type AlbumInfoDto } from '~/entities/album/model'
import { useAlbumInfoUpdateRequest } from '~/features/album-info-update/api/useAlbumInfoUpdateRequest'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { AlbumInfoUpdateModalResult } from '../contract/album-info-update.contract'

const props = defineProps<{ album: AccountAlbum }>()
const emit = defineEmits<{ (e: 'close', value: AlbumInfoUpdateModalResult): void }>()

const initial = computed<AlbumInfoDto>(() => ({
  name: props.album.name ?? '',
}))

const state = reactive<AlbumInfoDto>({ ...initial.value })
const form = ref<Form<AlbumInfoDto>>()
const { updateAlbumInfoRequest } = useAlbumInfoUpdateRequest()

const {
  execute: updateAlbumInfo,
  isLoading: isUpdating,
} = useApiOperation(updateAlbumInfoRequest)

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<AlbumInfoDto>) {
  form.value?.clear()
  const result = await updateAlbumInfo(props.album.id, e.data)

  if (result.status === ApiResultStatus.Success) {
    emit('close', { action: 'confirm', album: result.data })
    return
  }

  if (result.status === ApiResultStatus.Validation) {
    form.value?.setErrors(result.errors)
  }
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Rename album</template>

    <template #body>
      <UForm ref="form" :state="state" :schema="albumInfoSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Album name">
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
