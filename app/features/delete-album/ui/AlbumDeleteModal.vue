<script setup lang="ts">
import type { AccountAlbum } from '~/entities/album/model'
import type { AlbumDeleteModalResult } from '../contract/delete-album.contract'

const props = defineProps<{ album: AccountAlbum }>()
const emit = defineEmits<{ (e: 'close', value: AlbumDeleteModalResult): void }>()

function closeModal() {
  emit('close', { action: 'cancel' })
}

function onConfirm(): void {
  emit('close', { action: 'confirm' })
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Delete album?</template>

    <template #body>
      <template v-if="props.album.name">
        Are you sure you want to delete
        <strong>{{ props.album.name }}</strong>?
      </template>
      <template v-else>
        Are you sure you want to delete this album?
      </template>

      <div class="flex gap-3 pt-2">
        <UButton variant="outline" type="button" @click="closeModal">
          Cancel
        </UButton>
        <UButton type="button" color="error" @click="onConfirm">
          <Icon name="i-heroicons-trash-20-solid" class="mr-2 w-4 h-4" />
          Delete
        </UButton>
      </div>
    </template>
  </UModal>
</template>
