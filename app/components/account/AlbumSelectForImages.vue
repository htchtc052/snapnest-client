<script setup lang="ts">
import { onMounted } from 'vue';
import AlbumCreateModal from '~/components/account/AlbumCreateModal.vue';
import AlbumPreview from '~/components/account/AlbumPreview.vue';
import BaseModal from '~/components/ui/containers/BaseModal.vue';
import { useAlbumAttachImages } from '~/composables/account/useAlbumAttachImages';
import { useAlbumsGet } from '~/composables/account/useAlbumsGet';
import { useOpenModal } from '~/composables/useOpenModal';
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
  <BaseModal @close="closeModal()">
    <template #title>Choose album for {{ props.imageIds.length }} image{{ props.imageIds.length === 1 ? '' : 's'
    }}</template>

    <UButton type="button" variant="ghost" class="w-full justify-center gap-2 text-sm" @click="createAndAttach">
      <Icon name="i-heroicons-plus-20-solid" class="h-5 w-5" />
      New album
    </UButton>

    <div v-if="isAlbumsLoading" class="py-4 text-center text-sm text-gray-600">
      Loading albums...
    </div>

    <div v-else>
      <div v-if="albums.length === 0" class="py-4 text-center text-sm text-gray-600">
        No albums yet
      </div>
      <div v-else class="relative">
        <div class="grid grid-cols-2 gap-3 py-2">
          <div v-for="album in albums" :key="album.id">
            <AlbumPreview :album="album" action="emit"
              :class="isAttaching ? 'cursor-wait opacity-70' : 'cursor-pointer'" @select="attachToAlbum(album)" />
          </div>
        </div>
        <div v-if="isAttaching" class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
          <Icon name="i-heroicons-arrow-path-20-solid" class="h-5 w-5 animate-spin text-white" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
