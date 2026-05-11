<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAlbumInfoUpdate } from '~/features/album-info-update'
import { useAlbumVisibilityFeature } from '~/features/album-visibility'
import { useCreatePrivateAlbum } from '~/features/create-private-album'
import { useDeleteAlbum } from '~/features/delete-album'
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

function albumImagesLabel(imagesCount: number) {
  return `${imagesCount} photo${imagesCount === 1 ? '' : 's'}`
}

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

async function renameAlbum(album: AccountAlbum) {
  const updatedAlbum = await updateAlbumInfo(album)
  if (!updatedAlbum) return

  replaceAlbum(updatedAlbum)
}

async function publishAlbum(album: AccountAlbum) {
  const updatedAlbum = await publishAlbumFeature(album)
  if (!updatedAlbum) return

  replaceAlbum(updatedAlbum)
}

async function hideAlbum(album: AccountAlbum) {
  const updatedAlbum = await hideAlbumFeature(album)
  if (!updatedAlbum) return

  replaceAlbum(updatedAlbum)
}

function albumMenuItems(album: AccountAlbum): DropdownMenuItem[][] {
  const visibilityItems: DropdownMenuItem[] = album.isPublic
    ? [
      {
        label: 'Copy link',
        icon: 'i-lucide-copy',
        onSelect: () => void copyPublicLink(album),
      },
      {
        label: 'Make private',
        icon: 'i-lucide-eye-off',
        onSelect: () => void hideAlbum(album),
      },
    ]
    : [
      {
        label: 'Create link',
        icon: 'i-lucide-link',
        onSelect: () => void publishAlbum(album),
      },
    ]

  return [
    [
      ...visibilityItems,
      {
        label: 'Rename',
        icon: 'i-lucide-pencil',
        onSelect: () => void renameAlbum(album),
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => void deleteAlbum(album),
      },
    ],
  ]
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
      <template v-if="isLoading">
        <USkeleton class="mx-4 h-40" />
      </template>

      <UEmpty v-else-if="hasLoadError" description="Failed to load albums." size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No albums yet" size="md" variant="naked" class="py-8" />

      <UPageGrid v-else class="grid-cols-2 gap-5 px-4 pb-8 md:grid-cols-3 lg:grid-cols-4">
        <UPageCard
          v-for="album in albums"
          :key="album.id"
          variant="outline"
        >
          <template #title>
            <div class="space-y-2">
              <div class="flex min-w-0 items-center justify-between gap-2">
                <NuxtLink :to="`/account/albums/${album.id}`" class="min-w-0 flex-1 truncate">
                  {{ album.name }}
                </NuxtLink>

                <UBadge v-if="album.isPublic" color="primary" variant="soft" size="xs">
                  Shared
                </UBadge>

                <UDropdownMenu :items="albumMenuItems(album)" :content="{ align: 'end' }">
                  <UButton
                    icon="i-heroicons-ellipsis-vertical-20-solid"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    square
                    class="shrink-0"
                    @click.stop
                  />
                </UDropdownMenu>
              </div>

              <div class="text-xs font-medium text-muted-500">
                {{ albumImagesLabel(album.imagesCount) }}
              </div>
            </div>
          </template>

          <NuxtLink :to="`/account/albums/${album.id}`" class="block">
            <div
              class="aspect-square w-full overflow-hidden rounded-lg"
              :class="album.coverPreviewUrl ? 'bg-muted' : 'border border-dashed border-muted bg-elevated/60'"
            >
              <img
                v-if="album.coverPreviewUrl"
                :src="album.coverPreviewUrl"
                :alt="album.name || ''"
                class="h-full w-full object-cover"
              >

              <div
                v-else
                class="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-muted-500"
              >
                <UIcon name="i-lucide-image-off" class="size-8" />
                <p class="text-sm font-medium text-toned">
                  Empty album
                </p>
              </div>
            </div>
          </NuxtLink>
        </UPageCard>
      </UPageGrid>
    </div>
  </div>
</template>
