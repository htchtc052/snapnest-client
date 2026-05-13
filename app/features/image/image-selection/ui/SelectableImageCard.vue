<script setup lang="ts">
import { computed } from '#imports'
import { ImageCard, type Image } from '~/entities/image'
import type { ImageSelection } from '../model/useImageSelection'

const props = defineProps<{
  image: Image
  selection: ImageSelection
}>()

const isSelectionMode = computed(() => props.selection.mode.isSelectionMode.value)
const isSelected = computed(() => props.selection.isSelected(props.image.id))
const cardAriaLabel = computed(() => {
  return isSelectionMode.value ? `Select ${props.image.name}` : props.image.name
})

function selectFromCard() {
  if (!isSelectionMode.value) return

  props.selection.toggle(props.image.id)
}

function toggleSelection() {
  props.selection.toggle(props.image.id)
}
</script>

<template>
  <div class="relative">
    <ImageCard :image="image" />

    <button
      type="button"
      class="absolute inset-0 z-0 block w-full rounded-lg text-left disabled:cursor-default"
      :disabled="!isSelectionMode"
      :aria-label="cardAriaLabel"
      @click="selectFromCard"
    />

    <UCheckbox
      :model-value="isSelected"
      color="primary"
      class="absolute top-2 left-2 z-10"
      @click.stop
      @update:model-value="toggleSelection"
    />
  </div>
</template>
