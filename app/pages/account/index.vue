<script setup lang="ts">
import ImagePreview from '~/components/image/ImagePreview.vue'
import ImagesSelectionBar from '~/components/image/ImagesSelectionBar.vue'
import ImagesSelectionModeMobileToggle from '~/components/image/ImagesSelectionModeMobileToggle.vue'
import ImagesFeedTimeline from '~/components/image/ImagesFeedTimeline.vue'
import ImagesUploadModal from '~/components/modals/image/ImagesUploadModal.vue'
import { useOpenModal } from '~/composables/useOpenModal'
import { useGetImages } from '~/composables/useGetImages'
import { provideSelectionStore } from '~/composables/useSelection'
import type { Image } from '~/models/Image'

definePageMeta({
  layout: 'media',
})

const {
  groups,
  isLoading,
  isLoadingMore,
  grouping,
  resetAndReload,
  removeImages,
  scrollToGroup,
  activeGroupIndex,
  scrollArea,
} = useGetImages()

const {
  selectedImagesData,
  selectionMode,
  hasSelection,
  toggleSelection,
  groupSelectionValue,
  toggleGroupSelection,
} = provideSelectionStore()

const openUpload = useOpenModal<typeof ImagesUploadModal, boolean>(ImagesUploadModal)

const groupingTabs = [
  { label: 'Days', value: 'day' },
  { label: 'Months', value: 'month' },
  { label: 'Years', value: 'year' },
]

async function openUploadModal() {
  const ok = await openUpload()
  if (!ok) return
  await resetAndReload()
}

function handleImageClick(image: Image) {
  if (!selectionMode.value) return
  toggleSelection(image)
}

</script>

<template>
  <div class="relative h-full min-h-0">
    <div v-if="hasSelection" class="pointer-events-none absolute left-4 right-4 top-3 z-20">
      <div class="pointer-events-auto">
        <ImagesSelectionBar @deleted="removeImages" />
      </div>
    </div>

    <div class="h-full min-h-0 overflow-y-auto">
      <div class="flex items-center justify-end gap-2 py-5 px-4">
        <ImagesSelectionModeMobileToggle />
        <UButton color="primary" @click="openUploadModal">
          <UIcon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2 h-4 w-4" />
          Upload images
        </UButton>
      </div>

      <div class="flex items-center justify-between gap-4 px-4 pb-4">
        <h3 class="text-2xl font-semibold text-foreground">
          Photos
        </h3>
        <UTabs
          v-model="grouping"
          :items="groupingTabs"
          :content="false"
          color="neutral"
          variant="pill"
          size="sm"
        />
      </div>

      <template v-if="isLoading">
        <USkeleton class="mx-4 h-40" />
      </template>

      <template v-else>
        <div v-if="groups.length === 0" class="px-4 py-8 text-center text-sm text-muted-500">
          No images yet
        </div>

        <div v-else class="flex h-full min-h-0 items-stretch gap-3">
          <UScrollArea
            ref="scrollArea"
            v-slot="{ item, index }"
            :items="groups"
            :virtualize="{ estimateSize: 320, overscan: 400 }"
            class="h-full min-h-0 min-w-0 flex-1"
          >
            <div
              class="space-y-3 px-4 py-3"
              :class="index === groups.length - 1 ? '' : 'border-b border-muted-200'"
              :data-group-index="index"
            >
              <div class="flex items-center gap-3">
                <UCheckbox
                  :model-value="groupSelectionValue(item.items)"
                  color="primary"
                  @click.stop
                  @update:model-value="() => toggleGroupSelection(item.items)"
                />
                <div class="flex flex-wrap items-center gap-2">
                  <p class="truncate text-lg font-semibold text-foreground">
                    {{ item.label }}
                  </p>
                  <span class="text-sm text-muted-500">
                    {{ item.items.length }} items
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                <div
                  v-for="image in item.items"
                  :key="image.id"
                  class="group relative aspect-square overflow-hidden rounded-lg bg-muted-100"
                  :class="selectedImagesData[image.id] ? 'ring-2 ring-primary/40' : ''"
                  @click="handleImageClick(image)"
                >
                  <div class="absolute inset-0 pointer-events-none">
                    <ImagePreview :image="image" />
                  </div>

                  <div
                    class="absolute bottom-2 left-2 z-10 pointer-events-auto"
                    :class="selectionMode ? 'opacity-100' : 'hidden sm:block sm:opacity-0 sm:group-hover:opacity-100'"
                  >
                    <UCheckbox
                      :model-value="Boolean(selectedImagesData[image.id])"
                      color="primary"
                      @click.stop
                      @update:model-value="() => toggleSelection(image)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </UScrollArea>

          <ImagesFeedTimeline
            :groups="groups"
            :active-index="activeGroupIndex"
            @select="scrollToGroup"
          />
        </div>

        <div v-if="isLoadingMore" class="px-4 py-2">
          <UProgress indeterminate size="xs" />
        </div>
      </template>
    </div>
  </div>
</template>
