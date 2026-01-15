<script setup lang="ts">
import type { Album } from '~/types/album.model';

type AlbumPreviewAction = 'link' | 'emit'

const props = withDefaults(defineProps<{ album: Album; action?: AlbumPreviewAction }>(), {
  action: 'link',
})
const emit = defineEmits<{ (e: 'select', album: Album): void }>()
const router = useRouter()

function handleClick() {
  if (props.action === 'emit') {
    emit('select', props.album)
    return
  }
  router.push(`/account/albums/${props.album.id}`)
}
</script>

<template>
  <div class="block" role="button" tabindex="0" @click="handleClick" @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick">
    <div class="relative aspect-square overflow-hidden rounded-xl bg-muted/60 ring-1 ring-muted/60">
      <img v-if="props.album.coverPreviewUrl" :src="props.album.coverPreviewUrl" :alt="props.album.name"
        class="h-full w-full object-cover">
      <div v-else class="h-full w-full" />

      <div class="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-white">
        <div class="truncate text-sm font-medium">
          {{ props.album.name }}
        </div>
        <div class="text-xs text-white/80">
          {{ props.album.imagesCount }} images
        </div>
      </div>
    </div>
  </div>
</template>
