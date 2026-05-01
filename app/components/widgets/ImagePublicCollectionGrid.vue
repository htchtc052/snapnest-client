<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from '#imports'
import { formatDate, useInfiniteScroll, useWindowSize } from '@vueuse/core'
import type { Image } from '~/types/image.model'

const props = withDefaults(defineProps<{
  images: Image[]
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => Promise<unknown> | undefined
}>(), {
  hasMore: false,
  isLoadingMore: false,
  onLoadMore: undefined,
})

const emit = defineEmits<{
  (e: 'open', value: number): void
}>()

const scrollArea = useTemplateRef<{ $el?: HTMLElement }>('scrollArea')

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
  return width.value < 640 ? 2 : 4
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <UScrollArea
      ref="scrollArea"
      v-slot="{ item: image }"
      :items="images"
      :virtualize="{ estimateSize: 240, gap: 12, lanes }"
      class="min-h-0 flex-1"
    >
      <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
        <div class="flex flex-col">
          <button
            type="button"
            class="block w-full text-left"
            :aria-label="`Open ${image.name}`"
            @click="emit('open', image.id)"
          >
            <img
              :src="image.previewUrl"
              :alt="image.name"
              class="aspect-square w-full object-cover"
            >
          </button>

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