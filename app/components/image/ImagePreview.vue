<script setup lang="ts">
import type { Image } from '~/models/Image';

const props = defineProps<{ image: Image }>()
</script>

<template>
  <div class="aspect-square overflow-hidden">
    <img v-if="props.image.previewUrl" :src="props.image.previewUrl" :alt="props.image.name"
      class="h-full w-full object-cover">
    <div v-else class="h-full w-full bg-gray-200" />
  </div>
</template>
