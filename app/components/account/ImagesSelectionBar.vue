<script setup lang="ts">
import { computed } from 'vue';
import AlbumSelectForImages from '~/components/account/AlbumSelectForImages.vue';
import ImageDeleteModal from '~/components/account/ImageDeleteModal.vue';
import ImageUpdateModal from '~/components/account/ImageUpdateModal.vue';
import { useOpenModal } from '~/composables/useOpenModal';
import { useSelectionStore } from '~/composables/useSelection';
import type { AttachImagesModalResult } from '~/types/image-attach.contract';
import type { DeleteImagesModalResult } from '~/types/image-delete.contract';
import type { ImageUpdateModalResult } from '~/types/image-update.contract';
import type { Image } from '~/types/image.model';

const props = withDefaults(defineProps<{ mode?: 'library' | 'album' }>(), {
  mode: 'library',
})
const emit = defineEmits<{
  (e: 'deleted' | 'removed', ids: number[]): void
  (e: 'updatedImage', image: Image): void
}>()
const { selectedIds, selectedImagesData, clearSelection, selectImages } = useSelectionStore()
const openAttachModal = useOpenModal<typeof AlbumSelectForImages, AttachImagesModalResult>(AlbumSelectForImages)
const openDeleteModal = useOpenModal<typeof ImageDeleteModal, DeleteImagesModalResult>(ImageDeleteModal)
const openUpdateModal = useOpenModal<typeof ImageUpdateModal, ImageUpdateModalResult>(ImageUpdateModal)
const selectedCount = computed(() => selectedIds.value.length)
const showClearToggle = computed(() => selectedCount.value > 1)
const canRename = computed(() => props.mode === 'library' && selectedCount.value === 1)
const selectionLabel = computed(() => {
  if (selectedCount.value === 1) {
    const selectedId = selectedIds.value[0]
    return selectedId ? selectedImagesData.value[selectedId]?.name ?? '1 selected' : '1 selected'
  }
  return `${selectedCount.value} selected`
})

async function confirmDelete() {
  const ids = selectedIds.value
  const modalResult = await openDeleteModal({ ids })
  if (modalResult.action === 'cancel') return
  if (modalResult.deletedIds?.length) {
    clearSelection()
    emit('deleted', modalResult.deletedIds)
    return
  }
}

async function renameImage() {
  const selectedId = selectedIds.value[0]
  const selected = selectedImagesData.value[selectedId]
  const modalResult = await openUpdateModal({ image: selected as Image })
  if (modalResult.action === 'cancel') return
  selectImages([{ id: modalResult.image.id, name: modalResult.image.name }])
  emit('updatedImage', modalResult.image)
}

async function addToAlbum() {
  const ids = selectedIds.value
  const modalResult = await openAttachModal({ imageIds: ids })
  if (modalResult.action === 'cancel') return

  clearSelection()
}

function removeFromAlbum() {
  const ids = selectedIds.value
  if (!ids.length) return
  emit('removed', ids)
}
</script>

<template>
  <div class="rounded-full bg-blue-700 px-4 py-2 text-white shadow-md">
    <div class="flex items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-3">
        <UCheckbox v-if="showClearToggle" :model-value="true" color="primary" @click.stop
          @update:model-value="clearSelection" />
        <div class="truncate text-sm font-semibold">
          {{ selectionLabel }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton v-if="props.mode === 'library'" icon="i-heroicons-folder-plus-20-solid" color="neutral" variant="ghost"
          size="sm" square class="text-white hover:bg-white/15" @click="addToAlbum" />
        <UButton v-else icon="i-heroicons-minus-circle-20-solid" color="neutral" variant="ghost" size="sm" square
          class="text-white hover:bg-white/15" @click="removeFromAlbum" />
        <UButton v-if="canRename" icon="i-heroicons-pencil-square-20-solid" color="neutral" variant="ghost" size="sm"
          square class="text-white hover:bg-white/15" @click="renameImage" />
        <UButton icon="i-heroicons-trash-20-solid" color="neutral" variant="ghost" size="sm" square
          class="text-white hover:bg-white/15" @click="confirmDelete" />
        <UButton icon="i-heroicons-x-mark-20-solid" color="neutral" variant="ghost" size="sm" square
          class="text-white hover:bg-white/15" @click="clearSelection" />
      </div>
    </div>
  </div>
</template>
