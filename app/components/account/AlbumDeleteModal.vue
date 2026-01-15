<script setup lang="ts">
import BaseModal from '~/components/ui/containers/BaseModal.vue';
import { useAlbumDelete } from '~/composables/account/useAlbumDelete';
import type { AlbumDeleteModalResult } from '~/types/album-delete.contract';
import type { Album } from '~/types/album.model';

const props = defineProps<{ album: Album }>()
const emit = defineEmits<{ (e: 'close', value: AlbumDeleteModalResult): void }>()

const { deleteAlbum, isDeleting } = useAlbumDelete()

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onConfirm(): Promise<void> {
  const isSuccess = await deleteAlbum(props.album)
  if (isSuccess) {
    emit('close', { action: 'confirm' })
    return
  }
  emit('close', { action: 'cancel' })
}
</script>

<template>
  <BaseModal @close="closeModal">
    <template #title>Delete album?</template>

    Are you sure you want to delete
    <strong>{{ props.album.name }}</strong>?

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" :disabled="isDeleting" @click="closeModal">
        Cancel
      </UButton>
      <UButton type="button" color="error" :loading="isDeleting" @click="onConfirm">
        <Icon name="i-heroicons-trash-20-solid" class="mr-2 w-4 h-4" />
        Delete
      </UButton>
    </div>
  </BaseModal>
</template>
