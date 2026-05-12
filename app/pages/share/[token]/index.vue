<script setup lang="ts">
import { computed } from '#imports'
import { formatDate } from '@vueuse/core'
import { usePublicAlbumRequest } from '~/entities/album'
import { ApiHttpStatus } from '~/shared/api'
import { PublicAlbumImagesWidget } from '~/widgets/public-album-images'
import type { PublicAlbum } from '~/types/public-album.model'

definePageMeta({
  layout: 'public',
  sanctum: {
    excluded: true,
  },
})

const route = useRoute()
const token = computed(() => route.params.token as string)
const { getPublicAlbum } = usePublicAlbumRequest()

const { data: album, error: albumError } = await useAsyncData<PublicAlbum>(
  `public-album:${token.value}`,
  () => getPublicAlbum(token.value),
)

if (albumError.value) {
  const statusCode = albumError.value.statusCode || albumError.value.status

  if (statusCode === ApiHttpStatus.NotFound) {
    throw createError({
      statusCode: ApiHttpStatus.NotFound,
      statusMessage: 'Album not found',
      fatal: true,
    })
  }

  if (statusCode === ApiHttpStatus.Forbidden) {
    throw createError({
      statusCode: ApiHttpStatus.Forbidden,
      statusMessage: 'Access denied',
      fatal: true,
    })
  }

  console.error('Public album load error', albumError.value)

  throw createError({
    statusCode: ApiHttpStatus.InternalServerError,
    statusMessage: 'Album load failed',
    fatal: true,
  })
}

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

    <PublicAlbumImagesWidget :token="token" />
  </div>
</template>
