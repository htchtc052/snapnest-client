<script setup lang="ts">
import { computed } from '#imports'
import { accountImageDetailGet } from '~/api/account/imageDetailGet'
import { imagesGet } from '~/api/account/imagesGet'
import SelectionBar from '~/components/ui/SelectionBar.vue'
import ImageOwnerCollectionGrid from '~/components/widgets/ImageOwnerCollectionGrid.vue'
import ImageViewerModal from '~/components/widgets/ImageViewerModal.vue'
import { useShareImagesFeature } from '~/features/share-images'
import { useImageUpdate } from '~/features/image-update'
import { useImageTrashActions } from '~/features/image-trash-actions'
import { removeImagesFromCollection, replaceImageInCollection, useImageCollection } from '~/composables/images/useImageCollection'
import { useImageViewerDetail } from '~/composables/images/useImageViewerDetail'
import { useImageViewerQuery } from '~/composables/images/useImageViewerQuery'
import { useSelection } from '~/shared/selection'

definePageMeta({
  layout: 'media',
})

const route = useRoute()
const router = useRouter()
const client = useSanctumClient()
const {
  images,
  isLoading,
  isLoadingMore,
  loadError,
  hasMore,
  loadInitial,
  loadMore,
} = useImageCollection(page => imagesGet(client, page))
const {
  selectedIds,
  toggleSelection,
  clearSelection,
} = useSelection()

const isSelectionMode = computed(() => selectedIds.value.length > 0)

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
  fetchDetail: detailImageId => accountImageDetailGet(client, detailImageId),
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

const { updateImage } = useImageUpdate()
const { shareImages, isSharing } = useShareImagesFeature()
const { isTrashingImages, trashImages } = useImageTrashActions()

onMounted(() => {
  void loadInitial()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isSelectionMode.value) {
    clearSelection()
  }
}

async function shareSelectedImages() {
  await shareImages(selectedIds.value)
}


async function updateSelectedImage() {
  const updatedImage = await updateImage(selectedIds.value[0]!)

  if (updatedImage) {
    images.value = replaceImageInCollection(images.value, updatedImage)
    clearSelection()
  }
}

async function trashSelectedImages() {
  const trashedIds = await trashImages(selectedIds.value)

  if (trashedIds) {
    images.value = removeImagesFromCollection(images.value, trashedIds)
    clearSelection()
  }
}

</script>

<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden px-4">
    <div class="mt-4">
      <SelectionBar v-if="isSelectionMode" @clear="clearSelection">
        <div class="flex min-w-0 flex-1 items-center justify-between gap-3">
          <span class="truncate text-base font-medium sm:text-lg">
            {{ selectedIds.length === 1 ? '1 selected' : `${selectedIds.length} selected` }}
          </span>

          <div class="flex shrink-0 items-center gap-1">
            <UButton
              icon="i-heroicons-share-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              title="Share"
              :loading="isSharing"
              @click="shareSelectedImages"
            >
              <span class="hidden sm:inline">Share</span>
            </UButton>

            <UButton
              v-if="selectedIds.length === 1"
              icon="i-heroicons-pencil-square-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              title="Rename"
              @click="updateSelectedImage"
            >
              <span class="hidden sm:inline">Rename</span>
            </UButton>

            <UButton
              icon="i-heroicons-archive-box-arrow-down-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              title="Move to trash"
              :loading="isTrashingImages"
              @click="trashSelectedImages"
            >
              <span class="hidden sm:inline">Move to trash</span>
            </UButton>
          </div>
        </div>
      </SelectionBar>
    </div>

    <div class="flex items-start gap-3 pt-5 pb-4">
      <h1 class="text-4xl font-bold tracking-tight text-highlighted">
        Photos
      </h1>
    </div>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="loadError" description="Unable to load photos" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="images.length === 0" description="No images yet" size="md" variant="naked" class="py-8" />

      <ImageOwnerCollectionGrid
        v-else
        :images="images"
        :selected-ids="selectedIds"
        :selection-mode="isSelectionMode"
        :has-more="hasMore"
        :is-loading-more="isLoadingMore"
        :on-load-more="loadMore"
        @open="openImageViewer"
        @toggle-selection="toggleSelection"
      />
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
