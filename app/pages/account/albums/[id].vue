<script setup lang="ts">
import { computed } from 'vue'
import { getAlbum } from '~/api/albums/getAlbum'
import type { Album } from '~/models/Album'
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
  () => getAlbum(client, albumId.value)
)

if (error.value) {
  const statusCode = error.value?.statusCode ?? 500
  if (statusCode === 404) {
    throw showError({ statusCode, statusMessage: 'Album not found' })
  }
  console.error('Album load error', error.value)
  throw error.value
}

const album = computed<Album>(() => albumData.value as Album)


/* 

async function removeImages(imageIds: number[]) {
  if (!imageIds.length) return
  try {
    await useAlbumDetachImages(albumId.value, imageIds)
    images.value = images.value.filter(img => !imageIds.includes(img.id))
    clear()
    album.value = { ...album.value, imagesCount: album.value.imagesCount - imageIds.length }
    toast.add({ title: 'Removed from album', color: 'success' })
  } catch (e) {
    console.error('[Album] Failed to detach images', e)
    toast.add({ title: 'Failed to remove from album', color: 'error' })
  }
}

async function removeSelected() {
  await removeImages([...selectedIds.value])
}

const openUpdate = useOpenModal<typeof ImageUpdateModal, ImageUpdateResult>(ImageUpdateModal)
const toast = useToast()

async function openUpdateImageModal(image: Image) {
  const res = await openUpdate({ image })
  if (res) {
    images.value = images.value.map(i => (i.id === res.id ? res : i))
  }
} */
</script>

<template>
  <div>
    <div class="flex items-center gap-3 px-4 pt-5 pb-3">
      <UButton
        to="/account/albums"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        square
      />
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

    <div class="px-4 text-sm text-muted-500">
      TODO: Album images
    </div>
  </div>
</template>
