<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from '#imports'
import { formatDate, useInfiniteScroll, useWindowSize } from '@vueuse/core'
import { useImageUpdate } from '~/features/image-update'
import { useImageTrashActions } from '~/features/image-trash-actions'
import { useShareImagesFeature } from '~/features/share-images'
import { useSelection, type SelectionAction } from '~/shared/selection'
import SelectionBar from '~/shared/selection/ui/SelectionBar.vue'
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

const {
  selectedIds,
  toggleSelection,
  clearSelection,
} = useSelection()

const isSelectionMode = computed(() => selectedIds.value.length > 0)

const { updateImage } = useImageUpdate()
const { shareImages, isSharing } = useShareImagesFeature()
const { isTrashingImages, trashImages } = useImageTrashActions()
const selectionActions = computed<SelectionAction[]>(() => [
  {
    key: 'share',
    label: 'Share',
    icon: 'i-heroicons-share-20-solid',
    loading: isSharing.value,
  },
  {
    key: 'rename',
    label: 'Rename',
    icon: 'i-heroicons-pencil-square-20-solid',
    visible: selectedIds.value.length === 1,
  },
  {
    key: 'move-to-trash',
    label: 'Move to trash',
    icon: 'i-heroicons-archive-box-arrow-down-20-solid',
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
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleCardClick(imageId: number) {
  if (!isSelectionMode.value) return

  toggleSelection(imageId)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isSelectionMode.value) return

  clearSelection()
}

async function shareSelectedImages() {
  await shareImages(selectedIds.value)
}

async function updateSelectedImage() {
  const imageId = selectedIds.value[0]
  if (!imageId) return

  const updatedImage = await updateImage(imageId)
  if (!updatedImage) return

  replaceImage(updatedImage)
  clearSelection()
}

async function trashSelectedImages() {
  const trashedIds = await trashImages(selectedIds.value)
  if (!trashedIds) return

  removeImagesById(trashedIds)
  clearSelection()
}

function handleSelectionAction(actionKey: string) {
  switch (actionKey) {
    case 'share':
      void shareSelectedImages()
      break

    case 'rename':
      void updateSelectedImage()
      break

    case 'move-to-trash':
      void trashSelectedImages()
      break
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div v-if="isSelectionMode" class="mb-4">
      <SelectionBar
        :selected-count="selectedIds.length"
        :actions="selectionActions"
        @clear="clearSelection"
        @action="handleSelectionAction"
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
          <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
            <div class="flex flex-col">
              <div class="relative">
                <button
                  type="button"
                  class="block w-full text-left"
                  :aria-label="`Select ${image.name}`"
                  @click="handleCardClick(image.id)"
                >
                  <img :src="image.previewUrl" :alt="image.name" class="aspect-square w-full object-cover">
                </button>

                <UCheckbox
                  :model-value="selectedIds.includes(image.id)"
                  color="primary"
                  class="absolute top-2 left-2 z-10"
                  @click.stop
                  @update:model-value="toggleSelection(image.id)"
                />
              </div>

              <div class="bg-default p-2">
                <p class="truncate text-sm font-medium text-highlighted">
                  {{ image.name }}
                </p>
                <p class="text-xs text-muted">
                  {{ formatDate(new Date(image.capturedAt), 'YYYY.MM.DD') }}
                </p>
              </div>
            </div>
          </UPageCard>
        </UScrollArea>
      </div>
    </template>

  </div>
</template>
