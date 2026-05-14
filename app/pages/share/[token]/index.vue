<script setup lang="ts">
import { computed } from '#imports'
import {
  AlbumHeader,
  usePublicAlbum,
} from '~/entities/album'
import { ApiHttpStatus } from '~/shared/api'
import { PublicAlbumImagesWidget } from '~/widgets/image-lists/public-album-images'

definePageMeta({
  layout: 'public',
  sanctum: {
    excluded: true,
  },
})

const route = useRoute()
const token = computed(() => route.params.token as string)

const { data: album, error: albumError } = await usePublicAlbum(token.value)

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
    <AlbumHeader
      v-if="album"
      :album="album"
      variant="public"
      class="pb-6"
    />

    <PublicAlbumImagesWidget :token="token" />
  </div>
</template>
