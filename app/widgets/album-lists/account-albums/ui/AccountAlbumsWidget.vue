<script setup lang="ts">
import { AlbumPreviewCard } from '~/entities/album'
import { AlbumActionsMenu } from '~/features/album/album-actions-menu'
import { useAlbumInfoUpdate } from '~/features/album/album-info-update'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
import { useCreatePrivateAlbum } from '~/features/album/create-private-album'
import { useDeleteAlbum } from '~/features/album/delete-album'
import type { AccountAlbum } from '~/entities/album/model'
import { useAccountAlbums } from '../model/useAccountAlbums'

const {
  albums,
  isLoading,
  hasLoadError,
  isEmpty,
  replaceAlbum,
  removeAlbumById,
} = useAccountAlbums()

const { createPrivateAlbum } = useCreatePrivateAlbum()
const { deleteAlbum: deleteAlbumFeature } = useDeleteAlbum()
const { updateAlbumInfo } = useAlbumInfoUpdate()
const {
  publishAlbum: publishAlbumFeature,
  hideAlbum: hideAlbumFeature,
  copyPublicLink,
} = useAlbumVisibilityFeature()

async function createAlbum() {
  const album = await createPrivateAlbum()
  if (!album) return

  await navigateTo(`/account/albums/${album.id}`)
}

async function deleteAlbum(album: AccountAlbum) {
  const isDeleted = await deleteAlbumFeature(album)
  if (!isDeleted) return

  removeAlbumById(album.id)
}

function applyAlbumUpdate(updatedAlbum: AccountAlbum | null | undefined) {
  if (!updatedAlbum) return

  replaceAlbum(updatedAlbum)
}

async function renameAlbum(album: AccountAlbum) {
  applyAlbumUpdate(await updateAlbumInfo(album))
}

async function publishAlbum(album: AccountAlbum) {
  applyAlbumUpdate(await publishAlbumFeature(album))
}

async function hideAlbum(album: AccountAlbum) {
  applyAlbumUpdate(await hideAlbumFeature(album))
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <UPageHeader title="Albums" class="border-0 px-4 pt-5">
      <template #links>
        <UButton icon="i-lucide-plus" @click="createAlbum">
          New album
        </UButton>
      </template>
    </UPageHeader>

    <div class="min-h-0 flex-1">
      <USkeleton v-if="isLoading" class="mx-4 h-40" />

      <UEmpty v-else-if="hasLoadError" description="Failed to load albums." size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No albums yet" size="md" variant="naked" class="py-8" />

      <UPageGrid v-else class="grid-cols-2 gap-5 px-4 pb-8 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="album in albums"
          :key="album.id"
          class="relative"
        >
          <NuxtLink :to="`/account/albums/${album.id}`" class="block h-full">
            <AlbumPreviewCard :album="album" />
          </NuxtLink>

          <div class="absolute top-3 right-3 z-10">
            <AlbumActionsMenu
              :album="album"
              @rename="renameAlbum"
              @delete="deleteAlbum"
              @publish="publishAlbum"
              @hide="hideAlbum"
              @copy-public-link="copyPublicLink"
            />
          </div>
        </div>
      </UPageGrid>
    </div>
  </div>
</template>
