<script setup lang="ts">
import AlbumCard from '~/components/cards/album/AlbumCard.vue'
import BaseCard from '~/components/cards/base/Card.vue'
import type { Album } from '~/models/Album'

const props = defineProps<{
  album: Album
  selected: boolean
}>()

const emit = defineEmits<{
  'toggle-select': [id: number]
  'edit': [album: Album]
}>()
</script>

<template>
  <BaseCard>
    <div class="flex gap-2 items-start">
      <UCheckbox :model-value="props.selected" size="lg" class="mt-1"
        @update:model-value="() => emit('toggle-select', props.album.id)" />

      <div class="flex-1">
        <NuxtLink :to="`/account/albums/${props.album.id}`" class="block">
          <AlbumCard :album="props.album" />
        </NuxtLink>
      </div>
    </div>

    <div class="mt-2 flex gap-2">
      <UButton variant="outline" class="p-1.5" @click.stop="emit('edit', props.album)">
        <Icon name="i-heroicons-pencil-square-20-solid" class="w-4 h-4" />
      </UButton>

    </div>
  </BaseCard>
</template>
