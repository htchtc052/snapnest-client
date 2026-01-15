<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { reactive } from 'vue'
import BaseModal from '~/components/ui/containers/BaseModal.vue'
import { useAlbumUpdate } from '~/composables/account/useAlbumUpdate'
import { albumInfoSchema, type AlbumUpdateDto } from '~/types/album-info.contract'
import type { AlbumUpdateModalResult } from '~/types/album-update.contract'
import type { Album } from "~/types/album.model"

const props = defineProps<{ album: Album }>()
const emit = defineEmits<{ (e: 'close', value: AlbumUpdateModalResult): void }>()
const { updateAlbum, isUpdating } = useAlbumUpdate()

const state = reactive<AlbumUpdateDto>({ name: props.album.name })

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<AlbumUpdateDto>) {
  const updated = await updateAlbum(props.album.id, e.data)
  if (updated) {
    emit('close', { action: 'confirm', album: updated })
  }
}
</script>

<template>
  <BaseModal @close="closeModal">
    <template #title> Edit album info</template>
    <template #default>
      <UForm :state="state" :schema="albumInfoSchema" class="space-y-4" @submit="onSubmit">
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
  </BaseModal>
</template>
