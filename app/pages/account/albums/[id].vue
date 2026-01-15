<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { albumGet } from '~/api/account/albumGet'
import ImagePreview from '~/components/account/ImagePreview.vue'
import ImagesSelectionBar from '~/components/account/ImagesSelectionBar.vue'
import ImagesSelectionModeMobileToggle from '~/components/account/ImagesSelectionModeMobileToggle.vue'
import { useAlbumDetachImages } from '~/composables/account/useAlbumDetachImages'
import { useAlbumImagesGet } from '~/composables/account/useAlbumImagesGet'
import { provideSelectionStore } from '~/composables/useSelection'
import type { Album } from '~/types/album.model'
import type { Image } from '~/types/image.model'
import { formatYMD } from '~/utils/formatYMD'
import { isNumericParam } from '~/utils/isNumericParam'

definePageMeta({
  layout: 'media',
  validate: route =>
    isNumericParam(route.params.id),
})

const route = useRoute()
const client = useSanctumClient()
const albumId = computed(() => Number(route.params.id))

const {
  data: albumData,
  error,
} = await useAsyncData(
  `album-${albumId.value}`,
  () => albumGet(client, albumId.value)
)

if (error.value) {
  const statusCode = error.value?.statusCode ?? 500
  if (statusCode === 404) {
    throw showError({ statusCode, statusMessage: 'Album not found' })
  }
  console.error('Album load error', error.value)
  throw error.value
}

const album = ref<Album>(albumData.value as Album)
watch(albumData, (value) => {
  if (value) album.value = value as Album
})

const { images, isLoading: isImagesLoading, removeImages } = useAlbumImagesGet(albumId)
const { detachImages, isDetaching } = useAlbumDetachImages()

const {
  selectedImagesData,
  selectionMode,
  hasSelection,
  toggleSelection,
  clearSelection,
} = provideSelectionStore()

function handleImageSelection(image: Image) {
  if (!selectionMode.value) return
  toggleSelection(image)
}

async function handleRemoveFromAlbum(ids: number[]) {
  if (!ids.length || isDetaching.value) return
  const ok = await detachImages(albumId.value, ids)
  if (!ok) return
  removeImages(ids)
  clearSelection()
  album.value = { ...album.value, imagesCount: Math.max(0, album.value.imagesCount - ids.length) }
}

function handleDeleted(ids: number[]) {
  if (!ids.length) return
  removeImages(ids)
  album.value = { ...album.value, imagesCount: Math.max(0, album.value.imagesCount - ids.length) }
}
</script>

<template>
  <div class="relative h-full min-h-0">
    <div v-if="hasSelection" class="pointer-events-none absolute left-4 right-4 top-3 z-20">
      <div class="pointer-events-auto">
        <ImagesSelectionBar mode="album" @removed="handleRemoveFromAlbum" @deleted="handleDeleted" />
      </div>
    </div>

    <div class="flex h-full min-h-0 flex-col">
      <div class="flex items-center gap-3 px-4 pt-5 pb-3">
        <UButton to="/account/albums" color="neutral" variant="ghost" icon="i-lucide-arrow-left" square />
        <h3 class="text-2xl font-semibold text-foreground">
          {{ album.name }}
        </h3>
        <span class="text-sm text-muted-500">
          {{ album.imagesCount }} images
        </span>
      </div>

      <div class="flex items-center gap-2 px-4 pb-4 text-sm text-muted-500">
        <UIcon name="i-lucide-calendar" class="h-4 w-4" />
        <span>{{ formatYMD(album.createdAt) }}</span>
      </div>

      <div class="flex items-center justify-end gap-2 px-4 pb-4">
        <ImagesSelectionModeMobileToggle />
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <template v-if="isImagesLoading">
          <USkeleton class="h-40" />
        </template>
        <template v-else>
          <div v-if="images.length === 0" class="py-8 text-center text-sm text-muted-500">
            No images yet
          </div>
          <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
            <div v-for="image in images" :key="image.id"
              class="group relative aspect-square overflow-hidden rounded-lg bg-muted-100"
              :class="selectedImagesData[image.id] ? 'ring-2 ring-primary/40' : ''"
              @click="handleImageSelection(image)">
              <div class="absolute inset-0 pointer-events-none">
                <ImagePreview :image="image" />
              </div>

              <div class="absolute bottom-2 left-2 z-10 pointer-events-auto"
                :class="selectionMode ? 'opacity-100' : 'hidden sm:block sm:opacity-0 sm:group-hover:opacity-100'">
                <UCheckbox :model-value="Boolean(selectedImagesData[image.id])" color="primary" @click.stop
                  @update:model-value="() => toggleSelection(image)" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
