<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Image } from '~/models/Image'

import AlbumSelectForImages from '~/components/modals/album/AlbumSelectForImages.vue'
import ImageDeleteModal from '~/components/modals/image/ImageDeleteModal.vue'
import ImagesUploadModal from '~/components/modals/image/ImagesUploadModal.vue'
import ImageUpdateModal from '~/components/modals/image/ImageUpdateModal.vue'

import { useOpenModal } from '~/composables/useOpenModal'
import type { ImageUpdateResult } from '~/contracts/image-update.contract'
import { useImages } from '~/http/composables/useImages'

import ImageCard from '~/components/cards/image/ImageCard.vue'
import ImageGroupActionsSection from '~/components/sections/image/ImageGroupActionsSection.vue'
import BaseSection from '~/components/sections/base/Section.vue'
import BaseSectionTitle from '~/components/sections/base/SectionTitle.vue'
import Loader from '~/components/loaders/Loader.vue'
import EmptyStateSection from '~/components/sections/blocks/EmptyStateSection.vue'
import Fancybox from '~/components/integrations/fancybox/Fancybox.vue'
import Grid from '~/components/grids/Grid.vue'
import { useSelection } from '~/composables/useSelection'
import type { PagingInfo } from '~/contracts/pagination-contract'
import { getPaging } from '~/http/utils/get-paging'

const fetchImages = useImages()

const {
  data: firstPage,
  pending: isInitialLoading,
  error,
  refresh,
} = await useAsyncData(
  'account-images',
  () => fetchImages(1),
)

if (error.value) {
  console.error('[Images] Failed to load images', error.value)
}

const images = ref<Image[]>(firstPage.value?.data ?? [])
const paging = ref<PagingInfo>(getPaging(firstPage.value?.meta ?? null))


const isLoadingMore = ref(false)

async function loadMore() {
  if (isLoadingMore.value) return
  isLoadingMore.value = true
  try {
    const res = await fetchImages(paging.value.nextPage)
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



const selection = useSelection()
const selectedImageIds = selection.keys
const selectedCount = computed(() => selectedImageIds.value.length)

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
    <BaseSection>
      <div class="flex items-center justify-between">
        <BaseSectionTitle>
          Images
        </BaseSectionTitle>

        <div class="flex gap-2">
          <UButton color="primary" @click="openUploadModal">
            <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
            Upload images
          </UButton>
        </div>
      </div>
    </BaseSection>

    <ImageGroupActionsSection :selected-count="selectedCount" :on-delete="deleteSelectedImages"
      :on-add-to-album="addSelectedToAlbum" />

    <Loader v-if="isInitialLoading" />

    <EmptyStateSection v-else-if="!images.length">
      No images yet
    </EmptyStateSection>

    <div v-else>
      <Fancybox>
        <Grid>
          <ImageCard v-for="item in images" :key="item.id" :image="item" :selected="selection.isSelected(item.id)"
            @toggle-select="selection.toggle" @edit="openUpdateImageModal" @delete="openDeleteImageModal" />
        </Grid>
      </Fancybox>

      <div v-if="paging.hasMore" class="mt-6 flex justify-center">
        <UButton :loading="isLoadingMore" @click="loadMore">
          Load more
        </UButton>
      </div>
    </div>
  </div>
</template>
