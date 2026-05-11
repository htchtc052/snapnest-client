<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from '#imports'
import { formatDate, useWindowSize } from '@vueuse/core'
import { accountAlbumImageDetailGet } from '~/api/account/albumImageDetailGet'
import { useAlbumCoverUpdate } from '~/features/album-cover-update'
import { useRemoveImagesFromAlbumFeature } from '~/features/remove-images-from-album'
import { useSelection, type SelectionAction } from '~/shared/selection'
import SelectionBar from '~/shared/selection/ui/SelectionBar.vue'
import ImageViewerModal from '~/viewer_old/ImageViewerModal.vue'
import { useImageViewerDetail } from '~/viewer_old/useImageViewerDetail'
import { useImageViewerQuery } from '~/viewer_old/useImageViewerQuery'
import { useAccountAlbumImages } from '../model/useAccountAlbumImages'

const props = defineProps<{
  albumId: number
}>()

const route = useRoute()
const router = useRouter()
const client = useSanctumClient()

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
    visible: selectedIds.value.length === 1,
    loading: isUpdatingAlbumCover.value,
  },
  {
    key: 'remove-from-album',
    label: 'Remove from album',
    icon: 'i-heroicons-folder-minus-20-solid',
    loading: isRemovingImages.value,
  },
])

const {
  activeViewerImageId,
  isViewerOpen,
  openImageViewer,
  closeImageViewer,
} = useImageViewerQuery()

const {
  detail: viewerDetail,
  isLoading: isViewerLoading,
  loadError: viewerLoadError,
} = useImageViewerDetail({
  imageId: activeViewerImageId,
  fetchDetail: imageId => accountAlbumImageDetailGet(client, props.albumId, imageId),
})

const viewerPrevTo = computed(() => {
  if (!viewerDetail.value?.prevImageId) return null

  return router.resolve({
    path: route.path,
    query: {
      ...route.query,
      image: String(viewerDetail.value.prevImageId),
    },
  }).fullPath
})

const viewerNextTo = computed(() => {
  if (!viewerDetail.value?.nextImageId) return null

  return router.resolve({
    path: route.path,
    query: {
      ...route.query,
      image: String(viewerDetail.value.nextImageId),
    },
  }).fullPath
})

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
  if (isSelectionMode.value) {
    toggleSelection(imageId)
    return
  }

  openImageViewer(imageId)
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

function handleSelectionAction(actionKey: string) {
  switch (actionKey) {
    case 'set-cover':
      void setSelectedImageAsCover()
      break

    case 'remove-from-album':
      void removeSelectedImages()
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
      <UEmpty v-if="hasLoadError" description="Unable to load album images" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No images" size="md" variant="naked" class="py-8" />

      <div v-else class="relative flex min-h-0 flex-1 flex-col">
        <UScrollArea
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
                  :aria-label="isSelectionMode ? `Select ${image.name}` : `Open ${image.name}`"
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

    <ImageViewerModal
      :open="isViewerOpen"
      :detail="viewerDetail"
      :is-loading="isViewerLoading"
      :load-error="viewerLoadError"
      :prev-to="viewerPrevTo"
      :next-to="viewerNextTo"
      @close="closeImageViewer"
    />
  </div>
</template>
