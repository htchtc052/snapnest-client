<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from '#imports'
import { useInfiniteScroll, useWindowSize } from '@vueuse/core'
import {
  ImageSelectionBar,
  SelectableImageCard,
  useImageSelection,
  type ImageSelectionAction,
} from '~/features/image/image-selection'
import { useImageUpdate } from '~/features/image/image-update'
import { useImageTrashActions } from '~/features/image/image-trash-actions'
import { useShareImagesFeature } from '~/features/image/share-images'
import { useAccountImages } from '../model/useAccountImages'

const {
  images,
  isLoading,
  isLoadingMore,
  hasLoadError,
  isEmpty,
  hasMore,
  loadMore,
  removeImagesById,
  replaceImage,
} = useAccountImages()

const imageSelection = useImageSelection()

const { updateImage } = useImageUpdate()
const { shareImages, isSharing } = useShareImagesFeature()
const { isTrashingImages, trashImages } = useImageTrashActions()
const selectionActions = computed<ImageSelectionAction[]>(() => [
  {
    key: 'share',
    label: 'Share',
    icon: 'i-heroicons-share-20-solid',
    onSelect: shareSelectedImages,
    loading: isSharing.value,
  },
  {
    key: 'rename',
    label: 'Rename',
    icon: 'i-heroicons-pencil-square-20-solid',
    onSelect: updateSelectedImage,
    visible: imageSelection.mode.isSingleSelection.value,
  },
  {
    key: 'move-to-trash',
    label: 'Move to trash',
    icon: 'i-heroicons-archive-box-arrow-down-20-solid',
    onSelect: trashSelectedImages,
    loading: isTrashingImages.value,
  },
])

const scrollArea = useTemplateRef<{ $el?: HTMLElement }>('scrollArea')
const { width } = useWindowSize()
const lanes = computed(() => {
  return width.value < 640 ? 3 : 4
})

useInfiniteScroll(
  () => scrollArea.value?.$el,
  () => {
    void loadMore()
  },
  {
    distance: 480,
    canLoadMore: () => hasMore.value && !isLoadingMore.value,
  },
)

onMounted(() => {
  window.addEventListener('keydown', imageSelection.clearOnEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', imageSelection.clearOnEscape)
})

async function shareSelectedImages() {
  await shareImages(imageSelection.state.selectedIds.value)
}

async function updateSelectedImage() {
  const imageId = imageSelection.state.selectedImageId.value
  if (!imageId) return

  const updatedImage = await updateImage(imageId)
  if (!updatedImage) return

  replaceImage(updatedImage)
  imageSelection.clear()
}

async function trashSelectedImages() {
  const trashedIds = await trashImages(imageSelection.state.selectedIds.value)
  if (!trashedIds) return

  removeImagesById(trashedIds)
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
      <UEmpty v-if="hasLoadError" description="Unable to load photos" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No images yet" size="md" variant="naked" class="py-8" />

      <div v-else class="relative flex min-h-0 flex-1 flex-col">
        <UScrollArea
          ref="scrollArea"
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
