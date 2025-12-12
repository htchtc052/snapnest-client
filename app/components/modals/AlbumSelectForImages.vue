<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppCard from '~/components/app/Card.vue'
import AppEmptyState from '~/components/app/EmptyState.vue'
import AppGrid from '~/components/app/Grid.vue'
import AppLoader from '~/components/app/Loader.vue'
import AppModal from '~/components/app/Modal.vue'
import AppSection from '~/components/app/Section.vue'
import AlbumSelectForImagesCard from '~/components/card/AlbumSelectForImagesCard.vue'
import AlbumCreateModal from '~/components/modals/AlbumCreateModal.vue'
import { useAccountAlbums } from '~/composables/useAccountAlbums'
import { useAlbumAttachImages } from '~/composables/useAlbumAttachImages'
import { useOpenModal } from '~/composables/useOpenModal'
import type { Album } from '~/models/Album'

const props = defineProps<{ imageIds: number[] }>()
const emit = defineEmits<{ (e: 'close', value: boolean): void }>()

const albums = ref<Album[]>([])
const isLoading = ref(false)
const attachingAlbumId = ref<number | null>(null)
const creating = ref(false)
const statusText = computed(() => {
  if (creating.value) return 'Creating album...'
  if (attachingAlbumId.value) return 'Adding images to album...'
  return ''
})

const toast = useToast()
const router = useRouter()
const openCreateAlbum = useOpenModal<typeof AlbumCreateModal, Album | false>(AlbumCreateModal)

function closeModal(result = false) {
  emit('close', result)
}

async function loadAlbums() {
  isLoading.value = true
  try {
    albums.value = await useAccountAlbums()
  } catch (error) {
    console.error('[Albums] Failed to load albums', error)
    toast.add({ title: 'Failed to load albums', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

async function attachToAlbum(albumId: number) {
  if (!props.imageIds.length) {
    closeModal(false)
    return
  }

  attachingAlbumId.value = albumId
  try {
    await useAlbumAttachImages(albumId, props.imageIds)

    toast.add({
      title: 'Images added to album',
      description: `${props.imageIds.length} image(s) attached`,
      color: 'success',
    })
    closeModal(true)
    router.push(`/albums/${albumId}`)
  } catch (error) {
    console.error('[Albums] Failed to attach images to album', error)
    toast.add({ title: 'Failed to add images to album', color: 'error' })
  } finally {
    attachingAlbumId.value = null
  }
}

async function createAndAttach() {
  creating.value = true
  const created = await openCreateAlbum({ imageIds: props.imageIds })
  creating.value = false
  if (!created || !created.id) return

  albums.value = [created, ...albums.value]
  toast.add({
    title: 'Images added to album',
    description: `${props.imageIds.length} image(s) attached`,
    color: 'success',
  })
  closeModal(true)
  router.push(`/albums/${created.id}`)
}

onMounted(loadAlbums)
</script>

<template>
  <AppModal @close="closeModal()">
    <template #title>Choose album for {{ props.imageIds.length }} image{{ props.imageIds.length === 1 ? '' : 's'
    }}</template>
    <AppSection>
      <AppLoader v-if="isLoading" />

      <AppEmptyState v-else-if="!albums.length">
        No albums yet
      </AppEmptyState>

      <div v-if="statusText" class="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="i-heroicons-arrow-path-20-solid" class="h-4 w-4 animate-spin" />
        <span>{{ statusText }}</span>
      </div>

      <AppGrid gap="gap-3">
        <AppCard class="border-dashed">
          <UButton type="button" variant="ghost" class="w-full justify-center gap-2 text-sm" :loading="creating"
            @click="createAndAttach">
            <Icon name="i-heroicons-plus-20-solid" class="h-5 w-5" />
            New album
          </UButton>
        </AppCard>

        <AlbumSelectForImagesCard v-for="album in albums" :key="album.id" :album="album"
          :disabled="attachingAlbumId === album.id" @select="attachToAlbum" />
      </AppGrid>
    </AppSection>
  </AppModal>
</template>
