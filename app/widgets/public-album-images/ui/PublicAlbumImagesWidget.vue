<script setup lang="ts">
import { computed } from '#imports'
import { formatDate, useWindowSize } from '@vueuse/core'
import { publicAlbumImageDetailGet } from '~/api/public/albumImageDetailGet'
import ImageViewerModal from '~/viewer_old/ImageViewerModal.vue'
import { useImageViewerDetail } from '~/viewer_old/useImageViewerDetail'
import { useImageViewerQuery } from '~/viewer_old/useImageViewerQuery'
import { usePublicAlbumImages } from '../model/usePublicAlbumImages'

const props = defineProps<{
  token: string
}>()

const route = useRoute()
const router = useRouter()
const client = useSanctumClient()

const {
  images,
  isLoading,
  hasLoadError,
  isEmpty,
} = usePublicAlbumImages(props.token)

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
  fetchDetail: imageId => publicAlbumImageDetailGet(client, props.token, imageId),
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
  return width.value < 640 ? 2 : 4
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="hasLoadError" description="Unable to load images" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No images" size="md" variant="naked" class="py-8" />

      <div v-else class="flex min-h-0 flex-1 flex-col">
        <UScrollArea
          v-slot="{ item: image }"
          :items="images"
          :virtualize="{ estimateSize: 240, gap: 12, lanes }"
          class="min-h-0 flex-1"
        >
          <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
            <div class="flex flex-col">
              <button
                type="button"
                class="block w-full text-left"
                :aria-label="`Open ${image.name}`"
                @click="openImageViewer(image.id)"
              >
                <img :src="image.previewUrl" :alt="image.name" class="aspect-square w-full object-cover">
              </button>

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
