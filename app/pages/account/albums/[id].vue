<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Album } from '~/models/Album'
import type { Image } from '~/models/Image'

import AppEmptyState from '~/components/app/EmptyState.vue'
import AppFancybox from '~/components/app/Fancybox.vue'
import AppGrid from '~/components/app/Grid.vue'
import AppLoader from '~/components/app/Loader.vue'
import AppSection from '~/components/app/Section.vue'
import AppSectionTitle from '~/components/app/SectionTitle.vue'
import CardImage from '~/components/card/Image/ImageCard.vue'
import ImageUpdateModal from '~/components/modals/ImageUpdateModal.vue'
import AlbumImagesActions from '~/components/section/actions/AlbumImagesActions.vue'
import { useOpenModal } from '~/composables/useOpenModal'
import { useSelection } from '~/composables/useSelection'
import type { ImageUpdateResult } from '~/contracts/image-update.contract'
import { useAlbum } from '~/http/composables/useAlbum'
import { useAlbumDetachImages } from '~/http/composables/useAlbumDetachImages'
import { getPaging } from '~/http/utils/get-paging'

const route = useRoute()
const albumId = computed(() => Number(route.params.id))
const fetchAlbum = useAlbum(albumId.value)

const {
  data: firstLoad,
  pending: isInitialLoading,
  error,
} = await useAsyncData(
  () => fetchAlbum(1),
)

if (error.value) {
  console.error('[Album] Failed to load album', error.value)
}

const album = ref<Album | null>(firstLoad.value?.album ?? null)
const images = ref<Image[]>(firstLoad.value?.data ?? [])
const paging = ref(getPaging(firstLoad.value?.meta ?? null))

const isLoadingMore = ref(false)


async function loadMore() {
  if (isLoadingMore.value) return
  isLoadingMore.value = true
  try {
    const res = await fetchAlbum(paging.value.nextPage)
    images.value.push(...res.data)
    paging.value = getPaging(res.meta)
    album.value = res.album
  } catch (e) {
    console.error('[Album] Failed to load more images', e)
  } finally {
    isLoadingMore.value = false
  }
}

const selection = useSelection()
const selectedIds = selection.keys
const selectedCount = computed(() => selectedIds.value.length)


async function removeImages(imageIds: number[]) {
  if (!imageIds.length) return
  try {
    await useAlbumDetachImages(albumId.value, imageIds)
    images.value = images.value.filter(img => !imageIds.includes(img.id))
    selection.clear()
    if (album.value) {
      album.value = { ...album.value, imagesCount: album.value.imagesCount - imageIds.length }
    }
    toast.add({ title: 'Removed from album', color: 'success' })
  } catch (e) {
    console.error('[Album] Failed to detach images', e)
    toast.add({ title: 'Failed to remove from album', color: 'error' })
  }
}

async function removeSelected() {
  await removeImages([...selectedIds.value])
}

const openUpdate = useOpenModal<typeof ImageUpdateModal, ImageUpdateResult>(ImageUpdateModal)
const toast = useToast()

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
        <div>
          <AppSectionTitle>
            {{ album?.name }}
          </AppSectionTitle>
          <p class="text-sm text-gray-600">
            {{ album?.imagesCount }} images
          </p>
        </div>
      </div>
    </AppSection>

    <AlbumImagesActions :selected-count="selectedCount" :on-remove="removeSelected" />

    <AppLoader v-if="isInitialLoading" />

    <AppEmptyState v-else-if="!images.length">
      No images yet
    </AppEmptyState>

    <div v-else>
      <AppFancybox>
        <AppGrid>
          <CardImage v-for="item in images" :key="item.id" :image="item" :selected="selection.isSelected(item.id)"
            @toggle-select="selection.toggle" @edit="openUpdateImageModal" />
        </AppGrid>
      </AppFancybox>

      <div v-if="paging.hasMore" class="mt-6 flex justify-center">
        <UButton :loading="isLoadingMore" @click="loadMore">
          Load more
        </UButton>
      </div>
    </div>
  </div>
</template>
