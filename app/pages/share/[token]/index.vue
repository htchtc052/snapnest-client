<script setup lang="ts">
import { computed, useLazyAsyncData } from '#imports'
import { formatDate } from '@vueuse/core'
import { albumGet } from '~/api/public/albumGet'
import { publicAlbumImageDetailGet } from '~/api/public/albumImageDetailGet'
import { albumImagesGet } from '~/api/public/albumImagesGet'
import ImagePublicCollectionGrid from '~/components/widgets/ImagePublicCollectionGrid.vue'
import ImageViewerModal from '~/components/widgets/ImageViewerModal.vue'
import { useImageViewerDetail } from '~/composables/images/useImageViewerDetail'
import { useImageViewerQuery } from '~/composables/images/useImageViewerQuery'
import type { PublicAlbum } from '~/types/public-album.model'

definePageMeta({
  layout: 'public',
  sanctum: {
    excluded: true,
  },
})

const route = useRoute()
const router = useRouter()
const token = computed(() => route.params.token as string)
const client = useSanctumClient()


const { data: album, error: albumError } = await useAsyncData<PublicAlbum>(
  `public-album:${token.value}`,
  () => albumGet(client, token.value),
)

if (albumError.value) {
  const statusCode = albumError.value.statusCode

  if (statusCode === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Album not found',
      fatal: true,
    })
  }

  if (statusCode === 403) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied',
      fatal: true,
    })
  }

  console.error('Public album load error', albumError.value)

  throw createError({
    statusCode: 500,
    statusMessage: 'Album load failed',
    fatal: true,
  })
}

const {
  data: albumImagesResponse,
  status: albumImagesStatus,
} = useLazyAsyncData(
  `public-album-images:${token.value}`,
  () => albumImagesGet(client, token.value),
  {
    server: false,
    default: () => ({
      images: [],
    }),
  },
)

const images = computed(() => albumImagesResponse.value.images)
const isLoading = computed(() => albumImagesStatus.value === 'pending')
const hasLoadError = computed(() => albumImagesStatus.value === 'error')
const isEmpty = computed(() => {
  return !isLoading.value
    && !hasLoadError.value
    && images.value.length === 0
})
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
  fetchDetail: detailImageId => publicAlbumImageDetailGet(client, token.value, detailImageId),
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

</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div v-if="album" class="pb-6">
      <UPageHeader class="border-0 px-0 pt-0">
        <template v-if="album.name" #title>
          {{ album.name }}
        </template>

        <template #description>
          <div class="flex items-center gap-4">
            <img
              v-if="album.coverPreviewUrl"
              :src="album.coverPreviewUrl"
              alt="Album cover"
              class="h-16 w-16 shrink-0 rounded-lg object-cover"
            >

            <div class="min-w-0 space-y-1">
              <p class="text-sm text-muted">
                By {{ album.ownerName }}
              </p>

              <p class="text-sm text-muted">
                {{ album.imagesCount }} {{ album.imagesCount === 1 ? 'photo' : 'photos' }}
                <span class="px-1">•</span>
                {{ formatDate(new Date(album.createdAt), 'YYYY.MM.DD') }}
              </p>
            </div>
          </div>
        </template>
      </UPageHeader>
    </div>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="hasLoadError" description="Unable to load images" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No images" size="md" variant="naked" class="py-8" />

      <ImagePublicCollectionGrid v-else :images="images" @open="openImageViewer" />
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
