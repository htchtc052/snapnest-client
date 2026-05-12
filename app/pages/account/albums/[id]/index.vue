<script setup lang="ts">
import { computed } from '#imports'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
import { useAccountAlbumRequest } from '~/entities/album'
import { ApiHttpStatus } from '~/shared/api'
import { AccountAlbumImagesWidget } from '~/widgets/image-lists/account-album-images'
import type { AccountAlbum } from '~/entities/album/model'
import type { AlbumView } from '~/types/album-view.model'


definePageMeta({
  layout: 'media',
})

const route = useRoute()
const albumId = computed(() => Number(route.params.id))
const { getAccountAlbum } = useAccountAlbumRequest()

const { data: album, error: albumError } = await useAsyncData<AlbumView>(
  `account-album:${albumId.value}`,
  () => getAccountAlbum(albumId.value),
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

  console.error('Album load error', albumError.value)

  throw createError({
    statusCode: ApiHttpStatus.InternalServerError,
    statusMessage: 'Album load failed',
    fatal: true,
  })
}

function applyUpdatedAlbum(updatedAlbum: AccountAlbum) {
  album.value = {
    ...album.value!,
    ...updatedAlbum,
    isOwner: true,
  }
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
</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
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

    <AccountAlbumImagesWidget :album-id="albumId" />
  </div>
</template>
