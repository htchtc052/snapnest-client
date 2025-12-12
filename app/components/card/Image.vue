<script setup lang="ts">
import AppCard from "~/components/app/Card.vue";
import { formatYMD } from '~/helpers/formatYMD';
import type { Image } from '~/models/Image';

const props = defineProps<{
  image: Image
  selected: boolean
}>()

const emit = defineEmits<{
  'toggle-select': [id: number]
  'edit': [image: Image]
}>()

</script>

<template>
  <AppCard>
    <div class="flex gap-2 items-start">
      <UCheckbox :model-value="props.selected" size="lg" class="mt-1"
        @update:model-value="() => emit('toggle-select', props.image.id)" />

      <div class="flex-1">
        <a :href="props.image.largeUrl" data-fancybox="app" :data-caption-title="props.image.name"
          :data-caption-desc="props.image.description || ''" :data-caption-date="formatYMD(props.image.createdAt)"
          :data-original="`/api/images/${props.image.id}/original`"
          :data-download="`/api/images/${props.image.id}/download`" class="block">
          <div class="aspect-square overflow-hidden rounded">
            <img :src="props.image.previewUrl" :alt="props.image.name" class="w-full h-full object-contain">
          </div>
        </a>

        <div class="mt-2">
          {{ props.image.name }}
        </div>
        <div class="text-xs">
          {{ formatYMD(props.image.createdAt) }}
        </div>
      </div>
    </div>

    <div class="mt-2 flex gap-2">
      <UButton variant="outline" class="p-1.5" @click.stop="emit('edit', props.image)">
        <Icon name="i-heroicons-pencil-square-20-solid" class="w-4 h-4" />
      </UButton>
    </div>
  </AppCard>
</template>
