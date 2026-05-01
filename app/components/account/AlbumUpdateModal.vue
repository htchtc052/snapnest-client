<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { useAlbumUpdateOperation } from '~/composables/features/useAlbumUpdateOperation'
import { albumInfoSchema, type AlbumInfoDto, type AlbumUpdateModalResult } from '~/types/album-info.contract'
import type { AccountAlbum } from '~/types/account-album.model'

const props = defineProps<{ album: AccountAlbum }>()
const emit = defineEmits<{ (e: 'close', value: AlbumUpdateModalResult): void }>()

const initial = computed<AlbumInfoDto>(() => ({
  name: props.album.name ?? '',
}))

const state = reactive<AlbumInfoDto>({ ...initial.value })
const form = ref<Form<AlbumInfoDto>>()
const { updateAlbum, isUpdating } = useAlbumUpdateOperation()

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<AlbumInfoDto>) {
  form.value?.clear()
  const result = await updateAlbum(props.album.id, e.data)

  if (result.ok) {
    emit('close', { action: 'confirm', album: result.data })
    return
  }

  if (result.reason === 'validation') {
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
