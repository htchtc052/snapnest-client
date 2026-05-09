<script setup lang="ts">
import { computed, onMounted } from '#imports'
import { accountAlbumImageDetailGet } from '~/api/account/albumImageDetailGet'
import SelectionBar from '~/components/ui/SelectionBar.vue'
import ImageOwnerCollectionGrid from '~/components/widgets/ImageOwnerCollectionGrid.vue'
import ImageViewerModal from '~/components/widgets/ImageViewerModal.vue'
import { useAlbumCoverUpdate } from '~/features/album-cover-update'
import { useAlbumVisibilityFeature } from '~/features/album-visibility'
import { useRemoveImagesFromAlbumFeature } from '~/features/remove-images-from-album'
import { removeImagesFromCollection } from '~/composables/images/useImageCollection'
import { useImageSelection } from '~/composables/images/useImageSelection'
import { useImageViewerDetail } from '~/composables/images/useImageViewerDetail'
import { useImageViewerQuery } from '~/composables/images/useImageViewerQuery'
import { useAccountAlbumRequest } from '~/entities/album'
import { useAccountAlbumImages } from '~/widgets/account-album-images'
import type { AccountAlbum } from '~/entities/album/model'
import type { AlbumView } from '~/types/album-view.model'


definePageMeta({
  layout: 'media',
})

const route = useRoute()
const router = useRouter()
const albumId = computed(() => Number(route.params.id))
const client = useSanctumClient()
const { getAccountAlbum } = useAccountAlbumRequest()

const { data: album, error: albumError } = await useAsyncData<AlbumView>(
  `account-album:${albumId.value}`,
  () => getAccountAlbum(albumId.value),
)

if (albumError.value) {
  const statusCode = albumError.value.statusCode || albumError.value.status

  if (statusCode === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Album not found',
      fatal: true,
    })
  }

  console.error('Album load error', albumError.value)

  throw createError({
    statusCode: 500,
    statusMessage: 'Album load failed',
    fatal: true,
  })
}

const {
  images,
  isLoading,
  isLoadingMore,
  hasLoadError,
  isEmpty,
  hasMore,
  loadInitial,
  loadMore,
} = useAccountAlbumImages(albumId.value)


const {
  selectedIds,
  toggleSelection,
  clearSelection,
} = useImageSelection(images)


const { isUpdatingAlbumCover, setAlbumCover: setAlbumCoverFeature } = useAlbumCoverUpdate()
const { isRemovingImages, removeImagesFromAlbum } = useRemoveImagesFromAlbumFeature()
const isSelectionMode = computed(() => selectedIds.value.length > 0)
const selectedImageId = computed<number | null>(() => selectedIds.value.length === 1 ? (selectedIds.value[0] ?? null) : null)

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
  fetchDetail: detailImageId => accountAlbumImageDetailGet(client, albumId.value, detailImageId),
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


onMounted(() => {
  void loadInitial()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})


function applyUpdatedAlbum(updatedAlbum: AccountAlbum) {
  album.value = {
    ...album.value!,
    ...updatedAlbum,
    isOwner: true,
  }
}

async function removeSelectedImages() {
  const removedIds = await removeImagesFromAlbum(album.value!.id, selectedIds.value)
  if (!removedIds) return

  images.value = removeImagesFromCollection(images.value, removedIds)
  clearSelection()
}

async function setSelectedImageAsCover() {
  if (!album.value || selectedImageId.value === null) return

  const updatedAlbum = await setAlbumCoverFeature(album.value, selectedImageId.value)
  if (!updatedAlbum) return

  applyUpdatedAlbum(updatedAlbum)
}

const {
  isUpdatingAlbumVisibility,
  copiedPublicLink,
  publishAlbum: publishAlbumFeature,
  hideAlbum: hideAlbumFeature,
  copyPublicLink,
} = useAlbumVisibilityFeature()

async function publishAlbum() {
  if (!album.value) return

  const updatedAlbum = await publishAlbumFeature(album.value)
  if (!updatedAlbum) return

  applyUpdatedAlbum(updatedAlbum)
}

async function hideAlbum() {
  if (!album.value) return

  const updatedAlbum = await hideAlbumFeature(album.value)
  if (!updatedAlbum) return

  applyUpdatedAlbum(updatedAlbum)
}

async function copyLink() {
  if (!album.value) return
  await copyPublicLink(album.value)
}


function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || selectedIds.value.length === 0) return

  clearSelection()
}

</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
    <div class="mt-4">
      <SelectionBar v-if="isSelectionMode" @clear="clearSelection">
        <div class="flex min-w-0 flex-1 items-center justify-between gap-3">
          <span class="truncate text-base font-medium sm:text-lg">
            {{ selectedIds.length === 1 ? '1 selected' : `${selectedIds.length} selected` }}
          </span>

          <div class="flex shrink-0 items-center gap-1">
            <UButton
              v-if="selectedIds.length === 1"
              icon="i-heroicons-photo-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              :loading="isUpdatingAlbumCover"
              title="Set as cover"
              @click="setSelectedImageAsCover"
            >
              <span class="hidden sm:inline">Set as cover</span>
            </UButton>

            <UButton
              icon="i-heroicons-folder-minus-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              title="Remove from album"
              :loading="isRemovingImages"
              @click="removeSelectedImages"
            >
              <span class="hidden sm:inline">Remove from album</span>
            </UButton>
          </div>
        </div>
      </SelectionBar>
    </div>

    <div class="flex items-start justify-between gap-3 pt-5 pb-4">
      <div class="min-w-0">
        <h3 v-if="album?.name" class="truncate text-2xl font-semibold text-foreground">
          {{ album.name }}
        </h3>
      </div>

      <div class="flex min-w-0 flex-col items-end gap-2">
        <template v-if="album?.isPublic">

          <div class="flex items-center gap-2">
            <UButton icon="i-lucide-copy" color="neutral" variant="outline" @click="copyLink">
              {{ copiedPublicLink ? 'Link copied' : 'Copy link' }}
            </UButton>

            <UButton
              icon="i-lucide-eye-off"
              color="neutral"
              variant="ghost"
              :loading="isUpdatingAlbumVisibility"
              @click="hideAlbum"
            >
              Make private
            </UButton>
          </div>
        </template>

        <template v-else>
          <UButton icon="i-lucide-link" color="primary" :loading="isUpdatingAlbumVisibility" @click="publishAlbum">
            Create link
          </UButton>
        </template>
      </div>
    </div>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="hasLoadError" description="Unable to load album images" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No images" size="md" variant="naked" class="py-8" />

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
