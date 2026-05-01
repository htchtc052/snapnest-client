<script setup lang="ts">
import { computed } from '#imports'
import type { DropdownMenuItem } from '@nuxt/ui'
import AlbumCollectionGrid from '~/components/widgets/AlbumCollectionGrid.vue'
import { albumsGet } from '~/api/account/albumsGet'
import { useCreatePrivateAlbumFeature } from '~/composables/features/useCreatePrivateAlbumFeature'
import { useDeleteAlbumFeature } from '~/composables/features/useDeleteAlbumFeature'
import { useAlbumVisibilityFeature } from '~/composables/features/useAlbumVisibilityFeature'
import { useRenameAlbumFeature } from '~/composables/features/useRenameAlbumFeature'
import type { AccountAlbum } from '~/types/account-album.model'

definePageMeta({
  layout: 'media',
})

const client = useSanctumClient()

const {
  data: albums,
  status,
  error,
} = await useAsyncData<AccountAlbum[]>(
  'account-albums',
  () => albumsGet(client),
  {
    default: () => [],
  },
)

const isLoading = computed(() => status.value === 'pending')

const hasLoadError = computed(() => Boolean(error.value))

const { createPrivateAlbum } = useCreatePrivateAlbumFeature()
const { deleteAlbum: deleteAlbumFeature } = useDeleteAlbumFeature()
const {
  publishAlbum: publishAlbumFeature,
  hideAlbum: hideAlbumFeature,
  copyPublicLink,
} = useAlbumVisibilityFeature()

const { renameAlbum: renameAlbumFeature } = useRenameAlbumFeature()




function replaceAlbumInList(updatedAlbum: AccountAlbum) {
  albums.value = albums.value.map(item =>
    item.id === updatedAlbum.id ? updatedAlbum : item,
  )
}

function removeAlbumFromList(albumId: number) {
  albums.value = albums.value.filter(item => item.id !== albumId)
}

async function createAlbum() {
  const album = await createPrivateAlbum()
  if (!album) return

  await navigateTo(albumPath(album))
}
async function deleteAlbum(album: AccountAlbum) {
  const isDeleted = await deleteAlbumFeature(album)
  if (!isDeleted) return

  removeAlbumFromList(album.id)
}

async function renameAlbum(album: AccountAlbum) {
  const updatedAlbum = await renameAlbumFeature(album)
  if (!updatedAlbum) return

  replaceAlbumInList(updatedAlbum)
}

async function publishAlbum(album: AccountAlbum) {
  const updatedAlbum = await publishAlbumFeature(album)
  if (!updatedAlbum) return

  replaceAlbumInList(updatedAlbum)
}

async function hideAlbum(album: AccountAlbum) {
  const updatedAlbum = await hideAlbumFeature(album)
  if (!updatedAlbum) return

  replaceAlbumInList(updatedAlbum)
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
        <UEmpty v-else-if="albums.length === 0" description="No albums yet" size="md" variant="naked" class="py-8" />

        <AlbumCollectionGrid v-else :albums="albums" :get-album-menu-items="albumMenuItems" 
          class="px-4" />

    </div>
  </div>
</template>
