<script setup lang="ts">
import { computed } from 'vue'

import type { AlbumCreateResult, AlbumUpdateResult } from '~/contracts/album-manage.contract'
import { useAlbums } from '~/http/composables/useAlbums'
import { useOpenModal } from '~/composables/useOpenModal'
import { useSelection } from '~/composables/useSelection'
import AlbumCreateModal from '~/components/modals/album/AlbumCreateModal.vue'
import AlbumDeleteModal from '~/components/modals/album/AlbumDeleteModal.vue'
import AlbumUpdateModal from '~/components/modals/album/AlbumUpdateModal.vue'
import type { Album } from '~/models/Album'
import AlbumListCard from '~/components/cards/album/AlbumListCard.vue'
import AlbumGroupActionsSection from '~/components/sections/album/AlbumGroupActionsSection.vue'
import BaseSection from '~/components/sections/base/Section.vue'
import BaseSectionTitle from '~/components/sections/base/SectionTitle.vue'
import Loader from '~/components/loaders/Loader.vue'
import EmptyStateSection from '~/components/sections/blocks/EmptyStateSection.vue'
import Grid from '~/components/grids/Grid.vue'

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
    <BaseSection>
      <div class="flex items-center justify-between">
        <BaseSectionTitle>
          Albums
        </BaseSectionTitle>

        <div class="flex gap-2">
          <UButton color="primary" @click="openCreateModal">
            <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
            Add album
          </UButton>
        </div>
      </div>
    </BaseSection>

    <AlbumGroupActionsSection :selected-count="selectedCount" :on-delete="deleteSelectedAlbums" />

    <Loader v-if="isLoading" />

    <EmptyStateSection v-else-if="albums.length === 0">
      No albums yet
    </EmptyStateSection>

    <div v-else>
      <Grid>
        <AlbumListCard v-for="item in albums" :key="item.id" :album="item" :selected="selection.isSelected(item.id)"
          @toggle-select="selection.toggle" @edit="openUpdateAlbumModal" />
      </Grid>
    </div>
  </div>
</template>
