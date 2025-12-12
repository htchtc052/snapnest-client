<script setup lang="ts">
import AlbumCard from '~/components/card/Album/AlbumCard.vue'
import BaseCard from '~/components/card/BaseCard.vue'
import type { Album } from '~/models/Album'

const props = defineProps<{
  album: Album
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: [albumId: number]
}>()
</script>

<template>
  <BaseCard>
    <button type="button" class="w-full text-left disabled:opacity-75" :disabled="props.disabled"
      @click="emit('select', props.album.id)">
      <AlbumCard :album="props.album" />
    </button>
  </BaseCard>
</template>
