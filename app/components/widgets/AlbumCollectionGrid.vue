<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { AccountAlbum } from '~/types/account-album.model'

const props = defineProps<{
  albums: AccountAlbum[]
  getAlbumMenuItems: (album: AccountAlbum) => DropdownMenuItem[][]
}>()

function albumImagesLabel(imagesCount: number) {
  return `${imagesCount} photo${imagesCount === 1 ? '' : 's'}`
}
</script>

<template>
  <UPageGrid class="grid-cols-2 gap-5 pb-8 md:grid-cols-3 lg:grid-cols-4">
    <UPageCard
      v-for="album in props.albums"
      :key="album.id"
      variant="outline"
    >
      <template #title>
        <div class="space-y-2">
          <div class="flex min-w-0 items-center justify-between gap-2">
            <NuxtLink :to="`/account/albums/${album.id}`" class="min-w-0 flex-1 truncate">
              {{ album.name }}
            </NuxtLink>

            <UBadge v-if="album.isPublic" color="primary" variant="soft" size="xs">
              Shared
            </UBadge>

            <UDropdownMenu :items="getAlbumMenuItems(album)" :content="{ align: 'end' }">
              <UButton
                icon="i-heroicons-ellipsis-vertical-20-solid"
                color="neutral"
                variant="soft"
                size="xs"
                square
                class="shrink-0"
                @click.stop
              />
            </UDropdownMenu>
          </div>

          <div class="text-xs font-medium text-muted-500">
            {{ albumImagesLabel(album.imagesCount) }}
          </div>
        </div>
      </template>

      <NuxtLink :to="`/account/albums/${album.id}`" class="block">
        <div
          class="aspect-square w-full overflow-hidden rounded-lg"
          :class="album.coverPreviewUrl ? 'bg-muted' : 'border border-dashed border-muted bg-elevated/60'"
        >
          <img
            v-if="album.coverPreviewUrl"
            :src="album.coverPreviewUrl"
            :alt="album.name || ''"
            class="h-full w-full object-cover"
          >

          <div
            v-else
            class="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-muted-500"
          >
            <UIcon name="i-lucide-image-off" class="size-8" />
            <p class="text-sm font-medium text-toned">
              Empty album
            </p>
          </div>
        </div>
      </NuxtLink>
    </UPageCard>
  </UPageGrid>
</template>