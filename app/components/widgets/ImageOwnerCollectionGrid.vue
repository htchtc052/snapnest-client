<script setup lang="ts">
import { ref, useTemplateRef } from '#imports'
import { formatDate, useInfiniteScroll, useWindowSize } from '@vueuse/core'
import type { Image } from '~/types/image.model'

const props = withDefaults(defineProps<{
  images: Image[]
  selectedIds: number[]
  selectionMode?: boolean
  canOpen?: boolean
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => Promise<unknown> | undefined
}>(), {
  selectionMode: false,
  canOpen: true,
  hasMore: false,
  isLoadingMore: false,
  onLoadMore: undefined,
})

const emit = defineEmits<{
  (e: 'open' | 'toggle-selection', value: number): void
}>()


const scrollArea = useTemplateRef<{ $el?: HTMLElement }>('scrollArea')

function handleCardClick(imageId: number) {
  if (props.selectionMode) {
    emit('toggle-selection', imageId)
    return
  }

  if (props.canOpen) {
    emit('open', imageId)
  }
}

onMounted(() => {
  useInfiniteScroll(
    scrollArea.value?.$el,
    () => {
      void props.onLoadMore?.()
    },
    {
      distance: 480,
      canLoadMore: () => props.hasMore && !props.isLoadingMore,
    },
  )
})


const { width } = useWindowSize()

const lanes = computed(() => {
  return width.value < 640 ? 3 : 4
})
</script>

<template>
  <div class="relative flex min-h-0 flex-1 flex-col">
    <UScrollArea ref="scrollArea" v-slot="{ item: image }" :items="images"
      :virtualize="{ estimateSize: 240, gap: 12, lanes }" class="min-h-0 flex-1">

      <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
        <div class="flex flex-col">
          <div class="relative">
            <button type="button" class="block w-full text-left" :disabled="!selectionMode && !canOpen"
              :aria-label="selectionMode ? `Select ${image.name}` : canOpen ? `Open ${image.name}` : image.name"
              @click="handleCardClick(image.id)">
              <img :src="image.previewUrl" :alt="image.name" class="aspect-square w-full object-cover">
            </button>

            <UCheckbox :model-value="selectedIds.includes(image.id)" color="primary" class="absolute top-2 left-2 z-10"
              @click.stop @update:model-value="emit('toggle-selection', image.id)" />
          </div>

          <div class="bg-default p-2">
            <p class="truncate text-sm font-medium text-highlighted">
              {{ image.name }}
            </p>
            <p class="text-xs text-muted">
              {{ formatDate(new Date(image.capturedAt), 'YYYY.MM.DD') }}
            </p>
          </div>
        </div>
      </UPageCard>
    </UScrollArea>
  </div>
</template>
