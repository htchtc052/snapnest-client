<script setup lang="ts">
import { computed } from '#imports'
import type { User } from '~/types/user.model'
import {
  useAccountAlbum,
  type Album,
} from '~/entities/album'
import { ApiHttpStatus } from '~/shared/api'
import { AccountAlbumHeader } from '~/widgets/album-details/account-album-header'
import { AccountAlbumImagesWidget } from '~/widgets/image-lists/account-album-images'

definePageMeta({
  layout: 'media',
})

const route = useRoute()
const albumId = computed(() => Number(route.params.id))
const { user } = useSanctumAuth<User>()

const { data: album, error: albumError } = await useAccountAlbum(albumId.value)

if (albumError.value) {
  const statusCode = albumError.value.statusCode || albumError.value.status

  if (statusCode === ApiHttpStatus.NotFound) {
    throw createError({
      statusCode: ApiHttpStatus.NotFound,
      statusMessage: 'Album not found',
      fatal: true,
    })
  }

  console.error('Album load error', albumError.value)

  throw createError({
    statusCode: ApiHttpStatus.InternalServerError,
    statusMessage: 'Album load failed',
    fatal: true,
  })
}

function applyUpdatedAlbum(updatedAlbum: Album) {
  album.value = {
    ...album.value!,
    ...updatedAlbum,
    isOwner: true,
  }
}

</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
    <AccountAlbumHeader
      v-if="album"
      v-model:album="album"
      :actor="user"
    />

    <AccountAlbumImagesWidget :album-id="albumId" @album-updated="applyUpdatedAlbum" />
  </div>
</template>
