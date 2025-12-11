<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '~/models/user'

import { formatYMD } from '~/helpers/formatYMD'
import { useOpenModal } from '~/composables/useOpenModal'

import type { Album } from '~/models/Album'
import AlbumCreateModal from '~/components/modals/AlbumCreateModal.vue'
import AlbumDeleteModal from '~/components/modals/AlbumDeleteModal.vue'
import AlbumUpdateModal from '~/components/modals/AlbumUpdateModal.vue'

import { useAccountAlbums } from '~/composables/useAccountAlbums'
import type { AlbumUpdateResult, AlbumCreateResult } from '~/contracts/album-manage.contract'

const {
  data: albums,
  pending: isLoading,
  error,
  refresh,
} = await useAsyncData<Album[]>(
    'account-albums',
    () => useAccountAlbums(),
    {
      default: () => [],
    },
)

if (error.value) {
  console.error('[Albums] Failed to load albums', error.value)
  throw error.value
}

const openCreate = useOpenModal<typeof AlbumCreateModal, AlbumCreateResult>(AlbumCreateModal)
const openDelete = useOpenModal<typeof AlbumDeleteModal, boolean>(AlbumDeleteModal)
const openUpdate = useOpenModal<typeof AlbumUpdateModal, AlbumUpdateResult>(AlbumUpdateModal)

async function openCreateModal() {
  const created = await openCreate()
  if (created) {
    await refresh()
  }
}

async function openDeleteAlbumModal(album: Album) {
  const ok = await openDelete({ album })
  if (ok) {
    albums.value = albums.value.filter(a => a.id !== album.id)
  }
}

async function openUpdateAlbumModal(album: Album) {
  const res = await openUpdate({ album })
  if (res) {
    albums.value = albums.value.map(a => (a.id === res.id ? res : a))
  }
}
</script>


<template>
  <div>
    <div class="flex items-center justify-between py-6">
      <h1 class="text-3xl font-semibold">Albums</h1>
      <div class="flex gap-2">
        <UButton color="primary" @click="openCreateModal">
          <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
          Add album
        </UButton>
      </div>
    </div>

      <AppGrid
          :items="albums"
          :is-loading="isLoading"
      >
        <template #default="{ item }: { item: Album }">
          <AppGridCard>
            <template #default>
              <div class="aspect-square overflow-hidden rounded">
                <a
                    v-if="item.coverPreviewUrl"
                    :href="item.coverPreviewUrl"
                    class="block w-full h-full"
                >
                  <img
                      :src="item.coverPreviewUrl"
                      :alt="item.name"
                      class="w-full h-full object-contain"
                  >
                </a>

                <div
                    v-else
                    class="w-full h-full rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400"
                >
                  No cover
                </div>
              </div>
              <div class="mt-2">
                {{ item.name }}
              </div>
              <div class="text-xs">
                {{ formatYMD(item.createdAt) }}
              </div>
            </template>

            <template #footer>
              <div class="flex gap-2">
                <UButton
                    variant="outline"
                    class="p-1.5"
                    @click.stop="openUpdateAlbumModal(item)"
                >
                  <Icon
                      name="i-heroicons-pencil-square-20-solid"
                      class="w-4 h-4"
                  />
                </UButton>
                <UButton
                    variant="outline"
                    color="error"
                    class="p-1.5"
                    @click.stop="openDeleteAlbumModal(item)"
                >
                  <Icon
                      name="i-heroicons-trash-20-solid"
                      class="w-4 h-4"
                  />
                </UButton>
              </div>
            </template>
          </AppGridCard>
        </template>
      </AppGrid>

  </div>
</template>
