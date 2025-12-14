<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Album, AlbumPage } from '~/models/Album'
import type { Image } from '~/models/Image'

import { getAlbumPage } from '~/api/albums/getAlbumPage'
import ImageCard from '~/components/cards/image/ImageCard.vue'
import Grid from '~/components/grids/Grid.vue'
import Fancybox from '~/components/integrations/fancybox/Fancybox.vue'
import Loader from '~/components/loaders/Loader.vue'
import ImageUpdateModal from '~/components/modals/image/ImageUpdateModal.vue'
import AlbumImagesGroupActionsSection from '~/components/sections/album/AlbumImagesGroupActionsSection.vue'
import BaseSection from '~/components/sections/base/Section.vue'
import BaseSectionTitle from '~/components/sections/base/SectionTitle.vue'
import EmptyStateSection from '~/components/sections/blocks/EmptyStateSection.vue'
import { useOpenModal } from '~/composables/useOpenModal'
import { useSelection } from '~/composables/useSelection'
import type { ImageUpdateResult } from '~/contracts/image-update.contract'
import { useAlbumDetachImages } from '~/http/composables/useAlbumDetachImages'
import { isNumericPageQueryParam } from '~/utils/isNumericPageQueryParam'
import { isNumericParam } from '~/utils/isNumericParam'

definePageMeta({
  key: route => route.fullPath,
  validate: route =>
    isNumericParam(route.params.id) &&
    isNumericPageQueryParam(route.query.page),
})

const route = useRoute()
const client = useSanctumClient()
const albumId = computed(() => Number(route.params.id))
const page = computed(() => Number(route.query.page ?? 1))

const {
  data: albumPageData,
  pending: isAlbumPageDataLoaging,
  error,
} = await useAsyncData(
  (): Promise<AlbumPage> => getAlbumPage(client, albumId.value, page.value),
)

const statusCode = error.value?.statusCode
if (statusCode === 404) {
  if (import.meta.dev) {
    console.error('[Album] Album not found', { albumId: albumId.value, page: page.value })
  }
  throw showError({ statusCode, statusMessage: 'Album not found' })
}

if (error.value) {
  console.error('[Album] Failed to load album', error.value)
}


const album = ref<Album>(albumPageData.value!.album)
const images = ref<Image[]>(albumPageData.value!.data ?? [])


const selection = useSelection()
const selectedIds = selection.keys
const selectedCount = computed(() => selectedIds.value.length)


async function removeImages(imageIds: number[]) {
  if (!imageIds.length) return
  try {
    await useAlbumDetachImages(albumId.value, imageIds)
    images.value = images.value.filter(img => !imageIds.includes(img.id))
    selection.clear()
    album.value = { ...album.value, imagesCount: album.value.imagesCount - imageIds.length }
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
    <Loader v-if="isAlbumPageDataLoaging" />

    <template v-else>
      <BaseSection>
        <div class="flex items-center justify-between">
          <div>
            <BaseSectionTitle>
              {{ album?.name }}
            </BaseSectionTitle>
            <p class="text-sm text-gray-600">
              {{ album?.imagesCount }} images
            </p>
          </div>
        </div>
      </BaseSection>

      <AlbumImagesGroupActionsSection :selected-count="selectedCount" :on-remove="removeSelected" />

      <EmptyStateSection v-if="!images.length">
        No images yet
      </EmptyStateSection>

      <div v-else>
        <Fancybox>
          <Grid>
            <ImageCard v-for="item in images" :key="item.id" :image="item" :selected="selection.isSelected(item.id)"
              @toggle-select="selection.toggle" @edit="openUpdateImageModal" />
          </Grid>
        </Fancybox>
      </div>
    </template>
  </div>
</template>
