<script setup lang="ts">
import { onMounted } from '#imports'
import AlbumPreview from '~/components/album/AlbumPreview.vue'
import AlbumCreateModal from '~/components/modals/album/AlbumCreateModal.vue'
import { useOpenModal } from '~/composables/useOpenModal'
import { useGetAlbums } from '~/composables/useGetAlbums'
import type { AlbumCreateResult } from '~/contracts/album-manage.contract'

definePageMeta({
  layout: 'media',
})

const { albums, isLoading, loadAlbums } = useGetAlbums()
const openCreateAlbum = useOpenModal<typeof AlbumCreateModal, AlbumCreateResult>(AlbumCreateModal)

onMounted(() => {
  loadAlbums()
})

async function openCreateAlbumModal() {
  const ok = await openCreateAlbum()
  if (!ok) return
  await loadAlbums()
}
</script>


<template>
  <div>
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

    <template v-if="isLoading">
      <USkeleton class="mx-4 h-40" />
    </template>

    <div v-else-if="albums.length === 0" class="px-4 py-8 text-center text-sm text-muted-500">
      No albums yet
    </div>

    <div v-else class="grid grid-cols-2 gap-6 px-4 pb-8 md:grid-cols-3 lg:grid-cols-4">
      <AlbumPreview v-for="album in albums" :key="album.id" :album="album" />
    </div>
  </div>
</template>
