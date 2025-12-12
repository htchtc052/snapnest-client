<script setup lang="ts">
import type { Album } from '~/models/Album'
import AlbumCard from '~/components/card/AlbumCard.vue'
import AppCard from '~/components/app/Card.vue'

const props = defineProps<{
  album: Album
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: [albumId: number]
}>()
</script>

<template>
  <AppCard>
    <button
        type="button"
        class="w-full text-left disabled:opacity-75"
        :disabled="props.disabled"
        @click="emit('select', props.album.id)"
    >
      <AlbumCard :album="props.album" />
    </button>
  </AppCard>
</template>
