<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Image } from '~/models/Image'

import ImageDeleteModal from '~/components/modals/ImageDeleteModal.vue'
import ImagesUploadModal from '~/components/modals/ImagesUploadModal.vue'
import ImageUpdateModal from '~/components/modals/ImageUpdateModal.vue'
import AlbumSelectForImages from '~/components/modals/AlbumSelectForImages.vue'

import { useImages } from '~/composables/useImages'
import { useOpenModal } from '~/composables/useOpenModal'
import type { ImageUpdateResult } from '~/contracts/image-update.contract'

import CardImage from '~/components/card/Image.vue'
import ImagesActions from '~/components/section/actions/ImagesActions.vue'
import { useSelection } from '~/composables/useSelection'
import type { PagingInfo } from '~/contracts/pagination-contract'
import { getPaging } from '~/http/get-paging'

const fetchImagesPage = useImages()

const {
  data: firstPage,
  pending: isInitialLoading,
  error,
  refresh,
} = await useAsyncData(
  'account-images',
  () => fetchImagesPage(1),
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

const isLoadingMore = ref(false)

async function loadMore() {
  if (!hasMore.value || isLoadingMore.value) return

  isLoadingMore.value = true
  try {
    const res = await fetchImagesPage(nextPage.value)
    images.value.push(...res.data)
    paging.value = getPaging(res.meta)
  } catch (e) {
    console.error('[Images] Failed to load more images', e)
  } finally {
    isLoadingMore.value = false
  }
}

const openUpload = useOpenModal<typeof ImagesUploadModal, boolean>(ImagesUploadModal)
const openUpdate = useOpenModal<typeof ImageUpdateModal, ImageUpdateResult>(ImageUpdateModal)
const openGroupDelete = useOpenModal<typeof ImageDeleteModal, boolean>(ImageDeleteModal)
const openAlbumSelect = useOpenModal<typeof AlbumSelectForImages, boolean>(AlbumSelectForImages)

async function openUploadModal() {
  const ok = await openUpload()
  if (ok) {
    await refresh()
    if (firstPage.value) {
      images.value = firstPage.value.data
      paging.value = getPaging(firstPage.value.meta)
      selection.clear()
    }
  }
}

async function openUpdateImageModal(image: Image) {
  const res = await openUpdate({ image })
  if (res) {
    images.value = images.value.map(i => (i.id === res.id ? res : i))
  }
}

async function openDeleteImageModal(image: Image) {
  const ok = await openGroupDelete({ imageIds: [image.id] })
  if (ok) {
    images.value = images.value.filter(i => i.id !== image.id)
    selection.keys.value = selection.keys.value.filter(id => id !== image.id)
  }
}

async function deleteSelectedImages() {
  if (!selectedImageIds.value.length) return

  const idsToDelete = [...selectedImageIds.value]
  const ok = await openGroupDelete({ imageIds: idsToDelete })
  if (ok) {
    images.value = images.value.filter(image => !idsToDelete.includes(image.id))
    selection.clear()
  }
}

async function addSelectedToAlbum() {
  if (!selectedImageIds.value.length) return

  const ok = await openAlbumSelect({ imageIds: [...selectedImageIds.value] })
  if (ok) {
    selection.clear()
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

    <ImagesActions
        :selected-count="selectedCount"
        :on-delete="deleteSelectedImages"
        :on-add-to-album="addSelectedToAlbum"
    />

    <AppLoader v-if="isInitialLoading" />

    <AppEmptyState v-else-if="!images.length">
      No images yet
    </AppEmptyState>

    <div v-else>
      <AppFancybox>
        <AppGrid>
          <CardImage v-for="item in images" :key="item.id" :image="item" :selected="selection.isSelected(item.id)"
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
