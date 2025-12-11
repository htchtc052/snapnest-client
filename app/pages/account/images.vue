<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Image } from '~/models/Image'

import ImageDeleteModal from '~/components/modals/ImageDeleteModal.vue'
import ImagesUploadModal from '~/components/modals/ImagesUploadModal.vue'
import ImageUpdateModal from '~/components/modals/ImageUpdateModal.vue'

import { useAccountImages } from '~/composables/useAccountImages'
import { useOpenModal } from '~/composables/useOpenModal'
import type { ImageUpdateResult } from '~/contracts/image-update.contract'

import AppBulkActions from '~/components/app/BulkActions.vue'
import CardImage from '~/components/card/Image.vue'
import { useSelection } from '~/composables/useSelection'
import type { PagingInfo } from '~/contracts/pagination-contract'
import { getPaging } from '~/http/get-paging'

const fetchAccountImagesPage = useAccountImages()

const {
  data: firstPage,
  pending: isInitialLoading,
  error,
  refresh,
} = await useAsyncData(
  'account-images',
  () => fetchAccountImagesPage(1),
)

if (error.value) {
  console.error('[Images] Failed to load images', error.value)
}

const images = ref<Image[]>(firstPage.value?.data ?? [])
const paging = ref<PagingInfo>(getPaging(firstPage.value?.meta ?? null))

const hasMore = computed(() => paging.value.hasMore)
const nextPage = computed(() => paging.value.nextPage)

const selection = useSelection()
const selectedImageIds = selection.keys
const selectedCount = computed(() => selectedImageIds.value.length)

type BulkAction = 'delete' | 'addToAlbum'

const bulkActions: { value: BulkAction; label: string }[] = [
  { value: 'delete', label: 'Delete' },
  { value: 'addToAlbum', label: 'Add to album' },
]

const bulkAction = ref<BulkAction | undefined>(undefined)

function applyBulkAction() {
  if (!bulkAction.value || selectedImageIds.value.length === 0) {
    console.log('No action or no image selected')
    return
  }

  console.log('Bulk action:', bulkAction.value, 'image:', selectedImageIds.value)

  // TODO: реальные действия
  // selection.clear()
  // bulkAction.value = undefined
}

const isLoadingMore = ref(false)

async function loadMore() {
  if (!hasMore.value || isLoadingMore.value) return

  isLoadingMore.value = true
  try {
    const res = await fetchAccountImagesPage(nextPage.value)
    images.value.push(...res.data)
    paging.value = getPaging(res.meta)
  } catch (e) {
    console.error('[Images] Failed to load more images', e)
  } finally {
    isLoadingMore.value = false
  }
}

// --- модалки ---
const openUpload = useOpenModal<typeof ImagesUploadModal, boolean>(ImagesUploadModal)
const openDelete = useOpenModal<typeof ImageDeleteModal, boolean>(ImageDeleteModal)
const openUpdate = useOpenModal<typeof ImageUpdateModal, ImageUpdateResult>(ImageUpdateModal)

async function openUploadModal() {
  const ok = await openUpload()
  if (ok) {
    await refresh()
    if (firstPage.value) {
      images.value = firstPage.value.data
      paging.value = getPaging(firstPage.value.meta)
      selection.clear()
      bulkAction.value = undefined
    }
  }
}

async function openDeleteImageModal(image: Image) {
  const ok = await openDelete({ image })
  if (ok) {
    images.value = images.value.filter(i => i.id !== image.id)
  }
}

async function openUpdateImageModal(image: Image) {
  const res = await openUpdate({ image })
  if (res) {
    images.value = images.value.map(i => (i.id === res.id ? res : i))
  }
}
</script>

<template>
  <div>
    <AppSection>
      <div class="flex items-center justify-between">
        <AppSectionTitle>
          Images
        </AppSectionTitle>

        <div class="flex gap-2">
          <UButton color="primary" @click="openUploadModal">
            <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
            Upload images
          </UButton>
        </div>
      </div>
    </AppSection>

    <AppBulkActions v-model="bulkAction" :selected-count="selectedCount" :actions="bulkActions"
      @apply="applyBulkAction" />

    <AppLoader v-if="isInitialLoading" />

    <AppEmptyState v-else-if="!images.length">
      No images yet
    </AppEmptyState>

    <div v-else>
      <AppFancybox>
        <AppGrid>
          <CardImage
v-for="item in images" :key="item.id" :image="item" :selected="selection.isSelected(item.id)"
            @toggle-select="selection.toggle" @edit="openUpdateImageModal" @delete="openDeleteImageModal" />
        </AppGrid>
      </AppFancybox>

      <div v-if="hasMore" class="mt-6 flex justify-center">
        <UButton :loading="isLoadingMore" @click="loadMore">
          Load more
        </UButton>
      </div>
    </div>
  </div>
</template>
