<script setup lang="ts">
import { computed } from '#imports'
import type { Album } from '../model'
import type { AlbumHeaderAction } from './albumHeaderAction'
import { mapAlbumToAlbumHeader } from './mapAlbumToAlbumHeader'

const props = withDefaults(defineProps<{
  album: Album
  actions?: AlbumHeaderAction[]
}>(), {
  actions: () => [],
})

const header = computed(() => mapAlbumToAlbumHeader(props.album))
const hasActions = computed(() => props.actions.length > 0)
</script>

<template>
  <div class="flex items-start justify-between gap-3 pt-5 pb-4">
    <div class="flex min-w-0 items-start gap-4">
      <img
        v-if="header.coverPreviewUrl"
        :src="header.coverPreviewUrl"
        :alt="header.coverAlt"
        class="h-16 w-16 shrink-0 rounded-lg object-cover"
      >

      <div class="min-w-0">
        <h3 v-if="header.name" class="truncate text-2xl font-semibold text-foreground">
          {{ header.name }}
        </h3>

        <div class="mt-1 min-w-0 space-y-1">
          <p class="text-sm text-muted">
            {{ header.ownerNameLabel }}
          </p>

          <p class="text-sm text-muted">
            {{ header.metaLabel }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="hasActions" class="flex min-w-0 items-center gap-2">
      <UButton
        v-for="action in actions"
        :key="action.key"
        :icon="action.icon"
        :color="action.color"
        :variant="action.variant"
        :loading="action.loading"
        :disabled="action.disabled"
        @click="action.onClick()"
      >
        {{ action.label }}
      </UButton>
    </div>
  </div>
</template>
