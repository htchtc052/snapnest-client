<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { reactive, ref } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { albumInfoSchema, type AlbumInfoDto } from '~/entities/album/model'
import { usePrivateAlbumCreateRequest } from '../api/usePrivateAlbumCreateRequest'
import type { AlbumCreateFormResult } from '../contract/create-private-album.contract'

const emit = defineEmits<{ (e: 'close', value?: AlbumCreateFormResult): void }>()

const state = reactive<AlbumInfoDto>({
  name: '',
})

const form = ref<Form<AlbumInfoDto>>()
const { createPrivateAlbumRequest } = usePrivateAlbumCreateRequest()

const {
  execute: createPrivateAlbum,
  isLoading: isCreating,
} = useApiOperation(createPrivateAlbumRequest)

function cancel() {
  emit('close')
}

async function onSubmit(e: FormSubmitEvent<AlbumInfoDto>) {
  form.value?.clear()

  const result = await createPrivateAlbum(e.data)

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
  <UForm ref="form" :state="state" :schema="albumInfoSchema" class="space-y-4" @submit="onSubmit">
    <UFormField name="name" label="Album name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" @click="cancel">
        Cancel
      </UButton>

      <UButton type="submit" :loading="isCreating">
        Create
      </UButton>
    </div>
  </UForm>
</template>
