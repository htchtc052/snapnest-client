<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from '#imports'
import { useWindowSize } from '@vueuse/core'
import { ImageCard } from '~/entities/image'
import { useAlbumCoverUpdate } from '~/features/album/album-cover-update'
import { useRemoveImagesFromAlbumFeature } from '~/features/album/remove-images-from-album'
import { SelectionBar, useSelection, type SelectionAction } from '~/shared/selection'
import { useAccountAlbumImages } from '../model/useAccountAlbumImages'

const props = defineProps<{
  albumId: number
}>()

const {
  images,
  isLoading,
  hasLoadError,
  isEmpty,
  removeImagesById,
} = useAccountAlbumImages(props.albumId)

const {
  selectedIds,
  toggleSelection,
  clearSelection,
} = useSelection()

const isSelectionMode = computed(() => selectedIds.value.length > 0)
const selectedImageId = computed<number | null>(() => {
  return selectedIds.value.length === 1 ? (selectedIds.value[0] ?? null) : null
})

const { isUpdatingAlbumCover, setAlbumCover } = useAlbumCoverUpdate()
const { isRemovingImages, removeImagesFromAlbum } = useRemoveImagesFromAlbumFeature()
const selectionActions = computed<SelectionAction[]>(() => [
  {
    key: 'set-cover',
    label: 'Set as cover',
    icon: 'i-heroicons-photo-20-solid',
    onSelect: setSelectedImageAsCover,
    visible: selectedIds.value.length === 1,
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

async function removeSelectedImages() {
  const removedIds = await removeImagesFromAlbum(props.albumId, selectedIds.value)
  if (!removedIds) return

  removeImagesById(removedIds)
  clearSelection()
}

async function setSelectedImageAsCover() {
  if (selectedImageId.value === null) return

  await setAlbumCover(props.albumId, selectedImageId.value)
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div v-if="isSelectionMode" class="mb-4">
      <SelectionBar
        :selected-count="selectedIds.length"
        :actions="selectionActions"
        @clear="clearSelection"
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
          <div class="relative">
            <ImageCard :image="image" />

            <button
              type="button"
              class="absolute inset-0 z-0 block w-full rounded-lg text-left"
              :aria-label="`Select ${image.name}`"
              @click="handleCardClick(image.id)"
            />

            <UCheckbox
              :model-value="selectedIds.includes(image.id)"
              color="primary"
              class="absolute top-2 left-2 z-10"
              @click.stop
              @update:model-value="toggleSelection(image.id)"
            />
          </div>
        </UScrollArea>
      </div>
    </template>

  </div>
</template>
