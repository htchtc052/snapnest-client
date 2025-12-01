<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User } from '~/models/user'
import type { Image } from '~/models/Image'

import ImagesUploadModal from '~/components/modals/ImagesUploadModal.vue'
import ImageUpdateModal from '~/components/modals/ImageUpdateModal.vue'
import ImageDeleteModal from '~/components/modals/ImageDeleteModal.vue'

import type { ImageUpdateResult } from '~/contracts/image-update.contract'
import { formatYMD } from '~/helpers/formatYMD'
import { useOpenModal } from '~/composables/useOpenModal'
import { useAccountImages } from '~/composables/useAccountImages'

import type { PagingInfo } from '~/contracts/pagination-contract'
import {getPaging} from "~/http/get-paging";
import {useSelection} from "~/composables/useSelection";
import AppBulkActionBar from "~/components/app/AppBulkActionBar.vue";


const { user } = useSanctumAuth<User>()
const u = computed<User>(() => user.value as User)

const images = ref<Image[]>([])

const paging = ref<PagingInfo>(getPaging(null))

const error = ref<unknown | null>(null)
const isInitialLoading = ref(false)
const isLoadingMore = ref(false)

const fetchAccountImagesPage = useAccountImages()



const hasMore = computed(() => paging.value.hasMore)
const nextPage = computed(() => paging.value.nextPage)


const selection = useSelection()
const selectedImageIds = selection.keys
const selectedCount = computed(() => selectedImageIds.value.length)
const hasSelection = computed(() => selectedCount.value > 0)

type BulkAction = 'delete' | 'addToAlbum'

const bulkActions: { value: BulkAction; label: string }[] = [
  { value: 'delete', label: 'Delete' },
  { value: 'addToAlbum', label: 'Add to album' },
]

const bulkAction = ref<BulkAction | undefined>(undefined)

function applyBulkAction() {
  if (!bulkAction.value || selectedImageIds.value.length === 0) {
    console.log('No action or no images selected')
    return
  }

  console.log('Bulk action:', bulkAction.value, 'images:', selectedImageIds.value)

  // TODO: реальные действия
  // selection.clear()
  // bulkAction.value = undefined
}


function resetState() {
  images.value = []
  paging.value = getPaging(null)
  error.value = null

  selection.clear()
  bulkAction.value = undefined
}


async function loadFirstPage() {
  isInitialLoading.value = true
  resetState()

  try {
    const res = await fetchAccountImagesPage(1)
    images.value = res.data
    paging.value = getPaging(res.meta)
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load images'
  } finally {
    isInitialLoading.value = false
  }
}

onMounted(loadFirstPage)

async function loadMore() {
  if (!hasMore.value || isLoadingMore.value) return

  isLoadingMore.value = true
  try {
    const res = await fetchAccountImagesPage(nextPage.value)
    images.value.push(...res.data)
    paging.value = getPaging(res.meta)
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingMore.value = false
  }
}


const openUpload = useOpenModal<typeof ImagesUploadModal, boolean>(ImagesUploadModal)
const openDelete = useOpenModal<typeof ImageDeleteModal, boolean>(ImageDeleteModal)
const openUpdate = useOpenModal<typeof ImageUpdateModal, ImageUpdateResult>(ImageUpdateModal)

async function openUploadModal() {
  const ok = await openUpload()
  if (ok) {
    await loadFirstPage()
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
    <div class="flex items-center justify-between py-6">
      <h1 class="text-3xl font-semibold">Images</h1>
      <div class="flex gap-2">
        <UButton color="primary" @click="openUploadModal">
          <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
          Upload images
        </UButton>
      </div>
    </div>

    <AppBulkActionBar
        v-model="bulkAction"
        :selected-count="selectedCount"
        :actions="bulkActions"
        @apply="applyBulkAction"
    />

    <AppFancybox>
      <AppGrid
          :items="images"
          :is-loading="isInitialLoading"
          :error="error"
      >
        <template #default="{ item }: { item: Image }">
          <AppGridCard>
            <template #default>
              <div class="flex gap-2 items-start">
                <UCheckbox
                    :model-value="selection.isSelected(item.id)"
                    size="lg"
                    class="mt-1"
                    @update:model-value="() => selection.toggle(item.id)"
                />
                <div class="flex-1">
                  <a
                      :href="item.largeUrl"
                      data-fancybox="images"
                      :data-caption-title="item.name"
                      :data-caption-desc="item.description || ''"
                      :data-caption-date="formatYMD(item.createdAt)"
                      :data-original="`/api/images/${item.id}/original`"
                      :data-download="`/api/images/${item.id}/download`"
                      class="block"
                  >
                    <div class="aspect-square overflow-hidden rounded">
                      <img
                          :src="item.previewUrl"
                          :alt="item.name"
                          class="w-full h-full object-contain"
                      >
                    </div>
                  </a>
                  <div class="mt-2">
                    {{ item.name }}
                  </div>
                  <div class="text-xs">
                    {{ formatYMD(item.createdAt) }}
                  </div>
                </div>
              </div>
            </template>

            <template #footer>
              <div class="flex gap-2">
                <UButton
                    variant="outline"
                    class="p-1.5"
                    @click.stop="openUpdateImageModal(item)"
                >
                  <Icon
                      name="i-heroicons-pencil-square-20-solid"
                      class="w-4 h-4"
                  />
                </UButton>
                <UButton
                    variant="outline"
                    color="error"
                    class="p-1.5"
                    @click.stop="openDeleteImageModal(item)"
                >
                  <Icon
                      name="i-heroicons-trash-20-solid"
                      class="w-4 h-4"
                  />
                </UButton>
              </div>
            </template>
          </AppGridCard>
        </template>
      </AppGrid>
    </AppFancybox>


    <div v-if="hasMore" class="mt-6 flex justify-center">
      <UButton :loading="isLoadingMore" @click="loadMore">
        Load more
      </UButton>
    </div>
  </div>
</template>
