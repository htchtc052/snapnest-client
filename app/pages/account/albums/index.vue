<script setup lang="ts">
import { onMounted } from '#imports'
import type { DropdownMenuItem } from '@nuxt/ui'
import AlbumCreateModal from '~/components/account/AlbumCreateModal.vue'
import AlbumDeleteModal from '~/components/account/AlbumDeleteModal.vue'
import AlbumPreview from '~/components/account/AlbumPreview.vue'
import AlbumUpdateModal from '~/components/account/AlbumUpdateModal.vue'
import { useAlbumsGet } from '~/composables/account/useAlbumsGet'
import { useOpenModal } from '~/composables/useOpenModal'
import type { AlbumCreateModalResult } from '~/types/album-create.contracts'
import type { AlbumDeleteModalResult } from '~/types/album-delete.contract'
import type { AlbumUpdateModalResult } from '~/types/album-update.contract'
import type { Album } from '~/types/album.model'

definePageMeta({
  layout: 'media',
})

const { albums, isLoading, loadAlbums } = useAlbumsGet()
const openCreateAlbum = useOpenModal<typeof AlbumCreateModal, AlbumCreateModalResult>(AlbumCreateModal)
const openUpdateAlbum = useOpenModal<typeof AlbumUpdateModal, AlbumUpdateModalResult>(AlbumUpdateModal)
const openDeleteAlbum = useOpenModal<typeof AlbumDeleteModal, AlbumDeleteModalResult>(AlbumDeleteModal)

onMounted(() => {
  loadAlbums()
})

async function openCreateAlbumModal() {
  const result = await openCreateAlbum()
  if (result.action === 'cancel') return
  albums.value.unshift(result.album)
}

async function renameAlbum(album: Album) {
  const result = await openUpdateAlbum({ album })
  if (result.action === 'cancel') return
  albums.value = albums.value.map((item) => (item.id === result.album.id ? result.album : item))
}

async function deleteAlbum(album: Album) {
  const result = await openDeleteAlbum({ album })
  if (result.action === 'cancel') return
  albums.value = albums.value.filter((item) => item.id !== album.id)
}

function albumMenuItems(album: Album): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Rename',
        icon: 'i-lucide-pencil',
        onSelect: () => renameAlbum(album),
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => deleteAlbum(album),
      },
    ],
  ]
}
</script>


<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex items-center justify-end gap-2 py-5 px-4">
      <UButton color="primary" @click="openCreateAlbumModal">
        Create Album
      </UButton>
    </div>

    <div class="flex items-center justify-between gap-4 px-4 pb-4">
      <h3 class="text-2xl font-semibold text-foreground">
        Albums
      </h3>
    </div>

    <div class="min-h-0 flex-1">
      <UScrollArea class="h-full min-h-0">
        <template v-if="isLoading">
          <USkeleton class="mx-4 h-40" />
        </template>

        <div v-else-if="albums.length === 0" class="px-4 py-8 text-center text-sm text-muted-500">
          No albums yet
        </div>

        <div v-else class="grid grid-cols-2 gap-6 px-4 pb-8 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="album in albums" :key="album.id" class="group relative">
            <AlbumPreview :album="album" />
            <div class="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
              <UDropdownMenu :items="albumMenuItems(album)" :content="{ align: 'end' }">
                <UButton icon="i-heroicons-ellipsis-vertical-20-solid" color="neutral" variant="ghost" size="xs" square
                  class="bg-white/80 text-muted-700 hover:bg-white" @click.stop />
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </UScrollArea>
    </div>
  </div>
</template>
