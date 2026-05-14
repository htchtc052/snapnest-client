<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from '#imports'
import { useWindowSize } from '@vueuse/core'
import { useAlbumCoverUpdate } from '~/features/album/album-cover-update'
import { useRemoveImagesFromAlbumFeature } from '~/features/album/remove-images-from-album'
import type { AccountAlbum } from '~/entities/album/model'
import {
  ImageSelectionBar,
  SelectableImageCard,
  useImageSelection,
  type ImageSelectionAction,
} from '~/features/image/image-selection'
import { useAccountAlbumImages } from '../model/useAccountAlbumImages'

const props = defineProps<{
  albumId: number
}>()

const emit = defineEmits<{
  (event: 'album-updated', album: AccountAlbum): void
}>()

const {
  images,
  isLoading,
  hasLoadError,
  isEmpty,
  removeImagesById,
} = useAccountAlbumImages(props.albumId)

const imageSelection = useImageSelection()

const { isUpdatingAlbumCover, setAlbumCover } = useAlbumCoverUpdate()
const { isRemovingImages, removeImagesFromAlbum } = useRemoveImagesFromAlbumFeature()
const selectionActions = computed<ImageSelectionAction[]>(() => [
  {
    key: 'set-cover',
    label: 'Set as cover',
    icon: 'i-heroicons-photo-20-solid',
    onSelect: setSelectedImageAsCover,
    visible: imageSelection.mode.isSingleSelection.value,
    loading: isUpdatingAlbumCover.value,
  },
  {
    key: 'remove-from-album',
    label: 'Remove from album',
    icon: 'i-heroicons-folder-minus-20-solid',
    onSelect: removeSelectedImages,
    loading: isRemovingImages.value,
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

async function removeSelectedImages() {
  const removedIds = await removeImagesFromAlbum(props.albumId, imageSelection.state.selectedIds.value)
  if (!removedIds) return

  removeImagesById(removedIds)
  imageSelection.clear()
}

async function setSelectedImageAsCover() {
  if (imageSelection.state.selectedImageId.value === null) return

  const updatedAlbum = await setAlbumCover(props.albumId, imageSelection.state.selectedImageId.value)
  if (!updatedAlbum) return

  emit('album-updated', updatedAlbum)
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
      <UEmpty v-if="hasLoadError" description="Unable to load album images" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No images" size="md" variant="naked" class="py-8" />

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
