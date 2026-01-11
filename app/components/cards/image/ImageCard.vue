<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import BaseCard from '~/components/ui/containers/BaseCard.vue'
import BaseSelectionButton from '~/components/ui/primitives/BaseSelectionButton.vue'
import type { Image } from '~/models/Image'
import { formatYMD } from '~/utils/formatYMD'

const props = defineProps<{
  image: Image
}>()

const selectedIds = defineModel<number[]>({ default: () => [] })

const attrs = useAttrs()
const hasDelete = computed(() => typeof attrs.onDelete === 'function')

const emit = defineEmits<{
  'edit': [image: Image]
  'delete': [image: Image]
}>()

</script>

<template>
  <BaseCard>
    <div class="flex gap-2 items-start">
      <BaseSelectionButton v-model="selectedIds" :id="props.image.id" class="mt-1" />

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
      <UButton v-if="hasDelete" color="error" variant="outline" class="p-1.5" @click.stop="emit('delete', props.image)">
        <Icon name="i-heroicons-trash-20-solid" class="w-4 h-4" />
      </UButton>
    </div>
  </BaseCard>
</template>
