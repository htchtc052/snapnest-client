<script setup lang="ts">
import { onBeforeRouteLeave, ref, watch } from '#imports'
import { useEventListener } from '@vueuse/core'
import AlbumSelectForImages from '~/components/account/AlbumSelectForImages.vue'
import ImageDeleteModal from '~/components/account/ImageDeleteModal.vue'
import ImageShareModal from '~/components/account/ImageShareModal.vue'
import ImageUpdateModal from '~/components/account/ImageUpdateModal.vue'
import { useImagesGet } from '~/composables/account/useImagesGet'
import { useOpenModal } from '~/composables/useOpenModal'
import { provideSelectionStore } from '~/composables/useSelection'
import { useUploadsStore } from '~/stores/uploadsStore'
import type { AttachImagesModalResult } from '~/types/image-attach.contract'
import type { DeleteImagesModalResult } from '~/types/image-delete.contract'
import type { ImageShareModalResult } from '~/types/image-share.contract'
import type { ImageUpdateModalResult } from '~/types/image-update.contract'
import type { Image } from '~/types/image.model'

definePageMeta({
  layout: 'media',
})

const {
  imagesGrouped,
  isLoading,
  isLoadingMore,
  grouping,
  resetAndReload,
  removeImages,
  updateImage,
  scrollArea,
} = useImagesGet()
const uploadsStore = useUploadsStore()
const hasUploadRefresh = ref(false)

const {
  selectedImagesData,
  selectedIds,
  selectionMode,
  hasSelection,
  selectionLabel,
  showClearToggle,
  canRename,
  toggleSelection,
  clearSelection,
  groupSelectionValue,
  toggleGroupSelection,
} = provideSelectionStore()

const openAttachModal = useOpenModal<typeof AlbumSelectForImages, AttachImagesModalResult>(AlbumSelectForImages)
const openDeleteModal = useOpenModal<typeof ImageDeleteModal, DeleteImagesModalResult>(ImageDeleteModal)
const openShareModal = useOpenModal<typeof ImageShareModal, ImageShareModalResult>(ImageShareModal)
const openUpdateModal = useOpenModal<typeof ImageUpdateModal, ImageUpdateModalResult>(ImageUpdateModal)

const groupingTabs = [
  { label: 'Days', value: 'day' },
  { label: 'Months', value: 'month' },
  { label: 'Years', value: 'year' },
]

watch(() => uploadsStore.isDone, (done) => {
  if (!done) {
    hasUploadRefresh.value = false
    return
  }
  if (hasUploadRefresh.value) return
  hasUploadRefresh.value = true
  resetAndReload()
})

onBeforeRouteLeave(() => {
  clearSelection()
})

useEventListener(
  () => window,
  'keydown',
  (event) => {
    if (event.key !== 'Escape' || !hasSelection.value) return
    clearSelection()
  },
)

function handleImageSelection(image: Image) {
  if (!selectionMode.value) return
  toggleSelection(image)
}

async function confirmDelete() {
  const ids = selectedIds.value
  const modalResult = await openDeleteModal({ ids })
  if (modalResult.action === 'cancel') return
  if (modalResult.deletedIds?.length) {
    clearSelection()
    removeImages(modalResult.deletedIds)
  }
}

async function renameImage() {
  const modalResult = await openUpdateModal({
    image: selectedImagesData.value[selectedIds.value[0]!] as Image,
  })
  if (modalResult.action === 'cancel') return
  clearSelection()
  updateImage(modalResult.image)

}

async function addToAlbum() {
  const ids = selectedIds.value
  const modalResult = await openAttachModal({ imageIds: ids })
  if (modalResult.action === 'cancel') return
  clearSelection()
}

async function shareImages() {
  const ids = selectedIds.value
  if (!ids.length) return
  const modalResult = await openShareModal({ imageIds: ids })
  if (modalResult.action === 'cancel') return
  clearSelection()
}

</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
    <UAlert v-if="hasSelection" color="primary" variant="solid" orientation="horizontal" :title="selectionLabel"
      class="my-4" :ui="{ title: 'truncate' }">
      <template #leading>
        <UCheckbox v-if="showClearToggle" :model-value="true" color="primary"
          :ui="{ base: 'ring-white/70', indicator: 'bg-white text-primary' }" @click.stop
          @update:model-value="clearSelection" />
      </template>

      <template #actions>
        <UButton
          icon="i-heroicons-folder-plus-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Add to album"
          @click="addToAlbum"
        >
          <span class="hidden sm:inline">Add to album</span>
        </UButton>
        <UButton
          icon="i-heroicons-link-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Share"
          @click="shareImages"
        >
          <span class="hidden sm:inline">Share</span>
        </UButton>
        <UButton
          v-if="canRename"
          icon="i-heroicons-pencil-square-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Rename"
          @click="renameImage"
        >
          <span class="hidden sm:inline">Rename</span>
        </UButton>
        <UButton
          icon="i-heroicons-trash-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Delete"
          @click="confirmDelete"
        >
          <span class="hidden sm:inline">Delete</span>
        </UButton>
        <UButton icon="i-heroicons-x-mark-20-solid" color="neutral" variant="ghost" size="sm" square class="text-white"
          @click="clearSelection" />
      </template>
    </UAlert>

    <UPageHeader title="Photos" class="pt-5 pb-4">
      <template #links>
        <UTabs v-model="grouping" :items="groupingTabs" :content="false" color="neutral" variant="pill" size="sm" />
      </template>
    </UPageHeader>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="imagesGrouped.length === 0" description="No images yet" size="md" variant="naked" class="py-8" />

      <UScrollArea v-else ref="scrollArea" v-slot="{ item, index }" :items="imagesGrouped"
        :virtualize="{ estimateSize: 320, overscan: 400 }" class="min-h-0 flex-1">
        <div class="space-y-3 py-3" :data-group-index="index">
          <UCheckbox :model-value="groupSelectionValue(item.items)" color="primary" :label="item.label"
            :ui="{ label: 'truncate text-lg font-semibold text-foreground leading-none' }"
            @update:model-value="() => toggleGroupSelection(item.items)" />

          <UPageGrid class="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            <UPageCard
              v-for="image in item.items"
              :key="image.id"
              variant="naked"
              class="relative aspect-square overflow-hidden rounded-lg"
              @click="handleImageSelection(image)"
            >
              <img :src="image.previewUrl" :alt="image.name" class="h-full w-full object-cover">

              <UCheckbox
                :model-value="Boolean(selectedImagesData[image.id])"
                color="primary"
                class="absolute bottom-2 left-2 z-10"
                @click.stop
                @update:model-value="() => toggleSelection(image)"
              />
            </UPageCard>
          </UPageGrid>
        </div>
      </UScrollArea>

      <UProgress v-if="isLoadingMore" indeterminate size="xs" class="py-2" />
    </template>
  </div>
</template>
