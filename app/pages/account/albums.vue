<script setup lang="ts">
import { computed } from 'vue'

import { useOpenModal } from '~/composables/useOpenModal'

import AlbumCreateModal from '~/components/modals/AlbumCreateModal.vue'
import AlbumUpdateModal from '~/components/modals/AlbumUpdateModal.vue'
import AlbumDeleteModal from '~/components/modals/AlbumDeleteModal.vue'
import type { Album } from '~/models/Album'

import AlbumGridCard from '~/components/card/AlbumGridCard.vue'
import AlbumsActions from '~/components/section/actions/AlbumsActions.vue'
import { useSelection } from '~/composables/useSelection'

import { useAlbums } from '~/composables/useAlbums'
import type { AlbumCreateResult, AlbumUpdateResult } from '~/contracts/album-manage.contract'

const {
  data: albums,
  pending: isLoading,
  error,
  refresh,
} = await useAsyncData<Album[]>(
  'account-albums',
  () => useAlbums(),
  {
    default: () => [],
  },
)

if (error.value) {
  console.error('[Albums] Failed to load albums', error.value)
  throw error.value
}

const selection = useSelection()
const selectedAlbumIds = selection.keys
const selectedCount = computed(() => selectedAlbumIds.value.length)

const openCreate = useOpenModal<typeof AlbumCreateModal, AlbumCreateResult>(AlbumCreateModal)
const openGroupDelete = useOpenModal<typeof AlbumDeleteModal, boolean>(AlbumDeleteModal)
const openUpdate = useOpenModal<typeof AlbumUpdateModal, AlbumUpdateResult>(AlbumUpdateModal)

async function openCreateModal() {
  const created = await openCreate()
  if (created) {
    await refresh()
  }
}

async function openUpdateAlbumModal(album: Album) {
  const res = await openUpdate({ album })
  if (res) {
    albums.value = albums.value.map(a => (a.id === res.id ? res : a))
  }
}

async function openDeleteAlbumModal(album: Album) {
  const ok = await openGroupDelete({ albumIds: [album.id] })
  if (ok) {
    albums.value = albums.value.filter(a => a.id !== album.id)
  }
}

async function deleteSelectedAlbums() {
  if (!selectedAlbumIds.value.length) return

  const idsToDelete = [...selectedAlbumIds.value]
  const ok = await openGroupDelete({ albumIds: idsToDelete })
  if (ok) {
    albums.value = albums.value.filter(album => !idsToDelete.includes(album.id))
    selection.clear()
  }
}
</script>


<template>
  <div>
    <AppSection>
      <div class="flex items-center justify-between">
        <AppSectionTitle>
          Albums
        </AppSectionTitle>

        <div class="flex gap-2">
          <UButton color="primary" @click="openCreateModal">
            <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
            Add album
          </UButton>
        </div>
      </div>
    </AppSection>

    <AlbumsActions
        :selected-count="selectedCount"
        :on-delete="deleteSelectedAlbums"
    />

    <AppLoader v-if="isLoading" />

    <AppEmptyState v-else-if="albums.length === 0">
      No albums yet
    </AppEmptyState>

    <div v-else>
      <AppGrid>
        <AlbumGridCard
            v-for="item in albums"
            :key="item.id"
            :album="item"
            :selected="selection.isSelected(item.id)"
            @toggle-select="selection.toggle"
            @edit="openUpdateAlbumModal"
            @delete="openDeleteAlbumModal"
        />
      </AppGrid>
    </div>
  </div>
</template>
