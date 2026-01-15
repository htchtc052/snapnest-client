<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { computed, reactive } from 'vue';

import BaseModal from '~/components/ui/containers/BaseModal.vue';
import { useAlbumCreate } from '~/composables/account/useAlbumCreate';
import type { AlbumCreateDto, AlbumCreateModalResult } from '~/types/album-create.contracts';
import { albumInfoSchema } from '~/types/album-info.contract';

const props = defineProps<{ imageIds?: number[] }>()
const emit = defineEmits<{ (e: 'close', value: AlbumCreateModalResult): void }>()

const { createAlbum, isCreating } = useAlbumCreate()
const state = reactive<AlbumCreateDto>({ name: '' })

const statusText = computed(() => {
  if (!isCreating.value) return ''
  return props.imageIds?.length ? 'Creating album and adding images...' : 'Creating album...'
})

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<AlbumCreateDto>) {
  const album = await createAlbum({
    ...e.data,
    image_ids: props.imageIds?.length ? props.imageIds : undefined,
  })

  if (album) {
    emit('close', { action: 'confirm', album })
  }
}
</script>

<template>
  <BaseModal @close="closeModal">
    <template #title> Create new Album</template>
    <template #default>
      <div v-if="statusText" class="mb-2 flex items-center gap-2 text-sm text-gray-600">
        <Icon name="i-heroicons-arrow-path-20-solid" class="h-4 w-4 animate-spin" />
        <span>{{ statusText }}</span>
      </div>

      <UForm :state="state" :schema="albumInfoSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Album name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isCreating">
            Create album
          </UButton>
        </div>
      </UForm>
    </template>
  </BaseModal>
</template>
