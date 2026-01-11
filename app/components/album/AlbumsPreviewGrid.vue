<script setup lang="ts">
import AlbumPreview from '~/components/album/AlbumPreview.vue';
import BaseGrid from '~/components/ui/containers/BaseGrid.vue';
import type { Album } from '~/models/Album';

const props = defineProps<{
  albums: Album[]
}>()
</script>

<template>
  <BaseGrid grid-class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <AlbumPreview v-for="album in props.albums" :key="album.id" :album="album" />
  </BaseGrid>
</template>
