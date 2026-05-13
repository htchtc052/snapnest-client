<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from '#imports'
import { useWindowSize } from '@vueuse/core'
import {
  ImageSelectionBar,
  SelectableImageCard,
  useImageSelection,
  type ImageSelectionAction,
} from '~/features/image/image-selection'
import { useImageTrashActions } from '~/features/image/image-trash-actions'
import { useAccountTrashImages } from '../model/useAccountTrashImages'

const {
  images,
  isLoading,
  hasLoadError,
  isEmpty,
  removeImagesById,
} = useAccountTrashImages()

const imageSelection = useImageSelection()

const {
  deleteImages,
  isDeletingImages,
  isRestoringImages,
  restoreImages,
} = useImageTrashActions()

const selectionActions = computed<ImageSelectionAction[]>(() => [
  {
    key: 'restore',
    label: 'Restore',
    icon: 'i-heroicons-arrow-path-20-solid',
    onSelect: restoreSelected,
    loading: isRestoringImages.value,
  },
  {
    key: 'delete',
    label: 'Delete permanently',
    icon: 'i-heroicons-trash-20-solid',
    onSelect: deleteSelected,
    loading: isDeletingImages.value,
  },
])

const { width } = useWindowSize()
const lanes = computed(() => {
  return width.value < 640 ? 3 : 4
})

onMounted(() => {
  window.addEventListener('keydown', imageSelection.clearOnEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', imageSelection.clearOnEscape)
})

async function restoreSelected() {
  const restoredIds = await restoreImages(imageSelection.state.selectedIds.value)
  if (!restoredIds) return

  removeImagesById(restoredIds)
  imageSelection.clear()
}

async function deleteSelected() {
  const deletedIds = await deleteImages(imageSelection.state.selectedIds.value)
  if (!deletedIds) return

  removeImagesById(deletedIds)
  imageSelection.clear()
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div v-if="imageSelection.mode.isSelectionMode.value" class="mb-4">
      <ImageSelectionBar
        :selection="imageSelection"
        :actions="selectionActions"
      />
    </div>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="hasLoadError" description="Unable to load trash" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="Trash is empty" size="md" variant="naked" class="py-8" />

      <div v-else class="relative flex min-h-0 flex-1 flex-col">
        <UScrollArea
          v-slot="{ item: image }"
          :items="images"
          :virtualize="{ estimateSize: 240, gap: 12, lanes }"
          class="min-h-0 flex-1"
        >
          <SelectableImageCard :image="image" :selection="imageSelection" />
        </UScrollArea>
      </div>
    </template>
  </div>
</template>
