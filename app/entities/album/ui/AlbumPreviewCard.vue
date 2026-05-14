<script setup lang="ts">
import { computed } from '#imports'
import type { Album } from '../model'
import { mapAlbumToAlbumPreviewCard } from './mapAlbumToAlbumPreviewCard'

const props = defineProps<{
  album: Album
}>()

const card = computed(() => mapAlbumToAlbumPreviewCard(props.album))
</script>

<template>
  <UPageCard variant="outline" class="h-full">
    <template #title>
      <div class="space-y-2">
        <div class="flex min-w-0 items-center gap-2">
          <span class="min-w-0 flex-1 truncate">
            {{ card.name }}
          </span>

          <UBadge v-if="card.isShared" color="primary" variant="soft" size="xs">
            Shared
          </UBadge>
        </div>

        <div class="text-xs font-medium text-muted-500">
          {{ card.imagesCountLabel }}
        </div>
      </div>
    </template>

    <div
      class="aspect-square w-full overflow-hidden rounded-lg"
      :class="card.coverPreviewUrl ? 'bg-muted' : 'border border-dashed border-muted bg-elevated/60'"
    >
      <img
        v-if="card.coverPreviewUrl"
        :src="card.coverPreviewUrl"
        :alt="card.coverAlt"
        class="h-full w-full object-cover"
      >

      <div
        v-else
        class="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-muted-500"
      >
        <UIcon name="i-lucide-image-off" class="size-8" />
        <p class="text-sm font-medium text-toned">
          {{ card.emptyLabel }}
        </p>
      </div>
    </div>
  </UPageCard>
</template>
