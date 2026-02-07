<script setup lang="ts">
import { onMounted, useTemplateRef } from '#imports';
import AlbumCreateModal from '~/components/account/AlbumCreateModal.vue';
import { useAlbumAttachImages } from '~/composables/account/useAlbumAttachImages';
import { useAlbumsGet } from '~/composables/account/useAlbumsGet';
import { useOpenModal } from '~/composables/useOpenModal';
import { useVirtualGridLanes } from '~/composables/useVirtualGridLanes';
import type { AlbumCreateModalResult } from '~/types/album-create.contracts';
import type { Album } from '~/types/album.model';
import type { AttachImagesModalResult } from '~/types/image-attach.contract';


const props = defineProps<{ imageIds: number[] }>()
const emit = defineEmits<{ (e: 'close', value: AttachImagesModalResult): void }>()


const { albumAttachImages, isAttaching } = useAlbumAttachImages()
const openCreateAlbum = useOpenModal<typeof AlbumCreateModal, AlbumCreateModalResult>(AlbumCreateModal)



function closeModal() {
  emit('close', { action: 'cancel' })
}


const { albums, isLoading: isAlbumsLoading, loadAlbums } = useAlbumsGet()
const scrollArea = useTemplateRef('scrollArea')
const { lanes } = useVirtualGridLanes(() => scrollArea.value?.$el, {
  min: 2,
  max: 5,
  targetWidth: 200,
})

async function attachToAlbum(album: Album) {
  if (isAttaching.value) return

  await albumAttachImages(album, props.imageIds)

  emit('close', { action: 'confirm' })
}


async function createAndAttach() {
  const result = await openCreateAlbum({ imageIds: props.imageIds })
  if (result.action === 'cancel') return
  emit('close', { action: 'confirm' })
}

onMounted(loadAlbums);

</script>

<template>
  <UModal
    :close="{ onClick: closeModal }"
    :ui="{ content: 'bg-default rounded-lg divide-none px-6 py-4 w-[min(96vw,1280px)] max-w-7xl' }"
  >
    <template #title>Choose album for {{ props.imageIds.length }} image{{ props.imageIds.length === 1 ? '' : 's'
    }}</template>

    <template #body>
      <UButton type="button" variant="ghost" class="w-full justify-center gap-2 text-sm" @click="createAndAttach">
        <Icon name="i-heroicons-plus-20-solid" class="h-5 w-5" />
        New album
      </UButton>

      <UProgress v-if="isAttaching" indeterminate size="xs" class="mt-3" />

      <USkeleton v-if="isAlbumsLoading" class="mt-3 h-24" />

      <UEmpty v-else-if="albums.length === 0" description="No albums yet" size="sm" variant="naked" class="py-4" />

      <UScrollArea
        v-else
        ref="scrollArea"
        v-slot="{ item: album }"
        :items="albums"
        :virtualize="{ estimateSize: 220, gap: 12, lanes }"
        class="mt-3 max-h-[65vh]"
      >
          <UPageCard
            :key="album.id"
            variant="outline"
            :class="isAttaching ? 'cursor-wait' : 'cursor-pointer'"
            :title="album.name"
            @click="attachToAlbum(album)"
          >
            <div class="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <img
                v-if="album.coverPreviewUrl"
                :src="album.coverPreviewUrl"
                :alt="album.name"
                class="h-full w-full object-cover"
              >
            </div>
          </UPageCard>
      </UScrollArea>
    </template>
  </UModal>
</template>
