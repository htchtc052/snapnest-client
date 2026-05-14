<script setup lang="ts">
import { computed } from '#imports'
import type { User } from '~/types/user.model'
import { AlbumDownloadButton } from '~/features/album/download-album'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
import {
  AlbumHeader,
  getAlbumPolicy,
  useAccountAlbum,
  type Album,
} from '~/entities/album'
import { ApiHttpStatus } from '~/shared/api'
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

const albumPolicy = computed(() => {
  if (!album.value) return null

  return getAlbumPolicy(user.value, album.value)
})

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
    <AlbumHeader v-if="album" :album="album">
      <template #actions>
        <template v-if="album?.isPublic">
          <div class="flex items-center gap-2">
            <AlbumDownloadButton v-if="albumPolicy?.canDownloadAlbum" />

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
          <div class="flex items-center gap-2">
            <AlbumDownloadButton v-if="albumPolicy?.canDownloadAlbum" />

            <UButton icon="i-lucide-link" color="primary" :loading="isUpdatingAlbumVisibility" @click="publishAlbum">
              Create link
            </UButton>
          </div>
        </template>
      </template>
    </AlbumHeader>

    <AccountAlbumImagesWidget :album-id="albumId" @album-updated="applyUpdatedAlbum" />
  </div>
</template>
