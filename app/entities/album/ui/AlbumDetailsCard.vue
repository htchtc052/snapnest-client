<script setup lang="ts">
import { computed } from '#imports'
import type { Album } from '../model'
import { mapAlbumToAlbumDetailsCard } from './mapAlbumToAlbumDetailsCard'

const props = defineProps<{
  album: Album
}>()

const card = computed(() => mapAlbumToAlbumDetailsCard(props.album))
</script>

<template>
  <div class="flex min-w-0 items-start gap-4">
    <img
      v-if="card.coverPreviewUrl"
      :src="card.coverPreviewUrl"
      :alt="card.coverAlt"
      class="h-16 w-16 shrink-0 rounded-lg object-cover"
    >

    <div class="min-w-0">
      <h3 v-if="card.name" class="truncate text-2xl font-semibold text-foreground">
        {{ card.name }}
      </h3>

      <div class="mt-1 min-w-0 space-y-1">
        <p class="text-sm text-muted">
          {{ card.ownerNameLabel }}
        </p>

        <p class="text-sm text-muted">
          {{ card.metaLabel }}
        </p>
      </div>
    </div>
  </div>
</template>
