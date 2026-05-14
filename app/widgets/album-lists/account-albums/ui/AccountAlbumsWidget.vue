<script setup lang="ts">
import { AlbumPreviewCard } from '~/entities/album'
import { AlbumActionsMenu } from '~/features/album/album-actions-menu'
import { useAlbumInfoUpdate } from '~/features/album/album-info-update'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
import { useCreatePrivateAlbum } from '~/features/album/create-private-album'
import { useDeleteAlbum } from '~/features/album/delete-album'
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
const { deleteAlbum } = useDeleteAlbum({
  onDeleted: removeAlbumById,
})
const { updateAlbumInfo } = useAlbumInfoUpdate({
  onUpdated: replaceAlbum,
})
const {
  publishAlbum,
  hideAlbum,
  copyPublicLink,
} = useAlbumVisibilityFeature({
  onUpdated: replaceAlbum,
})

async function createAlbum() {
  const album = await createPrivateAlbum()
  if (!album) return

  await navigateTo(`/account/albums/${album.id}`)
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
              @rename="updateAlbumInfo"
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
